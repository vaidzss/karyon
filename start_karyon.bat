@echo off
title Karyon Autonomous AI Defense Plane
color 0B

echo ===============================================================================
echo                KARYON: AUTONOMOUS MOVING-TARGET AI DEFENSE PLANE
echo                     Context Firewall & Sovereign SOC Mesh
echo ===============================================================================
echo [INFO] Air-gapped 6GB VRAM Defense Plane Boot Sequence Initiating...
echo.

REM Verify Python environment
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3.10+ is required but not found in PATH.
    pause
    exit /b 1
)

REM Verify Node.js environment
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required for the React dashboards.
    pause
    exit /b 1
)

echo [1/4] Initializing SQLite Target Database & Defense State...
python -c "from target_app.database import init_db; init_db(); print('[OK] Database ready and seeded.')"

echo [2/4] Launching Karyon FastAPI Reverse-Proxy Mesh on http://127.0.0.1:8000 ...
start "Karyon Security Gateway" cmd /k "python -m uvicorn backend.server:app --host 127.0.0.1 --port 8000 --reload"

echo [3/4] Launching Target Corporate Banking App (ApexFin) on http://localhost:3000 ...
start "ApexFin Target Bank Portal" cmd /k "npm --prefix target_frontend run dev"

echo [4/4] Launching Karyon Cyber SOC Dashboard on http://localhost:5173 ...
start "Karyon Cyber SOC Command Center" cmd /k "npm --prefix frontend run dev"

echo.
echo ===============================================================================
echo  [+] TARGET BANK APP (ApexFin):       http://localhost:3000
echo  [+] KARYON DEFENSE SOC DASHBOARD:    http://localhost:5173
echo  [+] KARYON REVERSE-PROXY GATEWAY:    http://127.0.0.1:8000
echo  [+] EXECUTIVE DEFENSE AUDIT REPORT:  http://127.0.0.1:8000/api/reports/defense-executive
echo  [+] SWAGGER API DOCUMENTATION:       http://127.0.0.1:8000/docs
echo  [+] WEBSOCKET LIVE TELEMETRY:        ws://127.0.0.1:8000/ws/telemetry
echo ===============================================================================
echo Karyon 4-Ring Autonomous Defense Plane is LIVE.
echo.
pause
