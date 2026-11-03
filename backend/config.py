import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")
    
    PROJECT_NAME: str = "Karyon Autonomous AI Defense Plane"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Network & Ports
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    FRONTEND_PORT: int = 5173
    
    # Database
    DATABASE_PATH: Path = BASE_DIR / "target_app" / "bank.db"
    
    # Baseten Cloud Endpoint Configuration (Primary Provider)
    BASETEN_BASE_URL: str = "https://inference.baseten.co/v1"
    BASETEN_MODEL: str = "meta-models/muse-spark-open-1026"
    BASETEN_API_KEY: Optional[str] = None

    # Meta Cloud Endpoint (Fallback if Baseten is unset)
    META_BASE_URL: str = "https://api.meta.ai/v1"
    META_MODEL: str = "llama3.3-70b-instruct"
    META_API_KEY: Optional[str] = None

    # Local Ollama Configuration (Fallback if cloud keys unset)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3:latest"
    OLLAMA_FALLBACK_MODEL: str = "llama3.2:3b"
    OLLAMA_TIMEOUT_SECONDS: float = 3.5

    # Cloud Call Circuit Breaker & Caching
    MAX_CLOUD_CALLS_PER_HOUR: int = 60
    ENABLE_SQLITE_LLM_CACHE: bool = True
    CLOUD_TIMEOUT_SECONDS: float = 30.0
    
    # Ring 1: Optical & TLS Timing Shield
    THREAT_THRESHOLD_CAMOUFLAGE: float = 0.5
    TLS_TICK_PAD_MS: int = 25
    TLS_FRAME_SIZE_BYTES: int = 256
    
    # Ring 2: Polymorphic Schema Rotator
    SCHEMA_ROTATION_INTERVAL_SEC: int = 60
    POLYMORPHIC_SALT: str = "karyon_dynamic_entropy_seed_2026"
    
    # Ring 3: Surgical Merkle KV Context Firewall
    KV_BLOCK_TOKEN_TARGET: int = 64
    KV_ANOMALY_THRESHOLD: float = 0.65
    
    # Ring 4: Shadow Deception Honeypot
    THREAT_THRESHOLD_SHADOW: float = 0.7
    CANARY_TOKEN_PREFIX: str = "karyon_canary_key_"

settings = Settings()
