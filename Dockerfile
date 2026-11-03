# ==============================================================================
# STAGE 1: Build Frontends (React / Vite)
# ==============================================================================
FROM node:20-slim AS frontend-builder
WORKDIR /app

# Build target banking frontend
COPY target_frontend/package*.json ./target_frontend/
RUN cd target_frontend && npm install --legacy-peer-deps

COPY target_frontend/ ./target_frontend/
RUN cd target_frontend && npm run build

# Build Karyon SOC platform frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# ==============================================================================
# STAGE 2: Python Defense Gateway Runtime
# ==============================================================================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HOST=0.0.0.0 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies for OpenCV and Playwright
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements and Playwright headless Chromium with dependencies
COPY requirements.txt .
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt && \
    playwright install --with-deps chromium && \
    chmod -R 777 /ms-playwright

# Copy application source code
COPY backend/ ./backend/
COPY rings/ ./rings/
COPY sdk/ ./sdk/
COPY target_app/ ./target_app/
COPY docs/ ./docs/

# Copy compiled frontend builds from builder stage
COPY --from=frontend-builder /app/target_frontend/dist ./target_frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure permissions for Hugging Face Spaces (user 1000) and container environments
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/target_app && \
    chown -R appuser:appuser /app && \
    chmod -R 777 /app/target_app && \
    chmod 666 /app/target_app/bank.db 2>/dev/null || true

USER appuser

# Expose Hugging Face Spaces default port (7860) and standard container port (8000)
EXPOSE 7860 8000

# Healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://127.0.0.1:${PORT:-7860}/target/api/health || exit 1

# Start Karyon Autonomous Defense Gateway
CMD ["sh", "-c", "uvicorn backend.server:app --host 0.0.0.0 --port ${PORT:-7860}"]
