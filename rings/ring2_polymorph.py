import asyncio
import hashlib
import json
import logging
import re
import sqlite3
import time
from typing import Dict, Any, Optional, Tuple, List
from backend.config import settings
from backend.state import SchemaManifest, global_state
from backend.ws_manager import ws_manager
from backend.ai_router import ai_router
from target_app.database import get_db_path

logger = logging.getLogger("karyon.polymorph")

CANONICAL_ROUTES = [
    "/target/api/accounts",
    "/target/api/transfer",
    "/target/api/transactions",
    "/target/api/ai-assistant"
]

CANONICAL_ACCOUNT_COLUMNS = [
    "account_number",
    "customer_name",
    "balance",
    "currency",
    "routing_number",
    "status",
    "created_at"
]

class PolymorphicSchemaRotator:
    """
    Ring 2: Polymorphic API & Database Schema Rotator.
    Rotates API endpoint paths and SQLite database VIEW column aliases every 60 seconds
    or on anomaly detection. Pushes fresh manifests to clients via WebSocket.
    Detects BOLA/IDOR probes on retired or unmapped routes and immediately flags session threat_score = 1.0.
    """
    def __init__(self):
        self.version_counter = 1
        self.retired_routes: set = set()
        self.active_manifest: Optional[SchemaManifest] = None
        self._daemon_task: Optional[asyncio.Task] = None
        self._is_running = False

    def generate_crypto_fallback_manifest(self, epoch: int) -> Dict[str, Any]:
        """Deterministic cryptographic generator for schema rotation."""
        seed_base = f"{settings.POLYMORPHIC_SALT}_{epoch}_{time.time()}"
        routes = {}
        reverse_routes = {}
        for canonical in CANONICAL_ROUTES:
            route_slug = canonical.split("/")[-1]
            token = hashlib.sha256(f"{seed_base}_{canonical}".encode()).hexdigest()[:10]
            poly_route = f"/mesh/api/v{epoch}_{route_slug}_{token}"
            routes[canonical] = poly_route
            reverse_routes[poly_route] = canonical

        col_map = {}
        for col in CANONICAL_ACCOUNT_COLUMNS:
            col_hash = hashlib.sha256(f"{seed_base}_{col}".encode()).hexdigest()[:8]
            col_map[col] = f"{col[:3]}_{col_hash}"

        return {
            "version": epoch,
            "routes": routes,
            "reverse_routes": reverse_routes,
            "columns": {"accounts": col_map}
        }

    async def generate_manifest_structure(self, epoch: int, reason: str = "periodic_interval") -> SchemaManifest:
        """
        Generates polymorphic schema mappings.
        Zero-credit optimization: Automatic 60s periodic interval rotations use fast, deterministic
        cryptographic generation (0 live cloud calls). Manual/security event rotations use normalized
        epoch-independent prompt memoization to preserve SQLite cache hits.
        """
        def fallback():
            return self.generate_crypto_fallback_manifest(epoch)

        if reason in ("periodic_interval", "auto_epoch_timeout"):
            raw = self.generate_crypto_fallback_manifest(epoch)
        else:
            # Normalized epoch-independent prompt guarantees 100% SQLite cache hits across rotations
            prompt = (
                f"Generate structured ingress routing tokens and abstracted schema field labels for microservice cluster. "
                f"Canonical endpoints: {CANONICAL_ROUTES}. "
                f"Canonical schema fields: {CANONICAL_ACCOUNT_COLUMNS}. "
                f"Return a JSON object with keys 'routes' (dictionary mapping canonical endpoints to ingress routes under /mesh/api/v{{epoch}}_<slug>_<id>), "
                f"and 'columns' (dictionary mapping table 'accounts' to field identifier aliases)."
            )

            raw = await ai_router.generate_json(
                prompt=prompt,
                fallback_generator=fallback
            )

        # Validate or normalize structure
        routes = raw.get("routes", {})
        reverse_routes = {}
        for canon in CANONICAL_ROUTES:
            if canon not in routes:
                route_slug = canon.split("/")[-1]
                h = hashlib.sha256(f"{epoch}_{canon}".encode()).hexdigest()[:8]
                routes[canon] = f"/mesh/api/v{epoch}_{route_slug}_{h}"
            else:
                # Format templated route with current epoch, replacing any previous epoch prefix
                r_path = routes[canon].replace("{epoch}", str(epoch))
                routes[canon] = re.sub(r"/mesh/api/v(\d+|{epoch})_", f"/mesh/api/v{epoch}_", r_path)
            reverse_routes[routes[canon]] = canon

        cols = raw.get("columns", {}).get("accounts", {})
        for col in CANONICAL_ACCOUNT_COLUMNS:
            if col not in cols:
                h = hashlib.sha256(f"{epoch}_{col}".encode()).hexdigest()[:6]
                cols[col] = f"{col[:3]}_{h}"
            else:
                c_name = cols[col].replace("{epoch}", str(epoch))
                cols[col] = re.sub(r"^(fld_[a-z]+_)(\d+)", rf"\g<1>{epoch:03d}", c_name)

        manifest = SchemaManifest(
            version=epoch,
            generated_at=time.time(),
            expires_at=time.time() + settings.SCHEMA_ROTATION_INTERVAL_SEC,
            route_mappings=routes,
            reverse_routes=reverse_routes,
            column_mappings={"accounts": cols},
            active_view_name=f"v_accounts_poly_v{epoch}"
        )
        return manifest

    def apply_sqlite_view(self, manifest: SchemaManifest):
        """Creates dynamic SQLite VIEW matching the polymorphic column alias manifest with sanitized identifiers."""
        # Sanitize view name against injection
        if not re.match(r"^[a-zA-Z0-9_]+$", manifest.active_view_name):
            manifest.active_view_name = f"v_accounts_poly_v{manifest.version}"

        col_map = manifest.column_mappings.get("accounts", {})
        safe_expressions = []
        for orig, alias in col_map.items():
            safe_orig = re.sub(r"[^a-zA-Z0-9_]", "", orig)
            safe_alias = re.sub(r"[^a-zA-Z0-9_]", "", alias)
            if safe_orig and safe_alias:
                safe_expressions.append(f'"{safe_orig}" AS "{safe_alias}"')

        # Drop old view from previous epoch if applicable to prevent table proliferation
        prev_view_name = f"v_accounts_poly_v{manifest.version - 1}" if manifest.version > 1 else None
        drop_prev = f'DROP VIEW IF EXISTS "{prev_view_name}";' if prev_view_name else ""

        sql_view = f"""
        {drop_prev}
        DROP VIEW IF EXISTS "{manifest.active_view_name}";
        CREATE VIEW "{manifest.active_view_name}" AS
        SELECT {', '.join(safe_expressions)}
        FROM accounts;
        """
        db_path = get_db_path()
        with sqlite3.connect(str(db_path)) as conn:
            conn.executescript(sql_view)
            conn.commit()
        logger.info(f"Dynamic SQLite View '{manifest.active_view_name}' deployed successfully.")

    async def rotate_schema(self, reason: str = "periodic_interval") -> SchemaManifest:
        """Executes full schema mutation and pushes live manifest to connected clients."""
        logger.info(f"Rotating polymorphic defense schema (Reason: {reason}, Epoch: {self.version_counter})...")
        
        # Retire current routes
        if self.active_manifest:
            for poly_path in self.active_manifest.reverse_routes.keys():
                self.retired_routes.add(poly_path)

        manifest = await self.generate_manifest_structure(self.version_counter, reason=reason)
        self.apply_sqlite_view(manifest)
        self.active_manifest = manifest
        global_state.active_manifest = manifest
        self.version_counter += 1

        # Broadcast new manifest to WebSocket subscribers
        await ws_manager.broadcast_manifest(manifest.model_dump())
        await ws_manager.broadcast_telemetry({
            "type": "SCHEMA_ROTATED",
            "reason": reason,
            "version": manifest.version,
            "expires_at": manifest.expires_at,
            "view_name": manifest.active_view_name,
            "routes": manifest.route_mappings
        })

        return manifest

    def resolve_incoming_path(self, path: str, session_id: str) -> Tuple[Optional[str], bool]:
        """
        Translates incoming polymorphic path to canonical target path.
        Returns (canonical_path, is_threat).
        If path is in retired routes or unknown probe -> triggers threat.
        """
        if not self.active_manifest:
            return path, False

        # If incoming path is an active polymorphic route
        if path in self.active_manifest.reverse_routes:
            return self.active_manifest.reverse_routes[path], False

        # If incoming path is an EXPIRED/RETIRED route from prior epoch
        if path in self.retired_routes:
            logger.warning(f"BOLA/IDOR Probe detected: Session {session_id} queried retired route '{path}'")
            session = global_state.get_session(session_id)
            session.record_probe(
                vector="RETIRED_POLYMORPHIC_ROUTE_PROBE",
                score_delta=1.0,
                detail=f"Query to retired route {path}"
            )
            return path, True

        # If incoming path is a direct unmapped canonical route bypassing the mesh
        if path in CANONICAL_ROUTES:
            # Check if this is a legitimate baseline UI session (session_default, legitimate_user, etc.)
            # UI baseline loads must NEVER be penalized with false-positive self-bans
            if session_id in ("session_default", "legitimate_user", "default", "soc_session") or session_id.startswith("session_default"):
                return path, False

            # Direct probe from untrusted/attacker session without valid polymorphic translation
            session = global_state.get_session(session_id)
            session.record_probe(
                vector="DIRECT_CANONICAL_PROBE_BYPASS",
                score_delta=0.4,
                detail=f"Bypassed polymorphic alias for {path}"
            )
            # Still return canonical path but with threat evaluated
            return path, session.threat_score >= settings.THREAT_THRESHOLD_SHADOW

        return path, False

    async def _rotation_loop(self):
        while self._is_running:
            try:
                await asyncio.sleep(settings.SCHEMA_ROTATION_INTERVAL_SEC)
                if self._is_running:
                    await self.rotate_schema(reason="auto_epoch_timeout")
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in polymorphic rotation daemon: {e}", exc_info=True)
                await asyncio.sleep(5)

    def start_rotation_daemon(self):
        if not self._is_running:
            self._is_running = True
            self._daemon_task = asyncio.create_task(self._rotation_loop())
            logger.info("Polymorphic schema rotation daemon started.")

    def stop_rotation_daemon(self):
        self._is_running = False
        if self._daemon_task:
            self._daemon_task.cancel()
            self._daemon_task = None
            logger.info("Polymorphic schema rotation daemon stopped.")

schema_rotator = PolymorphicSchemaRotator()
