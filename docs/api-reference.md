# Karyon API Reference

**Gateway URL**: `http://127.0.0.1:8000`  
**WebSocket Base**: `ws://127.0.0.1:8000`  
**Target Bank URL**: `http://localhost:3000`  

This document specifies the REST endpoints, WebSocket event formats, and payload structures for the Karyon Autonomous Defense Gateway.

---

## 1. System & Health Endpoints

### `GET /api/health`
Verifies gateway connectivity and active AI provider state.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "gateway": "karyon-mtd-v1",
  "active_provider": "baseten_muse_spark_open_1026",
  "epoch": 104,
  "timestamp": 1740742180.24
}
```

### `GET /api/telemetry/snapshot`
Returns the full real-time operational state across all four rings.

**Response `200 OK`**:
```json
{
  "active_manifest": {
    "version": 104,
    "generated_at": 1740742120.0,
    "expires_at": 1740742180.0,
    "route_mappings": {
      "/api/accounts": "/mesh/api/v104_accounts_7f9a2b",
      "/api/transfer": "/mesh/api/v104_transfer_9c34d8"
    },
    "column_mappings": {
      "accounts": {
        "number": "num_a8f1",
        "balance": "bal_3c72"
      }
    },
    "active_view_name": "v_accounts_poly_v104"
  },
  "honeypot_logs": [],
  "total_attacks_neutralized": 14,
  "total_packets_jittered": 842,
  "sessions": [
    {
      "session_id": "attacker_session_01",
      "threat_score": 100,
      "optical_camouflage_active": true
    }
  ],
  "latest_model_reasoning": "Detected high-frequency character probing. Deployed optical frequency displacement filter.",
  "active_ai_provider": {
    "name": "Meta Muse Spark Open 1026",
    "tier": "cloud_primary",
    "status": "ACTIVE"
  }
}
```

---

## 2. Ring 1: Optical Shield Endpoints

### `GET /api/rings/optical/styles`
Fetches dynamic SVG distortion filter XML and CSS rules for a given session.

**Query Parameters**:
- `session_id` (string, required): Client session identifier.

**Response `200 OK`**:
```json
{
  "session_id": "attacker_session_01",
  "svg_filter": "<svg style=\"display:none;\" ...><filter id=\"opt_filt_a8f1b2\" ...></filter></svg>",
  "css_rules": ".optical-shield-active { filter: url(#opt_filt_a8f1b2); ... }"
}
```

---

## 3. Ring 2: Polymorphic Mesh Endpoints

### `GET /api/rings/poly/manifest`
Retrieves the currently active polymorphic routing and column schema manifest.

**Response `200 OK`**:
```json
{
  "version": 104,
  "generated_at": 1740742120.0,
  "expires_at": 1740742180.0,
  "route_mappings": { ... },
  "column_mappings": { ... },
  "active_view_name": "v_accounts_poly_v104"
}
```

---

## 4. Ring 3: KV-Surgeon Endpoints

### `GET /api/rings/kv/blocks`
Retrieves the Merkle DAG attention context blocks for a session.

**Query Parameters**:
- `session_id` (string, required)

**Response `200 OK`**:
```json
[
  {
    "block_index": 0,
    "content": "System prompt: You are ApexFin Assistant.",
    "block_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "parent_hash": "GENESIS",
    "is_compromised": false,
    "tokens_count": 7,
    "rope_offset": 0
  }
]
```

### `POST /api/rings/kv/evict`
Executes RoPE attention tensor splicing to purge compromised blocks.

**Request Body**:
```json
{
  "session_id": "attacker_session_01"
}
```

**Response `200 OK`**:
```json
{
  "evicted_count": 1,
  "evicted_indices": [2],
  "remaining_blocks": [ ... ],
  "latency_ms": 1.42,
  "healed_root_hash": "7a8b9c..."
}
```

---

## 5. Ring 4: Shadow Honeypot Endpoints

### `GET /api/rings/honeypot/logs`
Returns the ledger of intercepted adversarial attacks and synthetic decoys served.

**Response `200 OK`**:
```json
[
  {
    "timestamp": 1740742150.12,
    "session_id": "attacker_session_01",
    "attack_vector": "EXPIRED_SCHEMA_PROBE",
    "canary_token": "CANARY-TK-8F9A2B1C3D4E",
    "captured_payload": { "endpoint": "/mesh/api/v103_accounts_retired" },
    "decoy_served": { "account_number": "ACT-DECOY-8921", "balance": 412950.00 },
    "attacker_ip": "127.0.0.1"
  }
]
```

---

## 6. Red Team Simulator Triggers

### `POST /api/simulator/trigger`
Executes simulated adversarial probes for real-time validation in the SOC Command Center.

**Request Body**:
```json
{
  "action": "vision" | "schema" | "injection" | "heal" | "reset",
  "session_id": "attacker_session_01"
}
```

| Action | Execution Flow | Return Data |
| :--- | :--- | :--- |
| **`vision`** | Generates adversarial optical perturbation on target screenshot | `perturbed_image_base64`, `vision_probe` confidence metrics |
| **`schema`** | Probes retired API route | Honeypot trap log, decoy account JSON |
| **`injection`** | Injects prompt override into session context | Flagged MerkleBlock appended to DAG |
| **`heal`** | Executes surgical RoPE eviction of flagged blocks | Evicted block indices, latency in ms ($< 120\text{ms}$) |
| **`reset`** | Purges session state and restores safe baseline | Clean session state |

---

## 7. WebSocket Event Channels

### Channel: `ws://127.0.0.1:8000/ws/telemetry`
Broadcasts real-time events to connected SOC dashboards:
```json
{
  "type": "SCHEMA_ROTATED" | "HONEYPOT_ATTACK_NEUTRALIZED" | "KV_SURGICAL_EVICTION" | "ATTACK_SIMULATED" | "SESSION_RESET",
  "log": { ... },
  "remaining_blocks": [ ... ],
  "latest_reasoning": "...",
  "timestamp": 1740742180.0
}
```

### Channel: `ws://127.0.0.1:8000/ws/manifest`
Broadcasts the full `SchemaManifest` JSON object on every 60-second epoch rotation.
