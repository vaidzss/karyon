import hashlib
import json
import logging
import random
import time
from typing import Any, Dict, List, Optional
import httpx
from backend.config import settings

logger = logging.getLogger("karyon.ollama")

class OllamaClient:
    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, default_model: str = settings.OLLAMA_MODEL):
        self.base_url = base_url.rstrip("/")
        self.default_model = default_model
        self.available_models: List[str] = []
        self._is_online = False
        self._last_checked = 0.0

    async def check_health(self) -> bool:
        """Checks if local Ollama daemon is reachable and lists models."""
        now = time.time()
        if now - self._last_checked < 10.0 and self._is_online:
            return self._is_online
        
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    self.available_models = [m.get("name") for m in data.get("models", [])]
                    self._is_online = True
                    self._last_checked = now
                    # Select best available model
                    if self.default_model not in self.available_models:
                        if "llama3:latest" in self.available_models:
                            self.default_model = "llama3:latest"
                        elif "llama3.2:3b" in self.available_models:
                            self.default_model = "llama3.2:3b"
                        elif "qwen2.5:7b" in self.available_models:
                            self.default_model = "qwen2.5:7b"
                        elif self.available_models:
                            self.default_model = self.available_models[0]
                    return True
        except Exception as e:
            logger.debug(f"Ollama daemon not reachable at {self.base_url}: {e}")
        
        self._is_online = False
        self._last_checked = now
        return False

    async def generate_json(self, prompt: str, system: Optional[str] = None, fallback_generator=None) -> Dict[str, Any]:
        """Queries Ollama with JSON output expectation, falling back seamlessly if offline."""
        is_up = await self.check_health()
        if is_up:
            try:
                payload = {
                    "model": self.default_model,
                    "prompt": prompt,
                    "format": "json",
                    "stream": False,
                    "options": {
                        "temperature": 0.2,
                        "num_predict": 512,
                    }
                }
                if system:
                    payload["system"] = system

                async with httpx.AsyncClient(timeout=settings.OLLAMA_TIMEOUT_SECONDS) as client:
                    resp = await client.post(f"{self.base_url}/api/generate", json=payload)
                    if resp.status_code == 200:
                        raw = resp.json().get("response", "{}")
                        parsed = json.loads(raw)
                        return parsed
            except Exception as ex:
                logger.warning(f"Ollama query failed ({ex}), triggering deterministic fallback generator")

        # Execute dynamic deterministic fallback generator
        if fallback_generator:
            return fallback_generator()
        return self._default_fallback(prompt)

    async def generate_text(self, prompt: str, system: Optional[str] = None, fallback_text: Optional[str] = None) -> str:
        """Queries Ollama for streaming or plain text response with graceful fallback."""
        is_up = await self.check_health()
        if is_up:
            try:
                payload = {
                    "model": self.default_model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "num_predict": 256,
                    }
                }
                if system:
                    payload["system"] = system

                async with httpx.AsyncClient(timeout=settings.OLLAMA_TIMEOUT_SECONDS) as client:
                    resp = await client.post(f"{self.base_url}/api/generate", json=payload)
                    if resp.status_code == 200:
                        return resp.json().get("response", "").strip()
            except Exception as ex:
                logger.warning(f"Ollama text generation failed ({ex}), using structured fallback")

        return fallback_text or "Transaction processed securely under Karyon Sovereign Context."

    def _default_fallback(self, prompt: str) -> Dict[str, Any]:
        """Deterministic seed-derived generator for schema / deception if Ollama is cold."""
        seed = int(hashlib.sha256(prompt.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed)
        return {
            "status": "simulated_secure",
            "entropy_seed": seed,
            "generated_id": f"syn_{rng.randint(100000, 999999)}",
            "timestamp": time.time()
        }

ollama_client = OllamaClient()
