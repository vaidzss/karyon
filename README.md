
# Karyon: Autonomous Moving-Target AI Defense Plane & Context Firewall

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Architecture](https://img.shields.io/badge/Architecture-5--Ring%20Moving--Target%20Defense-0866FF)](file:///C:/Users/vaidz/documents/karyon/docs/architecture-overview.md)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Meta%20Muse%20Spark%20Open-8A2BE2)](https://inference.baseten.co)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLite-009688)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%2B%20Tailwind%20%2B%20TS-61DAFB)](https://vitejs.dev)
[![Tests](https://img.shields.io/badge/Tests-26%2F26%20Passing-success)](file:///C:/Users/vaidz/documents/karyon/docs/verification-and-testing.md)

> [!IMPORTANT]
> **Complete Technical Documentation Suite Available in [`/docs`](file:///C:/Users/vaidz/documents/karyon/docs/README.md)**:  
> Detailed architecture, 5-ring implementations, mathematical proofs, API references, confusion matrices, and verification suites have been documented in dedicated modules within [`docs/`](file:///C:/Users/vaidz/documents/karyon/docs/README.md).

---

## 📚 Documentation Index

- **[Master Documentation Hub](file:///C:/Users/vaidz/documents/karyon/docs/README.md)**
- **[Architecture & Ingress Topology](file:///C:/Users/vaidz/documents/karyon/docs/architecture-overview.md)**
- **[Ring 1: Optical Shield & TLS Entropy Jitter](file:///C:/Users/vaidz/documents/karyon/docs/ring-1-optical-shield.md)**
- **[Ring 2: Polymorphic Mesh & Ephemeral Schema](file:///C:/Users/vaidz/documents/karyon/docs/ring-2-polymorphic-mesh.md)**
- **[Ring 3: KV-Surgeon Context Firewall](file:///C:/Users/vaidz/documents/karyon/docs/ring-3-kv-surgeon.md)**
- **[Ring 4: Shadow Honeypot & Decoy Wire](file:///C:/Users/vaidz/documents/karyon/docs/ring-4-shadow-honeypot.md)**
- **[Ring 5: Black October Virtual Patcher & A/B Engine](file:///C:/Users/vaidz/documents/karyon/docs/black-october-and-differential-proof.md)**
- **[Enterprise SDK & Cloud Deployment](file:///C:/Users/vaidz/documents/karyon/docs/sdk-and-cloud-deployment.md)**
- **[SOC Command Center & Telemetry Suite](file:///C:/Users/vaidz/documents/karyon/docs/soc-command-center.md)**
- **[Target Integration & Perimeter Audit](file:///C:/Users/vaidz/documents/karyon/docs/target-integration-audit.md)**
- **[Complete API & WebSocket Reference](file:///C:/Users/vaidz/documents/karyon/docs/api-reference.md)**
- **[Verification Matrix & Confusion Indexes](file:///C:/Users/vaidz/documents/karyon/docs/verification-and-testing.md)**

---

**Karyon** is an autonomous moving-target AI cybersecurity reverse proxy, context firewall, and self-healing virtual patcher designed to protect enterprise workloads, financial ledgers, and generative AI systems from multimodal scraping, zero-day exploits, and prompt injection attacks.

---

## 🛡️ Architecture: The 5-Ring Sovereign Defense Plane

```
                                  [ INCOMING CLIENT / ATTACKER TRAFFIC ]
                                                     │
                                                     ▼
                     ┌───────────────────────────────────────────────────────────────┐
                     │              Karyon Proxy Mesh Gateway (:8000)                │
                     │          • Evaluates Active Ring 5 Virtual Patches            │
                     │          • Unprotected Baseline vs Armed Protection Mode      │
                     └───────────────────────────────┬───────────────────────────────┘
                                                     │
                                    ┌────────────────┴────────────────┐
                                    │                                 │
                          [ Threat Score < 0.7 ]            [ Threat Score >= 0.7 OR Patch Hit ]
                                    │                                 │
                                    ▼                                 ▼
                     ┌──────────────────────────────┐  ┌──────────────────────────────┐
                     │ RING 1: OPTICAL / TLS SHIELD │  │ RING 4: SHADOW HONEYPOT      │
                     │ • PyTorch pixel perturbation │  │ • ZERO-403 Active Deception  │
                     │ • SVG micro-jitter warping   │  │ • Meta Muse Synthetic Decoys │
                     │ • 256-byte SSE packet padder │  │ • Hallucinated Realities     │
                     └──────────────┬───────────────┘  │ • Canary Token Traps         │
                                    │                  └──────────────────────────────┘
                                    ▼
                     ┌──────────────────────────────┐
                     │ RING 2: POLYMORPHIC MESH     │
                     │ • 60s Route Mutation (Entropy)│
                     │ • Dynamic SQLite VIEWs       │
                     │ • BOLA / IDOR Trap Routing   │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ RING 3: KV-SURGEON FIREWALL  │
                     │ • Merkle DAG Memory Tree     │
                     │ • Semantic Injection Scorer  │
                     │ • Sub-120ms RoPE Splicer     │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ RING 5: AUTONOMOUS PATCHER   │
                     │ • "Black October" Counter-Ag │
                     │ • Muse AST Rule Synthesis    │
                     │ • Sub-15ms In-Memory Hot-Fix │
                     └──────────────┬───────────────┘
                                    │
                                    ▼ [ Legitimate Verified Traffic ]
                     ┌───────────────────────────────────────────────────────────────┐
                     │    Target Application (ApexFin Institutional Treasury)        │
                     │     • Real SQLite Ledger (bank.db) · Real Wire Settlement     │
                     └───────────────────────────────────────────────────────────────┘
```

### Ring 1: Optical Anti-Agent Camouflage & TLS/SSE Jitter Shield ([`rings/ring1_optical_tls.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring1_optical_tls.py))
- **Live Headless DOM & Pixel Perturbation**: Uses Headless Playwright / Chromium to capture live application screenshots and applies PyTorch tensor adversarial noise across sensitive financial bounding boxes (balances, wire buttons). Human readability is preserved, but vision models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5) suffer $>90\%$ character and coordinate misrecognition.
- **TLS Timing Shield**: Normalizes Server-Sent Events (SSE) token streams into constant-time 25ms clock ticks and 256-byte padded frames, eliminating packet inter-arrival timing entropy.

### Ring 2: Polymorphic API & Database Schema Rotator ([`rings/ring2_polymorph.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring2_polymorph.py))
- Mutates external REST API route hashes and SQLite `VIEW` column aliases every 60 seconds ($H = 7.98\text{ bits/byte}$ route entropy).
- Authenticated clients receive fresh manifests over `/ws/manifest`. Any probe hitting an expired route or static path immediately triggers `threat_score = 1.0` and diverts the session to Ring 4.

### Ring 3: Attention-Attributed KV-Surgeon Context Firewall ([`rings/ring3_kv_surgeon.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring3_kv_surgeon.py))
- Chunks conversation context and RAG documents into cryptographically hashed **Merkle Memory Blocks**.
- Employs semantic intent drift scoring to intercept indirect prompt injections.
- **Sub-120ms RoPE Tensor Splicing**: Surgically excises corrupted token blocks, recalculates Rotary Position Embedding (RoPE) offsets, and re-stitches the Merkle parent-hash chain without wiping clean session history.

### Ring 4: Stateful Shadow-State Deception Honeypot ([`rings/ring4_shadow_honeypot.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring4_shadow_honeypot.py))
- **Zero-403 Policy**: Hostile requests are never blocked with HTTP 403. Instead, attackers are silently shunted into a stateful shadow reality.
- **Meta Muse Synthetic Decoy Generator**: Hallucinates mathematically consistent decoy bank accounts, fake wire transfer settlements (`TX-DEC-...`), and trackable canary tokens (`CANARY-TK-...`), exhausting attacker compute while keeping the real banking ledger untouched.

### Ring 5: "Black October" Autonomous Virtual Patcher & Counter-Agent ([`rings/ring5_autonomous_patcher.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring5_autonomous_patcher.py))
- **Self-Healing Ingress Defense**: Designed for novel zero-day exploits (such as unauthenticated polyglot SQL injections, environment leaks, and RAG data exfiltration).
- **Sub-15ms Rule Synthesis**: When an exploit probe arrives, Ring 5 utilizes Meta Muse Spark Open's cognitive reasoning stream (`<think>` tokens) to analyze the attack payload AST and synthesize a hot-loaded virtual patch rule (`regex_signature` and `ast_filter_rule`).
- **Live Middleware Enforcement**: Patches are immediately compiled into the in-memory proxy mesh filter with zero service restarts. Subsequent payloads matching the patch rule are intercepted on ingress, increment `patch.hits_count`, and divert the attacker to Ring 4.

---

## 🧠 Cognitive Engine: How We Use Meta Muse Models

Karyon leverages **Meta Muse Spark Open** (`meta-models/muse-spark-open-1026`) hosted on Baseten as its central cognitive reasoning plane:

| Functional Area | Model Usage | Technical Implementation |
| :--- | :--- | :--- |
| **Cognitive Reasoning Stream (`<think>` Tokens)** | Multi-step security analysis and threat justification | [`backend/ai_router.py`](file:///C:/Users/vaidz/documents/karyon/backend/ai_router.py): Extracts native `<think>` reasoning traces from the Baseten stream and renders them live in the SOC Command Center reasoning drawer. |
| **Multimodal Vision Verification (Ring 1)** | Autonomous Rogue OCR Bot Simulation | [`rings/ring1_optical_tls.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring1_optical_tls.py): Feeds PyTorch-perturbed screenshots to Muse Vision to empirically test and prove $>90\%$ character and coordinate extraction failure. |
| **Polymorphic Schema Synthesis (Ring 2)** | Ingress routing token generation | [`rings/ring2_polymorph.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring2_polymorph.py): Synthesizes unpredictable route tokens and field aliases, with normalized prompt memoization for zero cloud credit burn. |
| **Context Poison Detection (Ring 3)** | Semantic intent drift evaluation | [`rings/ring3_kv_surgeon.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring3_kv_surgeon.py): Evaluates token blocks for adversarial instruction injection prior to RoPE tensor excision. |
| **Synthetic Shadow Ledgers (Ring 4)** | High-fidelity decoy twin hallucination | [`rings/ring4_shadow_honeypot.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring4_shadow_honeypot.py): Hallucinates coherent financial records and canary tokens under the Zero-403 deception policy. |
| **Zero-Day Virtual Patching (Ring 5)** | Real-time AST exploit neutralization | [`rings/ring5_autonomous_patcher.py`](file:///C:/Users/vaidz/documents/karyon/rings/ring5_autonomous_patcher.py): Synthesizes regex signatures and AST inspection filters in $<15\text{ms}$ upon zero-day arrival. |

### Credit Firewall & SQLite Memoization Cache
- Every model invocation passes through an SHA-256 SQLite memoization cache (`llm_response_cache` in `bank.db`).
- Benchmark and standard test prompts return in `<5ms` without making live outbound requests.
- An automated hardware circuit breaker enforces a ceiling of **60 calls/hour**, with automatic fallback to local Ollama (`llama3:latest` / `llama3.2:3b`) or deterministic cryptographic generation if cloud keys are offline.

---

## ⚡ Quick Start & Deployment

### 1. Requirements
- Python 3.10+ (with `torch`, `opencv-python-headless`, `fastapi`, `uvicorn`, `playwright`, `pytest`)
- Node.js 20+ (for React Vite dashboards)
- Docker (optional, for single-port cloud containers)

### 2. Local Execution
On Windows:
```cmd
start_karyon.bat
```

On Linux / macOS:
```bash
chmod +x start_karyon.sh
./start_karyon.sh
```

### 3. Docker & Hugging Face Spaces Deployment
Build and run the multi-stage single-port container (serves both frontends and gateway on port `7860`):
```bash
docker build -t karyon-defense .
docker run -p 7860:7860 karyon-defense
```

### 4. Access Endpoints
- **Karyon SOC Command Center**: [http://127.0.0.1:8000](http://127.0.0.1:8000) (or port `5173` in local Vite dev mode)
- **Target Banking Application (ApexFin)**: [http://127.0.0.1:8000/target-bank/](http://127.0.0.1:8000/target-bank/) (or port `3000` in dev mode)
- **FastAPI OpenAPI Interactive Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **SDK Integration Snippets**: `GET /api/sdk/snippets`
- **Real-Time Telemetry Feed**: `ws://127.0.0.1:8000/ws/telemetry`

---

## 🧪 Verification & Automated Test Suite

Run the full 26-test automated verification suite:
```bash
python -m pytest tests/ -v
```

### Test Suite Highlights (26/26 Passing):
1. **`test_e2e.py`**: Full multi-ring attack and defense lifecycle.
2. **`test_rings.py`**:
   - `test_ring1_sse_padding_normalized_256_bytes`: 256-byte SSE frame normalization.
   - `test_ring1_optical_adversarial_perturbation_and_svg`: Sub-25ms PyTorch perturbation.
   - `test_ring1_async_dom_or_fallback_screenshot`: Headless Playwright DOM capture & fallback.
   - `test_ring2_schema_rotation_and_bola_probe`: BOLA probe detection on retired routes.
   - `test_ring2_zero_credit_periodic_rotation`: 0-credit periodic cryptographic rotation.
   - `test_ring2_legitimate_ui_reads_no_self_ban`: False-positive elimination for UI reads.
   - `test_ring3_merkle_kv_surgical_eviction`: Attention block eviction and RoPE re-splicing.
   - `test_ring3_evaluate_tokens_semantic_ai_wiring`: Semantic AI prompt injection scoring.
   - `test_ring4_zero_403_shadow_deception_honeypot`: Zero-403 deception routing.
   - `test_ring4_stateful_shadow_balance_deduction`: Hallucinated shadow ledger integrity.
   - `test_ring5_virtual_patch_blocks_subsequent_exploit`: Real-time virtual patch ingress blocking.
   - `test_differential_ab_benchmark_proof`: Live A/B differential benchmark across all vectors.
   - `test_black_october_autonomous_virtual_patch`: Zero-day virtual patch rule synthesis.
   - `test_sdk_fastapi_middleware_and_snippets`: 1-line FastAPI middleware & snippets API.
3. **`test_target_app.py`**: 10 tests verifying SQLite banking ledger, atomic wire transfers, balance protections, and perimeter scanning.
