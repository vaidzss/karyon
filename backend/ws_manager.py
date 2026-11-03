import json
import logging
from typing import Set, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger("karyon.websocket")

class WebSocketManager:
    def __init__(self):
        self.telemetry_clients: Set[WebSocket] = set()
        self.manifest_clients: Set[WebSocket] = set()

    async def connect_telemetry(self, websocket: WebSocket):
        await websocket.accept()
        self.telemetry_clients.add(websocket)
        logger.info(f"Telemetry client connected. Total: {len(self.telemetry_clients)}")

    def disconnect_telemetry(self, websocket: WebSocket):
        self.telemetry_clients.discard(websocket)
        logger.info(f"Telemetry client disconnected. Remaining: {len(self.telemetry_clients)}")

    async def connect_manifest(self, websocket: WebSocket):
        await websocket.accept()
        self.manifest_clients.add(websocket)
        logger.info(f"Manifest client connected. Total: {len(self.manifest_clients)}")

    def disconnect_manifest(self, websocket: WebSocket):
        self.manifest_clients.discard(websocket)
        logger.info(f"Manifest client disconnected. Remaining: {len(self.manifest_clients)}")

    async def broadcast_telemetry(self, message: Dict[str, Any]):
        """Broadcasts telemetry state update to all active SOC dashboards."""
        if not self.telemetry_clients:
            return
        dead_clients = set()
        data = json.dumps(message)
        for client in self.telemetry_clients:
            try:
                await client.send_text(data)
            except Exception:
                dead_clients.add(client)
        
        for dead in dead_clients:
            self.telemetry_clients.discard(dead)

    async def broadcast_manifest(self, manifest_data: Dict[str, Any]):
        """Pushes new polymorphic schema manifest to legitimate frontend applications."""
        if not self.manifest_clients:
            return
        dead_clients = set()
        data = json.dumps(manifest_data)
        for client in self.manifest_clients:
            try:
                await client.send_text(data)
            except Exception:
                dead_clients.add(client)

        for dead in dead_clients:
            self.manifest_clients.discard(dead)

ws_manager = WebSocketManager()
