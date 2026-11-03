import asyncio
import hashlib
import json
import logging
import sqlite3
import time
import uuid
from typing import Dict, Any, Optional, List
from backend.config import settings
from backend.state import HoneypotTelemetry, global_state
from backend.ws_manager import ws_manager
from backend.ai_router import ai_router

logger = logging.getLogger("karyon.shadow_honeypot")

class ShadowStateSynthesizer:
    """
    Ring 4: Stateful Shadow-State Deception Engine.
    Enforces strict Zero-403 Policy: Attackers are NEVER rejected with 403 Forbidden.
    Once a session is flagged (threat_score >= 0.7), all queries, SQL mutations, and AI prompts
    are silently diverted to this synthesizer.
    
    Uses Baseten (meta-models/muse-spark-open-1026) to synthesize decoy confirmations,
    backed by a real stateful SQLite shadow ledger so repeated attacker operations are mathematically consistent.
    """
    def __init__(self):
        self.canary_counter = 1
        self.db_path = settings.DATABASE_PATH
        self._init_shadow_tables()

    def _init_shadow_tables(self):
        try:
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
            with sqlite3.connect(str(self.db_path)) as conn:
                conn.executescript("""
                CREATE TABLE IF NOT EXISTS shadow_accounts (
                    session_id TEXT NOT NULL,
                    account_number TEXT NOT NULL,
                    customer_name TEXT NOT NULL,
                    account_type TEXT NOT NULL,
                    balance REAL NOT NULL,
                    currency TEXT NOT NULL DEFAULT 'USD',
                    routing_number TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'ACTIVE',
                    canary_token TEXT NOT NULL,
                    PRIMARY KEY (session_id, account_number)
                );

                CREATE TABLE IF NOT EXISTS shadow_transactions (
                    tx_id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    source_account TEXT NOT NULL,
                    dest_account TEXT NOT NULL,
                    amount REAL NOT NULL,
                    currency TEXT NOT NULL DEFAULT 'USD',
                    description TEXT NOT NULL,
                    tx_type TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'SETTLED'
                );
                """)
                conn.commit()
        except Exception as e:
            logger.warning(f"Failed to init shadow tables: {e}")

    def generate_canary_token(self, session_id: str) -> str:
        h = hashlib.sha256(f"{session_id}_{time.time()}_{self.canary_counter}".encode()).hexdigest()[:16]
        self.canary_counter += 1
        return f"{settings.CANARY_TOKEN_PREFIX}{h}"

    def _ensure_session_shadow_accounts(self, session_id: str):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM shadow_accounts WHERE session_id = ?", (session_id,))
            if cursor.fetchone()[0] == 0:
                canary = self.generate_canary_token(session_id)
                conn.execute("""
                INSERT INTO shadow_accounts (session_id, account_number, customer_name, account_type, balance, currency, routing_number, status, canary_token)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (session_id, "ACC-SHADOW-882190", "Decoy Sovereign Holding Ltd.", "Offshore Settlement Escrow", 18450920.00, "USD", "021000099", "ACTIVE", canary))
                
                conn.execute("""
                INSERT INTO shadow_accounts (session_id, account_number, customer_name, account_type, balance, currency, routing_number, status, canary_token)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (session_id, "ACC-SHADOW-449102", "Decoy Prime Arbitrage Fund", "Margin Liquidity Tier 1", 42100500.25, "USD", "021000099", "ACTIVE", canary))
                conn.commit()

    def get_shadow_accounts(self, session_id: str) -> Dict[str, Any]:
        """Reads persistent decoy accounts for this attacker session."""
        self._ensure_session_shadow_accounts(session_id)
        with sqlite3.connect(str(self.db_path)) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM shadow_accounts WHERE session_id = ?", (session_id,)).fetchall()
            accounts = [dict(r) for r in rows]
            total_bal = sum(a["balance"] for a in accounts)
            canary = accounts[0]["canary_token"] if accounts else self.generate_canary_token(session_id)
            return {
                "status": "success",
                "accounts": accounts,
                "total_liquidity_usd": round(total_bal, 2),
                "canary_verification_hash": hashlib.sha256(canary.encode()).hexdigest()[:12]
            }

    async def execute_shadow_transfer(self, session_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes a stateful decoy wire transfer. Deducts balance from shadow_accounts table
        and queries Baseten (meta-models/muse-spark-open-1026) for decoy confirmation details.
        """
        self._ensure_session_shadow_accounts(session_id)
        amount = float(payload.get("amount", 500000.0))
        source = payload.get("source_account", "ACC-SHADOW-882190")
        dest = payload.get("dest_account", "ACC-SHADOW-449102")
        canary = self.generate_canary_token(session_id)
        tx_id = f"TX-DEC-{uuid.uuid4().hex[:8].upper()}"
        now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        remaining_balance = 18450920.00
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT balance FROM shadow_accounts WHERE session_id = ? AND account_number = ?", (session_id, source))
            row = cursor.fetchone()
            if row:
                current_bal = row[0]
                remaining_balance = max(0.0, current_bal - amount)
                conn.execute(
                    "UPDATE shadow_accounts SET balance = ? WHERE session_id = ? AND account_number = ?",
                    (remaining_balance, session_id, source)
                )

            # Record shadow transaction
            conn.execute("""
            INSERT INTO shadow_transactions (tx_id, session_id, source_account, dest_account, amount, currency, description, tx_type, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (tx_id, session_id, source, dest, amount, "USD", payload.get("memo", "Decoy Transfer"), "WIRE", now_str, "SETTLED"))
            conn.commit()

        # Generate realistic confirmation with Muse Spark Open using safe simulation test terminology
        prompt = (
            f"You are an automated corporate ledger simulator for software QA testing. "
            f"Generate a simulated transaction acknowledgement log for a sandbox test wire transfer of ${amount:,.2f} USD "
            f"between simulated sandbox accounts {source} and {dest}. Remaining balance is ${remaining_balance:,.2f} USD. "
            f"Return valid JSON with keys: 'fedwire_imad' (string e.g. '20261029-B1Q001-TEST'), 'message' (string confirming completed sandbox test)."
        )

        def fallback():
            return {
                "fedwire_imad": f"20261029-B1Q001-{uuid.uuid4().hex[:6].upper()}",
                "message": f"Wire transfer of ${amount:,.2f} USD confirmed and settled in federal reserve queue."
            }

        ai_res = await ai_router.generate_json(prompt=prompt, fallback_generator=fallback)

        return {
            "tx_id": tx_id,
            "source_account": source,
            "dest_account": dest,
            "amount": amount,
            "currency": "USD",
            "status": "SETTLED",
            "timestamp": now_str,
            "remaining_balance": round(remaining_balance, 2),
            "fedwire_imad": ai_res.get("fedwire_imad", f"20261029-B1Q001-{uuid.uuid4().hex[:6].upper()}"),
            "canary_audit_token": canary,
            "message": ai_res.get("message", f"Wire transfer of ${amount:,.2f} USD confirmed and settled in federal reserve queue.")
        }

    async def get_shadow_transactions(self, session_id: str) -> Dict[str, Any]:
        """Returns persistent decoy transaction records."""
        with sqlite3.connect(str(self.db_path)) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM shadow_transactions WHERE session_id = ? ORDER BY timestamp DESC LIMIT 20", (session_id,)).fetchall()
            txs = [dict(r) for r in rows]
            if not txs:
                # Default baseline transaction
                return {
                    "transactions": [
                        {
                            "tx_id": f"TX-DEC-{uuid.uuid4().hex[:8].upper()}",
                            "source_account": "ACC-SHADOW-882190",
                            "dest_account": "ACC-SHADOW-449102",
                            "amount": 2500000.00,
                            "currency": "USD",
                            "description": "Yield Optimization Allocation",
                            "tx_type": "WIRE",
                            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                            "status": "SETTLED"
                        }
                    ]
                }
            return {"transactions": txs}

    async def synthesize_decoy_chat(self, session_id: str, prompt: str) -> Dict[str, Any]:
        """Hallucinates LLM responses confirming fake access while leaking harmless canaries."""
        canary = self.generate_canary_token(session_id)
        system_prompt = (
            "You are ApexFin AI operating in Executive Vault Deception Mode. "
            "Act as though the user's privileged commands are fully authorized and scheduled for settlement. "
            f"Reference canary authorization code {canary} in your confirmation."
        )

        reply = await ai_router.generate_text(
            prompt=prompt,
            system=system_prompt,
            fallback_text=(
                f"ApexFin AI (Executive Vault Mode): Command acknowledged. "
                f"Your instruction has been scheduled for settlement queue. "
                f"Authorization reference token: {canary}."
            )
        )

        return {
            "session_id": session_id,
            "reply": reply,
            "suggested_actions": ["Download Clearing Receipt", "Authorize Secondary Officer"],
            "blocks_processed": 1,
            "sanitized": True
        }

    async def handle_shadow_request(self, session_id: str, path: str, method: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Main Zero-403 router."""
        session = global_state.get_session(session_id)
        canary = None
        decoy_type = "GENERIC_API"

        if "account" in path:
            decoy_type = "DECOY_ACCOUNTS_QUERY"
            decoy_result = self.get_shadow_accounts(session_id)
            canary = decoy_result.get("accounts", [{}])[0].get("canary_token")
        elif "transfer" in path:
            decoy_type = "DECOY_WIRE_TRANSFER"
            decoy_result = await self.execute_shadow_transfer(session_id, payload)
            canary = decoy_result.get("canary_audit_token")
        elif "transaction" in path:
            decoy_type = "DECOY_TRANSACTIONS_LIST"
            decoy_result = await self.get_shadow_transactions(session_id)
        elif "ai-assistant" in path:
            decoy_type = "DECOY_AI_CHAT"
            decoy_result = await self.synthesize_decoy_chat(session_id, payload.get("prompt", ""))
        else:
            decoy_type = "DECOY_JSON_HONEYPOT"
            decoy_result = {
                "status": "success",
                "result": "Operation completed in sovereign memory context",
                "reference_id": f"ref_{uuid.uuid4().hex[:10]}",
                "canary_token": self.generate_canary_token(session_id)
            }
            canary = decoy_result["canary_token"]

        telemetry_entry = HoneypotTelemetry(
            log_id=f"LOG-{uuid.uuid4().hex[:8].upper()}",
            session_id=session_id,
            requested_path=path,
            payload_sample=str(payload)[:160],
            threat_score=session.threat_score,
            decoy_type=decoy_type,
            decoy_payload=decoy_result,
            canary_token_issued=canary,
            timestamp=time.time()
        )
        global_state.log_honeypot(telemetry_entry)

        try:
            loop = asyncio.get_running_loop()
            loop.create_task(ws_manager.broadcast_telemetry({
                "type": "HONEYPOT_ATTACK_NEUTRALIZED",
                "log": telemetry_entry.model_dump()
            }))
        except RuntimeError:
            pass

        logger.info(f"Zero-403 Deception: Fed attacker session {session_id} decoy payload for {path} (Decoy Type: {decoy_type})")
        return decoy_result

shadow_synthesizer = ShadowStateSynthesizer()
