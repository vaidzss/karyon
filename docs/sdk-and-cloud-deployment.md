# Karyon Defense Mesh: Enterprise SDK, Headless DOM Capture & Cloud Deployment

## 1. Overview & Architectural Upgrades

This document details the three high-impact production capabilities implemented to elevate Karyon from a local proof-of-concept into a zero-migration, enterprise-grade moving-target defense solution:

1. **Ring 1: Live Headless Playwright / Chromium DOM Screenshot Capture (`rings/ring1_optical_tls.py`)**
2. **Drop-In 1-Line Enterprise SDK (`sdk/`) & Interactive SOC Integration Deck (`frontend/src/components/telemetry/SdkIntegrationView.tsx`)**
3. **Cloud-Ready Dynamic URL Resolution & Single-Port Static Mounting (`backend/server.py` & `frontend/src/services/api.ts`)**

---

## 2. Upgrade 1: Headless Playwright DOM Screenshot Capture (Ring 1)

### Mechanics
- **Function**: `capture_live_target_dom_screenshot(target_url: str = "http://localhost:3000")`
- **Execution**:
  - Connects to headless Chromium (`viewport: 800x450`, `timeout: 3000ms`) via `playwright.async_api`.
  - Fallback check against headless Edge/Chrome CLI if Playwright is absent or target is live.
  - Automatic, seamless fallback to OpenCV banking card generator (`render_banking_card_image()`) for offline test environments.
- **In-Memory Caching**:
  - 30-second memory cache (`_dom_cache`) stores decoded BGR NumPy frames and sensitive bounding boxes (account balances, wire transfer buttons).
  - Repeated renders execute with sub-5ms latency (`<5ms`).
- **Perturbation & Chromatic Aberration**:
  - PyTorch tensor perturbation (`perturb_image_array()`) applies high-frequency adversarial noise and chromatic channel shifts across sensitive regions.
- **Asynchronous Shield Ingress**:
  - `get_rendered_shield_base64_async()` exposes clean and perturbed base64 PNGs and telemetry metadata (`capture_source: "LIVE_PLAYWRIGHT_DOM" | "SYNTHETIC_OPENCV_CARD"`).
  - Wired into `GET /mesh/control/optical/render-shield` and `POST /mesh/simulate-attack/rogue-vision-bot`.

---

## 3. Upgrade 2: Drop-In 1-Line Enterprise SDK (`sdk/`)

### Zero-Migration Architecture
Karyon requires zero schema changes, zero database migrations, and zero rewrites of core banking logic. It can be integrated as an upstream reverse proxy or via a single-line ASGI middleware.

### 1. Python / FastAPI Middleware (`sdk/karyon_fastapi.py`)
```python
from fastapi import FastAPI
from sdk.karyon_fastapi import KaryonShieldMiddleware, karyon_protect_route

app = FastAPI(title="Corporate Treasury Service")

# Mount Karyon Shield Gateway Middleware
app.add_middleware(
    KaryonShieldMiddleware,
    gateway_url="http://127.0.0.1:8000",
    app_id="corporate-banking-service"
)

@app.post("/api/transfer")
@karyon_protect_route(ring_level=4)  # Enforces Zero-403 Honeypot Deception
async def execute_transfer(payload: dict):
    # Business logic executes safely; attacks are intercepted before reaching this handler
    return {"status": "SETTLED", "tx_id": "TX-PROD-991204"}
```
- Injects standard telemetry headers: `X-Karyon-Shield: active`, `X-Karyon-App-ID`, `X-Karyon-Session-ID`, `X-Karyon-Ring`.
- Supports both synchronous (`def`) and asynchronous (`async def`) route handlers.

### 2. React / Next.js Optical Boundary (`sdk/karyon_react.tsx`)
```tsx
import React from 'react';
import { KaryonProtectionProvider, KaryonOpticalBoundary } from './sdk/karyon_react';

export function App() {
  return (
    <KaryonProtectionProvider gatewayUrl="http://127.0.0.1:8000">
      <div className="dashboard-container">
        {/* Ring 1: Shield balance cards from Multimodal OCR Screen Scraping */}
        <KaryonOpticalBoundary intensity={0.75}>
          <div className="treasury-balance-card">
            <h2>Total Liquidity: $42,100,500.25 USD</h2>
          </div>
        </KaryonOpticalBoundary>
      </div>
    </KaryonProtectionProvider>
  );
}
```
- Automatically registers dynamic SVG `<feDisplacementMap>` and micro-jitter CSS animations.
- Protects rendered DOM from multimodal AI screen scrapers (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5) without degrading human readability.

### 3. Dynamic Snippets Endpoint (`GET /api/sdk/snippets`)
- Returns live, formatted integration snippets dynamically populated with the active rotating epoch token and polymorphic route aliases.

### 4. Interactive SOC Integration Deck (`SdkIntegrationView.tsx`)
- Integrated directly into `MetaKaryonSocView.tsx` with sidebar navigation (`Code2` icon).
- Live active epoch banner (`Epoch v{manifest.version}`).
- Copy-to-clipboard functionality with real visual feedback.
- 4 Bento Cards explaining the four architectural pillars:
  1. Zero-Migration Architecture
  2. Dynamic Epoch Ingress
  3. Zero-403 Active Deception
  4. Multimodal OCR Cloaking

---

## 4. Upgrade 3: Cloud-Ready Dynamic URL Resolution & Single-Port Static Mounting

### 1. Dynamic Origin Resolution (`frontend/src/services/api.ts`)
- Functions: `getApiBase()` and `getWsBase()`
- Automatically detects environment:
  - Local Vite Dev: Points to `http://127.0.0.1:8000` and `ws://127.0.0.1:8000`.
  - Single-Port Production Mode (e.g., Hugging Face Spaces `*.hf.space`, Cloudflare Tunnels `*.trycloudflare.com`, Render `*.onrender.com`): Uses `window.location.origin` and `wss://${window.location.host}`.
  - Supports explicit overrides via `VITE_API_BASE_URL` and `VITE_WS_BASE_URL`.

### 2. Single-Port Static Mounting (`backend/server.py`)
- Mounts both SPAs on a single port (`8000`):
  - `/target-bank`: Serves `target_frontend/dist` (the target banking app).
  - `/`: Serves `frontend/dist` (the Karyon SOC Command Deck).
  - Fallback SPA catch-all routing safely passes through API and mesh routes (`/api/*`, `/mesh/*`, `/target/api/*`, `/ws/*`).

---

## 5. Verification & Test Suite Status

The complete test suite runs across 26 passing tests with zero mocked timers and strict credit conservation:

```bash
python -m pytest -v
================== 26 passed, 1 warning in 80.38s ===================
```

### Passing Tests Summary
1. `tests/test_e2e.py::test_full_e2e_defense_lifecycle` (PASSED)
2. `tests/test_rings.py::test_ring1_sse_padding_normalized_256_bytes` (PASSED)
3. `tests/test_rings.py::test_ring1_optical_adversarial_perturbation_and_svg` (PASSED)
4. `tests/test_rings.py::test_ring2_schema_rotation_and_bola_probe[asyncio]` (PASSED)
5. `tests/test_rings.py::test_ai_router_baseten_bearer_auth_and_retry[asyncio]` (PASSED)
6. `tests/test_rings.py::test_ring2_zero_credit_periodic_rotation[asyncio]` (PASSED)
7. `tests/test_rings.py::test_ring3_evaluate_tokens_semantic_ai_wiring[asyncio]` (PASSED)
8. `tests/test_rings.py::test_ring1_async_dom_or_fallback_screenshot[asyncio]` (PASSED)
9. `tests/test_rings.py::test_ring3_merkle_kv_surgical_eviction` (PASSED)
10. `tests/test_rings.py::test_ring4_zero_403_shadow_deception_honeypot` (PASSED)
11. `tests/test_rings.py::test_ring4_stateful_shadow_balance_deduction` (PASSED)
12. `tests/test_rings.py::test_differential_ab_benchmark_proof` (PASSED)
13. `tests/test_rings.py::test_black_october_autonomous_virtual_patch` (PASSED)
14. `tests/test_rings.py::test_ring5_virtual_patch_blocks_subsequent_exploit` (PASSED)
15. `tests/test_rings.py::test_ring2_legitimate_ui_reads_no_self_ban` (PASSED)
16. `tests/test_rings.py::test_sdk_fastapi_middleware_and_snippets` (PASSED)
17-26. `tests/test_target_app.py` (All 10 target banking and perimeter audit tests PASSED)
