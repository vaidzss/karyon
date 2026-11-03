#!/usr/bin/env bash
set -e

echo "==============================================================================="
echo "               KARYON: AUTONOMOUS MOVING-TARGET AI DEFENSE PLANE               "
echo "                    Context Firewall & Sovereign SOC Mesh                      "
echo "==============================================================================="
echo "[INFO] Air-gapped 6GB VRAM Defense Plane Boot Sequence Initiating..."
echo ""

# Check python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[ERROR] Python 3 is required but not installed."
    exit 1
fi

PY_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PY_CMD="python"
fi

# Check node
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is required for React Vite dashboards."
    exit 1
fi

echo "[1/4] Initializing SQLite Target Database & Defense State..."
$PY_CMD -c "from target_app.database import init_db; init_db(); print('[OK] Database ready and seeded.')"

echo "[2/4] Launching Karyon FastAPI Reverse-Proxy Mesh on http://127.0.0.1:8000 ..."
$PY_CMD -m uvicorn backend.server:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "[3/4] Launching Target Corporate Banking App (ApexFin) on http://localhost:3000 ..."
(cd target_frontend && npm run dev) &
TARGET_PID=$!

echo "[4/4] Launching Karyon Cyber SOC Dashboard on http://localhost:5173 ..."
(cd frontend && npm run dev) &
SOC_PID=$!

trap "kill $BACKEND_PID $TARGET_PID $SOC_PID 2>/dev/null" EXIT

echo ""
echo "==============================================================================="
echo " [+] TARGET BANK APP (ApexFin):       http://localhost:3000"
echo " [+] KARYON DEFENSE SOC DASHBOARD:    http://localhost:5173"
echo " [+] KARYON REVERSE-PROXY GATEWAY:    http://127.0.0.1:8000"
echo " [+] EXECUTIVE DEFENSE AUDIT REPORT:  http://127.0.0.1:8000/api/reports/defense-executive"
echo " [+] SWAGGER API DOCUMENTATION:       http://127.0.0.1:8000/docs"
echo " [+] WEBSOCKET LIVE TELEMETRY:        ws://127.0.0.1:8000/ws/telemetry"
echo "==============================================================================="
echo "Karyon 4-Ring Autonomous Defense Plane is LIVE. Press Ctrl+C to stop."
echo ""

wait
