import type { Account, Transaction, SchemaManifest, TelemetrySnapshot, DifferentialResult, BlackOctoberResult, SdkSnippetsResponse } from '../types';

export function getApiBase(): string {
  if (typeof window === 'undefined') return 'http://127.0.0.1:8000';
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');

  const { hostname, port, origin } = window.location;
  // If running on Vite dev server (e.g. 5173, 3000) connect to gateway port 8000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port && port !== '8000') {
      return 'http://127.0.0.1:8000';
    }
  }
  // Single-port production mode (e.g. port 8000, Hugging Face Spaces, Cloudflare tunnel, Render)
  return origin;
}

export function getWsBase(): string {
  if (typeof window === 'undefined') return 'ws://127.0.0.1:8000';
  const envUrl = (import.meta as any).env?.VITE_WS_BASE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');

  const { protocol, hostname, port, host } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port && port !== '8000') {
      return 'ws://127.0.0.1:8000';
    }
  }
  return `${wsProtocol}//${host}`;
}

export const API_BASE = getApiBase();
export const WS_BASE = getWsBase();

export class KaryonService {
  private static telemetryWs: WebSocket | null = null;
  private static manifestWs: WebSocket | null = null;
  private static activeManifest: SchemaManifest | null = null;

  static setActiveManifest(manifest: SchemaManifest | null) {
    this.activeManifest = manifest;
  }

  static getPolymorphicRoute(canonical: string): string {
    if (this.activeManifest?.route_mappings?.[canonical]) {
      return this.activeManifest.route_mappings[canonical];
    }
    return canonical;
  }

  static async getAccounts(sessionId: string = 'session_default'): Promise<Account[]> {
    const route = this.getPolymorphicRoute('/target/api/accounts');
    const res = await fetch(`${API_BASE}${route}`, {
      headers: { 'X-Session-ID': sessionId }
    });
    if (!res.ok) throw new Error('Failed to load accounts');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.accounts || []);
  }

  static async executeTransfer(
    payload: { source_account: string; dest_account: string; amount: number; memo?: string },
    sessionId: string = 'session_default'
  ) {
    const route = this.getPolymorphicRoute('/target/api/transfer');
    const res = await fetch(`${API_BASE}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Transfer failed');
    }
    return data;
  }

  static async getTransactions(sessionId: string = 'session_default'): Promise<Transaction[]> {
    const route = this.getPolymorphicRoute('/target/api/transactions');
    const res = await fetch(`${API_BASE}${route}`, {
      headers: { 'X-Session-ID': sessionId }
    });
    if (!res.ok) throw new Error('Failed to load transactions');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.transactions || []);
  }

  static async chatAssistant(prompt: string, accountNumber?: string, sessionId: string = 'session_default') {
    const route = this.getPolymorphicRoute('/target/api/ai-assistant');
    const res = await fetch(`${API_BASE}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      },
      body: JSON.stringify({
        prompt,
        session_id: sessionId,
        account_number: accountNumber
      })
    });
    return await res.json();
  }

  static async getTelemetrySnapshot(): Promise<TelemetrySnapshot> {
    const res = await fetch(`${API_BASE}/api/telemetry`);
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    const data = await res.json();
    if (data.active_manifest) {
      this.activeManifest = data.active_manifest;
    }
    return data;
  }

  static async getOpticalStyles(sessionId: string = 'session_default') {
    const res = await fetch(`${API_BASE}/mesh/control/optical/styles?session_id=${sessionId}`);
    return await res.json();
  }

  static async getRenderedShield(sessionId: string = 'session_default') {
    const res = await fetch(`${API_BASE}/mesh/control/optical/render-shield?session_id=${sessionId}`);
    return await res.json();
  }

  static async rotateSchema() {
    const res = await fetch(`${API_BASE}/mesh/control/rotate-schema`, { method: 'POST' });
    return await res.json();
  }

  static async getExecutiveReport() {
    const res = await fetch(`${API_BASE}/api/reports/defense-executive`);
    if (!res.ok) throw new Error('Failed to fetch executive report');
    return await res.json();
  }

  static async scanTargetPerimeter(targetUrl: string = 'http://localhost:3000') {
    const res = await fetch(`${API_BASE}/api/target/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_url: targetUrl })
    });
    if (!res.ok) {
      throw new Error(`Perimeter scan failed: HTTP ${res.status}`);
    }
    return await res.json();
  }

  // Attack Simulator Controls
  static async simulateRogueVision(sessionId: string) {
    const res = await fetch(`${API_BASE}/mesh/simulate-attack/rogue-vision-bot?session_id=${sessionId}`, {
      method: 'POST'
    });
    return await res.json();
  }

  static async simulateExpiredSchemaProbe(sessionId: string) {
    const res = await fetch(`${API_BASE}/mesh/simulate-attack/expired-schema-probe?session_id=${sessionId}`, {
      method: 'POST'
    });
    return await res.json();
  }

  static async simulatePromptInjection(sessionId: string) {
    const res = await fetch(`${API_BASE}/mesh/simulate-attack/prompt-injection?session_id=${sessionId}`, {
      method: 'POST'
    });
    return await res.json();
  }

  static async executeSurgicalEvict(sessionId: string, blockId?: string) {
    const url = blockId
      ? `${API_BASE}/mesh/simulate-attack/surgical-evict?session_id=${sessionId}&block_id=${blockId}`
      : `${API_BASE}/mesh/simulate-attack/surgical-evict?session_id=${sessionId}`;
    const res = await fetch(url, { method: 'POST' });
    return await res.json();
  }

  static async resetSession(sessionId: string) {
    const res = await fetch(`${API_BASE}/mesh/simulate-attack/reset-session?session_id=${sessionId}`, {
      method: 'POST'
    });
    return await res.json();
  }

  // Protection Mode & Differential A/B & Black October
  static async setProtectionMode(armed: boolean): Promise<{ status: string; protection_armed: boolean }> {
    const res = await fetch(`${API_BASE}/api/system/protection-mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ armed })
    });
    if (!res.ok) throw new Error('Failed to toggle protection mode');
    return await res.json();
  }

  static async getProtectionMode(): Promise<{ status: string; protection_armed: boolean }> {
    const res = await fetch(`${API_BASE}/api/system/protection-mode`);
    if (!res.ok) throw new Error('Failed to get protection mode');
    return await res.json();
  }

  static async runDifferentialAbTest(): Promise<DifferentialResult> {
    const res = await fetch(`${API_BASE}/api/simulator/differential-ab-test`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to run differential A/B test');
    const data = await res.json();
    return data.result || data;
  }

  static async simulateBlackOctober(cveClass?: string): Promise<BlackOctoberResult> {
    const res = await fetch(`${API_BASE}/api/simulator/black-october`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cveClass ? { cve_class: cveClass } : {})
    });
    if (!res.ok) throw new Error('Failed to simulate Black October exploit');
    return await res.json();
  }

  static async getSdkSnippets(): Promise<SdkSnippetsResponse> {
    const res = await fetch(`${API_BASE}/api/sdk/snippets`);
    if (!res.ok) throw new Error('Failed to fetch SDK snippets');
    return await res.json();
  }

  // WebSocket Listeners
  static subscribeTelemetry(onMessage: (event: any) => void) {
    const connect = () => {
      try {
        const ws = new WebSocket(`${WS_BASE}/ws/telemetry`);
        this.telemetryWs = ws;

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            onMessage(data);
          } catch (err) {
            console.error('WebSocket parse error:', err);
          }
        };

        ws.onclose = () => {
          setTimeout(connect, 2000);
        };
      } catch (err) {
        setTimeout(connect, 2000);
      }
    };
    connect();

    return () => {
      if (this.telemetryWs) {
        this.telemetryWs.close();
      }
    };
  }

  static subscribeManifest(onManifest: (manifest: SchemaManifest) => void) {
    const connect = () => {
      try {
        const ws = new WebSocket(`${WS_BASE}/ws/manifest`);
        this.manifestWs = ws;

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            this.activeManifest = data;
            onManifest(data);
          } catch (err) {
            console.error('Manifest WS parse error:', err);
          }
        };

        ws.onclose = () => {
          setTimeout(connect, 3000);
        };
      } catch (err) {
        setTimeout(connect, 3000);
      }
    };
    connect();

    return () => {
      if (this.manifestWs) {
        this.manifestWs.close();
      }
    };
  }
}
