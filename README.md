---
title: Karyon Autonomous AI Defense Plane
emoji: 🛡️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: true
---

# Karyon: Autonomous Moving-Target AI Defense Plane & Context Firewall

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Architecture](https://img.shields.io/badge/Architecture-4--Ring%20Moving--Target%20Defense-0866FF)](file:///C:/Users/vaidz/documents/karyon/docs/README.md)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLite-009688)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-Vite%20%2B%20Tailwind%20%2B%20TS-61DAFB)](https://vitejs.dev)
[![Documentation](https://img.shields.io/badge/Docs-Comprehensive%20Architecture%20Suite-0866FF)](file:///C:/Users/vaidz/documents/karyon/docs/README.md)

> [!IMPORTANT]
> **Complete Technical Documentation Suite Available in [`/docs`](file:///C:/Users/vaidz/documents/karyon/docs/README.md)**:  
> Detailed architecture, ring implementations, mathematical formulations, API references, confusion matrices, and verification suites have been documented in dedicated modules within [`docs/`](file:///C:/Users/vaidz/documents/karyon/docs/README.md).

---

## 📚 Documentation Index

- **[Master Documentation Hub](file:///C:/Users/vaidz/documents/karyon/docs/README.md)**
- **[Architecture & Ingress Topology](file:///C:/Users/vaidz/documents/karyon/docs/architecture-overview.md)**
- **[Ring 1: Optical Shield & TLS Entropy Jitter](file:///C:/Users/vaidz/documents/karyon/docs/ring-1-optical-shield.md)**
- **[Ring 2: Polymorphic Mesh & Ephemeral Schema](file:///C:/Users/vaidz/documents/karyon/docs/ring-2-polymorphic-mesh.md)**
- **[Ring 3: KV-Surgeon Context Firewall](file:///C:/Users/vaidz/documents/karyon/docs/ring-3-kv-surgeon.md)**
- **[Ring 4: Shadow Honeypot & Decoy Wire](file:///C:/Users/vaidz/documents/karyon/docs/ring-4-shadow-honeypot.md)**
- **[SOC Command Center & Telemetry Suite](file:///C:/Users/vaidz/documents/karyon/docs/soc-command-center.md)**
- **[Target Integration & Perimeter Audit](file:///C:/Users/vaidz/documents/karyon/docs/target-integration-audit.md)**
- **[Complete API & WebSocket Reference](file:///C:/Users/vaidz/documents/karyon/docs/api-reference.md)**
- **[Verification Matrix & Confusion Indexes](file:///C:/Users/vaidz/documents/karyon/docs/verification-and-testing.md)**

---

**Karyon** is an autonomous moving-target AI cybersecurity reverse proxy and context firewall designed to protect enterprise workloads and AI applications.

---

## 🛡️ Architecture: The 4-Ring Sovereign Defense Plane

```
                          [ INCOMING HTTP / WS TRAFFIC ]
                                        │
                                        ▼
             ┌───────────────────────────────────────────────────────┐
             │         Karyon Reverse-Proxy Mesh Middleware          │
             │           (karyon/backend/proxy_mesh.py)              │
             └──────────────────────────┬────────────────────────────┘
                                        │
            ┌───────────────────────────┴───────────────────────────┐
            │                                                       │
  [ Threat Score < 0.7 ]                                  [ Threat Score >= 0.7 ]
            │                                                       │
            ▼                                                       ▼
 ┌──────────────────────┐                               ┌──────────────────────┐
 │ RING 1: OPTICAL/TLS  │                               │ RING 4: SHADOW STATE │
 │ • Adversarial noise  │                               │ • ZERO-403 Policy    │
 │ • SVG Micro-warping  │                               │ • Decoy Balances     │
 │ • 25ms SSE padder    │                               │ • Fake Wire IMAD     │
 └──────────┬───────────┘                               │ • Canary API Tokens  │
            │                                           └──────────────────────┘
            ▼
 ┌──────────────────────┐
 │ RING 2: POLYMORPH    │
 │ • 60s Route Hashes   │
 │ • Dynamic SQLite VIEW│
 │ • BOLA Probe Blocker │
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ RING 3: KV SURGEON   │
 │ • Merkle Block Tree  │
 │ • Anomaly Detector   │
 │ • RoPE Splice Evict  │
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────────────────────────────────────────┐
 │ Target FinTech Application (ApexFin Sovereign Treasury)  │
 │  • Real SQLite DB (bank.db) · Real Settled Wire Ledger   │
 └──────────────────────────────────────────────────────────┘
```

### Ring 1: Optical Anti-Agent Camouflage & TLS/SSE Jitter Shield (`karyon/rings/ring1_optical_tls.py`)
- **Visual Shield**: Uses PyTorch + OpenCV/NumPy to apply high-frequency chromatic adversarial perturbations and SVG/CSS micro-warping over critical UI bounding boxes (e.g., "Wire Transfer" button, balance tables) when `threat_score >= 0.5`. Keeps the UI clear to humans while causing vision-scraping agents (e.g., OCR, GPT-4o-Vision) to misread coordinates and characters.
- **TLS Timing Shield**: Wraps Server-Sent Events (SSE) token streams in a constant-time 25ms clock tick padder (fixed 256-byte frame padding with dummy comment frames) so encrypted packet inter-arrival times leak 0 bits of token-length entropy.

### Ring 2: Polymorphic API & Database Schema Rotator (`karyon/rings/ring2_polymorph.py`)
- Background async daemon + middleware that rotates external REST API route hashes and SQLite database `VIEW` column aliases every 60 seconds (or immediately upon detecting BOLA/IDOR/fuzzing probes).
- Uses local Ollama (`llama3:latest`, `llama3.2:3b` or deterministic cryptographic generator fallback) to generate fresh mapping manifests (`schema_manifest.json`), executes `CREATE VIEW` dynamically in SQLite, and pushes live manifests to authenticated legitimate clients over WebSocket (`/ws/manifest`).
- Any request hitting an expired/retired route or unmapped field immediately increments `threat_score = 1.0` and triggers Ring 4.

### Ring 3: Surgical Merkle KV-Cache & Context Firewall (`karyon/rings/ring3_kv_surgeon.py`)
- Chunks long-context LLM sessions and RAG documents into cryptographically hashed **Merkle Memory Blocks** (`block_id`, `sha256_hash`, `parent_hash`, `tokens`, `attention_anomaly_score`, `status`).
- Runs local prompt-injection & intent-drift detector across conversation turns.
- **`surgical_evict(session_id, block_id)`**: When a poisoned block (e.g., indirect prompt injection inside a retrieved invoice) is detected in-flight, surgically excises ONLY that corrupted block, recomputes positional indices (`RoPE splice` simulation), and re-stitches the Merkle parent-hash chain without wiping prior conversation history.

### Ring 4: Shadow-State Deception Engine (`karyon/rings/ring4_shadow_honeypot.py`)
- **Zero-403 Policy**: Karyon NEVER returns `403 Forbidden` to an attacker. Once `threat_score >= 0.7`, the session is silently flagged with `shadow_mode = True`.
- All subsequent API queries, SQL reads/writes, and AI chat prompts are seamlessly routed to the Shadow State Synthesizer powered by Ollama (`format="json"`), returning mathematically consistent decoy bank balances, fake wire confirmations, and trackable canary API keys while logging the attacker's full kill-chain telemetry.

---

## ⚡ Quick Start

### 1. Requirements
- Python 3.10+ (with `torch`, `opencv-python`, `fastapi`, `uvicorn`, `aiosqlite`, `pytest`)
- Node.js 18+ (for React Vite UI)
- Ollama (optional; automated local fallback generator activates if Ollama is cold or offline)

### 2. Launch Stack with Single Command
On Windows:
```cmd
start_karyon.bat
```

On Linux / macOS:
```bash
chmod +x start_karyon.sh
./start_karyon.sh
```

### 3. Access Interfaces
- **War-Room SOC Dashboard & Target App**: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Karyon Defense Mesh API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **FastAPI OpenAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **WebSocket Telemetry Feed**: `ws://127.0.0.1:8000/ws/telemetry`

---

## 🧪 Verification & Automated Test Suite

Run all automated unit, ring, and end-to-end integration tests:
```bash
python -m pytest tests/ -v
```

### Test Coverage Highlights:
- **`tests/test_target_app.py`**: SQLite database initialization, corporate account seeding, atomic wire transfers, balance debits/credits, transaction logs, and AI assistant chat.
- **`tests/test_rings.py`**:
  1. Ring 1: SSE 256-byte frame normalization, constant-time tick generation, and PyTorch adversarial image perturbation (<25ms).
  2. Ring 2: Polymorphic route rotation, dynamic SQLite VIEW verification, and BOLA probe detection on expired routes.
  3. Ring 3: Merkle KV block poisoning detection, surgical eviction, RoPE splice simulation, and Merkle chain re-stitching.
  4. Ring 4: Zero-403 policy verification, decoy JSON delivery, canary token issuance, and honeypot telemetry recording.
- **`tests/test_e2e.py`**: End-to-end multi-ring attack simulation verifying real ledger balances remain 100% untampered while the attacker is deceived in the shadow state.
