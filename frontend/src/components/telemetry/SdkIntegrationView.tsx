import React, { useState, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  Boxes
} from 'lucide-react';
import type { SchemaManifest, SdkSnippetsResponse } from '../../types';
import { KaryonService } from '../../services/api';

interface SdkIntegrationViewProps {
  manifest: SchemaManifest | null;
  gatewayUrl?: string;
}

export const SdkIntegrationView: React.FC<SdkIntegrationViewProps> = ({
  manifest,
  gatewayUrl = 'http://127.0.0.1:8000'
}) => {
  const [activeTab, setActiveTab] = useState<'fastapi' | 'react' | 'docker' | 'curl'>('fastapi');
  const [copied, setCopied] = useState<boolean>(false);
  const [snippetsData, setSnippetsData] = useState<SdkSnippetsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSnippets = async () => {
    setIsLoading(true);
    try {
      const data = await KaryonService.getSdkSnippets();
      setSnippetsData(data);
    } catch (err) {
      console.warn('Falling back to local template snippets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [manifest?.version]);

  const currentEpoch = manifest?.version || snippetsData?.current_epoch || 1;
  const sampleRoute =
    manifest?.route_mappings?.['/target/api/accounts'] ||
    snippetsData?.sample_active_route ||
    '/mesh/api/v1_accounts_dynamic';

  // Fallback snippets if backend is initializing
  const fallbackFastapi = `# 1-Line Drop-in Python / FastAPI Middleware
from fastapi import FastAPI
from sdk.karyon_fastapi import KaryonShieldMiddleware, karyon_protect_route

app = FastAPI(title="Corporate Treasury Service")

# Mount Karyon Shield Gateway Middleware
app.add_middleware(
    KaryonShieldMiddleware,
    gateway_url="${gatewayUrl}",
    app_id="corporate-banking-service"
)

@app.post("/api/transfer")
@karyon_protect_route(ring_level=4)  # Enforces Zero-403 Honeypot Deception
async def execute_transfer(payload: dict):
    # Business logic executes safely; attacks are intercepted before reaching this handler
    return {"status": "SETTLED", "tx_id": "TX-PROD-991204"}`;

  const fallbackReact = `// 1-Line Drop-in React Optical & Polymorphic Boundary
import React from 'react';
import { KaryonProtectionProvider, KaryonOpticalBoundary } from './sdk/karyon_react';

export function App() {
  return (
    <KaryonProtectionProvider gatewayUrl="${gatewayUrl}">
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
}`;

  const fallbackDocker = `# Production Docker Compose Sidecar Deployment
version: '3.8'

services:
  karyon-gateway:
    image: karyon/defense-gateway:v1.0.0
    ports:
      - "8000:8000"
    environment:
      - TARGET_BACKEND_URL=http://app-service:3000
      - SCHEMA_ROTATION_INTERVAL_SEC=60
      - ENABLE_SQLITE_LLM_CACHE=true
    restart: unless-stopped

  app-service:
    build: .
    expose:
      - "3000"
    environment:
      - KARYON_GATEWAY_URL=http://karyon-gateway:8000`;

  const fallbackCurl = `# Live Ingress Verification via Active Polymorphic Route (Epoch ${currentEpoch})
curl -X GET "${gatewayUrl}${sampleRoute}" \\
  -H "X-Session-ID: enterprise_client_01" \\
  -H "Accept: application/json"`;

  const activeCode =
    snippetsData?.snippets?.[activeTab]?.code ||
    (activeTab === 'fastapi'
      ? fallbackFastapi
      : activeTab === 'react'
      ? fallbackReact
      : activeTab === 'docker'
      ? fallbackDocker
      : fallbackCurl);

  const activeTitle =
    snippetsData?.snippets?.[activeTab]?.title ||
    (activeTab === 'fastapi'
      ? 'FastAPI / Python (ASGI Middleware)'
      : activeTab === 'react'
      ? 'React / Next.js (Optical Boundary Provider)'
      : activeTab === 'docker'
      ? 'Docker Compose Sidecar (Envoy / Shield Mesh)'
      : 'Ingress Verification CLI');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Enterprise Overview */}
      <div className="bg-[#101522] border border-[#1F2637] rounded-[24px] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-[#0866FF]/10 text-[#0866FF] border border-[#0866FF]/20 rounded-xl">
                <Code2 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  1-Line Enterprise SDK &amp; Zero-Migration Integration
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Production Drop-In
                  </span>
                </h2>
                <p className="text-xs text-[#8A94A6]">
                  Drop Karyon Shield into existing web applications, microservices, or APIs without altering database schemas or core business logic.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSnippets}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Snippets</span>
            </button>
          </div>
        </div>

        {/* Dynamic Token Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#8A94A6]">Active Protection Epoch:</span>
            <span className="font-bold text-white font-sans tabular-nums">Epoch v{currentEpoch}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8A94A6]">Active Polymorphic Ingress:</span>
            <code className="text-xs text-[#0866FF] bg-[#161B26] px-2 py-1 rounded font-mono truncate max-w-xs sm:max-w-md">
              {sampleRoute}
            </code>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8A94A6]">Gateway Ingress:</span>
            <code className="text-xs text-emerald-300 bg-[#161B26] px-2 py-1 rounded font-mono">
              {gatewayUrl}
            </code>
          </div>
        </div>
      </div>

      {/* Code Snippets Bento Card */}
      <div className="bg-[#101522] border border-[#1F2637] rounded-[24px] overflow-hidden shadow-sm">
        {/* Tab Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#1F2637] px-4 pt-3 gap-2 bg-[#0C101A]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('fastapi')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'fastapi'
                  ? 'bg-[#101522] text-[#0866FF] border-t-2 border-t-[#0866FF] border-x border-[#1F2637]'
                  : 'text-[#8A94A6] hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>FastAPI / Python</span>
            </button>

            <button
              onClick={() => setActiveTab('react')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'react'
                  ? 'bg-[#101522] text-[#0866FF] border-t-2 border-t-[#0866FF] border-x border-[#1F2637]'
                  : 'text-[#8A94A6] hover:text-white'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>React / Next.js</span>
            </button>

            <button
              onClick={() => setActiveTab('docker')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'docker'
                  ? 'bg-[#101522] text-[#0866FF] border-t-2 border-t-[#0866FF] border-x border-[#1F2637]'
                  : 'text-[#8A94A6] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Docker Sidecar</span>
            </button>

            <button
              onClick={() => setActiveTab('curl')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'curl'
                  ? 'bg-[#101522] text-[#0866FF] border-t-2 border-t-[#0866FF] border-x border-[#1F2637]'
                  : 'text-[#8A94A6] hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CLI Ingress</span>
            </button>
          </div>

          <div className="pb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="p-5 bg-[#0A0D14]">
          <div className="flex items-center justify-between pb-3 text-xs text-[#8A94A6]">
            <span className="font-semibold text-slate-300">{activeTitle}</span>
            <span className="text-[11px] font-mono uppercase bg-[#161B26] px-2 py-0.5 rounded text-slate-400">
              {snippetsData?.snippets?.[activeTab]?.language || (activeTab === 'curl' ? 'bash' : activeTab === 'docker' ? 'yaml' : activeTab === 'fastapi' ? 'python' : 'tsx')}
            </span>
          </div>

          <pre className="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto p-4 rounded-xl bg-[#06080D] border border-[#1F2637] max-h-[380px]">
            <code>{activeCode}</code>
          </pre>
        </div>
      </div>

      {/* 4 Architectural Pillars Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-[20px] bg-[#101522] border border-[#1F2637] space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0866FF] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Zero-Migration Architecture</h3>
          <p className="text-xs text-[#8A94A6] leading-relaxed">
            Karyon operates as an upstream reverse proxy or 1-line ASGI middleware. Zero schema migrations or changes to core banking logic required.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-[20px] bg-[#101522] border border-[#1F2637] space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Dynamic Epoch Ingress</h3>
          <p className="text-xs text-[#8A94A6] leading-relaxed">
            Frontend apps automatically listen to <code className="font-mono text-[11px] text-purple-300">/ws/manifest</code> to route API requests to currently active rotating endpoints every 60 seconds.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-[20px] bg-[#101522] border border-[#1F2637] space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Zero-403 Active Deception</h3>
          <p className="text-xs text-[#8A94A6] leading-relaxed">
            Malicious probes are never dropped or answered with 403 Forbidden. Attackers are silently routed to Ring 4's synthetic decoy generator.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-5 rounded-[20px] bg-[#101522] border border-[#1F2637] space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Multimodal OCR Cloaking</h3>
          <p className="text-xs text-[#8A94A6] leading-relaxed">
            <code className="font-mono text-[11px] text-emerald-300">&lt;KaryonOpticalBoundary&gt;</code> wraps financial data in imperceptible SVG displacement filters, confusing AI scrapers without degrading human UX.
          </p>
        </div>
      </div>
    </div>
  );
};
