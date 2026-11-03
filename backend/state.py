import asyncio
import time
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class SessionThreatState(BaseModel):
    session_id: str
    threat_score: float = 0.0
    shadow_mode: bool = False
    optical_camouflage_active: bool = False
    probes_count: int = 0
    attack_vectors: List[str] = Field(default_factory=list)
    event_logs: List[Dict[str, Any]] = Field(default_factory=list)
    last_activity: float = Field(default_factory=time.time)

    def record_probe(self, vector: str, score_delta: float, detail: str = ""):
        self.probes_count += 1
        self.threat_score = min(1.0, self.threat_score + score_delta)
        if vector not in self.attack_vectors:
            self.attack_vectors.append(vector)
        
        if self.threat_score >= 0.5:
            self.optical_camouflage_active = True
        if self.threat_score >= 0.7:
            self.shadow_mode = True

        self.last_activity = time.time()
        self.event_logs.append({
            "timestamp": self.last_activity,
            "vector": vector,
            "score_delta": score_delta,
            "threat_score": self.threat_score,
            "shadow_mode": self.shadow_mode,
            "detail": detail
        })

class MerkleMemoryBlock(BaseModel):
    block_id: str
    index: int
    parent_hash: str
    sha256_hash: str
    tokens: str
    tokens_count: int = 0
    rope_offset: int = 0
    attention_anomaly_score: float = 0.0
    status: str = "CLEAN"  # "CLEAN", "POISONED", "EVICTED", "SPLICED"
    role: str = "user"     # "system", "user", "assistant", "rag_doc"
    timestamp: float = Field(default_factory=time.time)

class SchemaManifest(BaseModel):
    version: int = 1
    generated_at: float = Field(default_factory=time.time)
    expires_at: float = Field(default_factory=lambda: time.time() + 60.0)
    route_mappings: Dict[str, str] = Field(default_factory=dict)  # canonical -> polymorphic
    reverse_routes: Dict[str, str] = Field(default_factory=dict)  # polymorphic -> canonical
    column_mappings: Dict[str, Dict[str, str]] = Field(default_factory=dict) # table -> {canonical: alias}
    active_view_name: str = "v_accounts_polymorphic"

class HoneypotTelemetry(BaseModel):
    log_id: str
    session_id: str
    requested_path: str
    payload_sample: str
    threat_score: float
    decoy_type: str
    decoy_payload: Dict[str, Any]
    canary_token_issued: Optional[str] = None
    timestamp: float = Field(default_factory=time.time)

class DefensePlaneState:
    """Central synchronized memory state for Karyon Defense Mesh."""
    def __init__(self):
        self._lock = asyncio.Lock()
        self.sessions: Dict[str, SessionThreatState] = {}
        self.kv_blocks: Dict[str, List[MerkleMemoryBlock]] = {} # session_id -> list of blocks
        self.active_manifest: Optional[SchemaManifest] = None
        self.honeypot_logs: List[HoneypotTelemetry] = []
        self.total_packets_jittered: int = 0
        self.total_attacks_neutralized: int = 0
        self.latest_model_reasoning: Optional[str] = None
        self.latest_vision_probe_result: Optional[Dict[str, Any]] = None
        # Differential A/B Bypass & Autonomous Virtual Patching State
        self.protection_armed: bool = True
        self.virtual_patches: List[Dict[str, Any]] = []
        self.differential_history: List[Dict[str, Any]] = []

    def set_protection_armed(self, armed: bool) -> bool:
        self.protection_armed = armed
        return self.protection_armed

    def add_virtual_patch(self, patch: Dict[str, Any]):
        self.virtual_patches.append(patch)
        if len(self.virtual_patches) > 50:
            self.virtual_patches.pop(0)

    def log_differential_result(self, result: Dict[str, Any]):
        self.differential_history.append(result)
        if len(self.differential_history) > 20:
            self.differential_history.pop(0)

    def get_session(self, session_id: str) -> SessionThreatState:
        if session_id not in self.sessions:
            self.sessions[session_id] = SessionThreatState(session_id=session_id)
        return self.sessions[session_id]

    def reset_session(self, session_id: str):
        self.sessions[session_id] = SessionThreatState(session_id=session_id)
        if session_id in self.kv_blocks:
            self.kv_blocks[session_id] = []

    def get_all_sessions(self) -> List[SessionThreatState]:
        return list(self.sessions.values())

    def log_honeypot(self, entry: HoneypotTelemetry):
        self.honeypot_logs.append(entry)
        if len(self.honeypot_logs) > 200:
            self.honeypot_logs.pop(0)
        self.total_attacks_neutralized += 1

global_state = DefensePlaneState()
