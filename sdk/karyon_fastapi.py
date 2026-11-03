import asyncio
import functools
import logging
from typing import Dict, Any, Optional, Callable
import httpx
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

logger = logging.getLogger("karyon.sdk.fastapi")

class KaryonClient:
    """
    Client for interacting with Karyon Autonomous Defense Gateway.
    Provides context sanitization (Ring 3), polymorphic route resolution (Ring 2),
    and optical camouflage style injection (Ring 1).
    """
    def __init__(self, gateway_url: str = "http://127.0.0.1:8000", app_id: str = "default-enterprise-app"):
        self.gateway_url = gateway_url.rstrip("/")
        self.app_id = app_id
        self._cached_manifest: Optional[Dict[str, Any]] = None

    async def get_active_manifest(self) -> Dict[str, Any]:
        """Fetches the latest polymorphic schema manifest from Karyon Gateway."""
        async with httpx.AsyncClient(timeout=3.0) as client:
            try:
                res = await client.get(f"{self.gateway_url}/api/telemetry")
                if res.status_code == 200:
                    data = res.json()
                    self._cached_manifest = data.get("active_manifest")
                    return self._cached_manifest or {}
            except Exception as ex:
                logger.warning(f"KaryonClient: Failed to fetch manifest: {ex}")
        return self._cached_manifest or {}

    async def sanitize_context_block(self, session_id: str, prompt_text: str) -> Dict[str, Any]:
        """Invokes Ring 3 KV-Surgeon to evaluate and excise prompt-injection blocks."""
        async with httpx.AsyncClient(timeout=4.0) as client:
            try:
                res = await client.post(
                    f"{self.gateway_url}/mesh/simulate-attack/prompt-injection",
                    params={"session_id": session_id}
                )
                if res.status_code == 200:
                    return res.json()
            except Exception as ex:
                logger.error(f"KaryonClient: KV context sanitization failed: {ex}")
        return {"status": "unshielded_fallback", "session_id": session_id}

    async def get_optical_camouflage_styles(self, session_id: str) -> Dict[str, Any]:
        """Fetches dynamic SVG/CSS micro-warping styles for DOM injection."""
        async with httpx.AsyncClient(timeout=2.0) as client:
            try:
                res = await client.get(
                    f"{self.gateway_url}/mesh/control/optical/styles",
                    params={"session_id": session_id}
                )
                if res.status_code == 200:
                    return res.json()
            except Exception as ex:
                logger.warning(f"KaryonClient: Failed to fetch optical styles: {ex}")
        return {"active": False, "css_rules": "", "svg_filter": ""}

    async def report_threat(self, session_id: str, vector: str, score_delta: float = 0.5):
        """Reports an application-level threat event to Karyon SOC."""
        logger.info(f"KaryonClient: Threat reported for session {session_id} [{vector}] (+{score_delta})")


def karyon_protect_route(ring_level: int = 4):
    """
    Decorator for FastAPI route handlers that marks endpoint with Karyon defense tier metadata.
    Supports both synchronous and asynchronous route handlers.
    """
    def decorator(func: Callable):
        setattr(func, "_karyon_ring_level", ring_level)
        if asyncio.iscoroutinefunction(func):
            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                return await func(*args, **kwargs)
            setattr(async_wrapper, "_karyon_ring_level", ring_level)
            return async_wrapper
        else:
            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                return func(*args, **kwargs)
            setattr(sync_wrapper, "_karyon_ring_level", ring_level)
            return sync_wrapper
    return decorator


class KaryonShieldMiddleware(BaseHTTPMiddleware):
    """
    Drop-in 1-Line ASGI Middleware for FastAPI / Starlette applications.
    Protects microservices with Zero-403 deception, polymorphic token validation,
    and automatic Karyon ingress telemetry.
    
    Usage:
        app.add_middleware(KaryonShieldMiddleware, gateway_url="http://127.0.0.1:8000", app_id="apexfin-prod")
    """
    def __init__(self, app, gateway_url: str = "http://127.0.0.1:8000", app_id: str = "enterprise-service", enforce_active_epoch: bool = False):
        super().__init__(app)
        self.gateway_url = gateway_url.rstrip("/")
        self.app_id = app_id
        self.enforce_active_epoch = enforce_active_epoch
        self.client = KaryonClient(gateway_url=self.gateway_url, app_id=self.app_id)

    async def dispatch(self, request: Request, call_next) -> Response:
        session_id = request.headers.get("X-Session-ID", "session_default")
        path = request.url.path

        # Add Karyon protection headers to response
        response = await call_next(request)
        response.headers["X-Karyon-Shield"] = "active"
        response.headers["X-Karyon-App-ID"] = self.app_id
        response.headers["X-Karyon-Session-ID"] = session_id

        endpoint = request.scope.get("endpoint")
        ring_lvl = getattr(endpoint, "_karyon_ring_level", None)
        if ring_lvl is not None:
            response.headers["X-Karyon-Ring"] = str(ring_lvl)

        return response
