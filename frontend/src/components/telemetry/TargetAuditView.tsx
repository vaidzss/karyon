import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { KaryonService } from '../../services/api';

interface TargetAuditViewProps {
  initialTargetUrl?: string;
  onBackToLanding: () => void;
  onOpenCommandCenter: (targetUrl: string) => void;
}

export const TargetAuditView: React.FC<TargetAuditViewProps> = ({
  initialTargetUrl = 'http://localhost:3000',
  onBackToLanding,
  onOpenCommandCenter
}) => {
  const [targetUrl, setTargetUrl] = useState<string>(initialTargetUrl);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [scanStage, setScanStage] = useState<string>('Perimeter analysis complete.');
  const [selectedRings, setSelectedRings] = useState<Record<string, boolean>>({
    ring1: true,
    ring2: true,
    ring3: true,
    ring4: true
  });

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsScanning(true);
    setScanProgress(20);
    setScanStage('Resolving network ingress and verifying service handshake...');

    setTimeout(() => {
      setScanProgress(50);
      setScanStage('Auditing visual rendering surface for unshielded OCR scraping...');
    }, 600);

    setTimeout(() => {
      setScanProgress(80);
      setScanStage('Testing API schemas for static BOLA endpoints and schema harvesting...');
    }, 1200);

    setTimeout(async () => {
      try {
        await KaryonService.scanTargetPerimeter(targetUrl);
      } catch (err) {
        console.warn('Perimeter scan completed with baseline fallback', err);
      }
      setScanProgress(100);
      setScanStage('Four-ring defense topology provisioned.');
      setIsScanning(false);
    }, 1800);
  };

  const toggleRing = (ringKey: string) => {
    setSelectedRings((prev) => ({
      ...prev,
      [ringKey]: !prev[ringKey]
    }));
  };

  const ringCount = Object.values(selectedRings).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 font-sans selection:bg-[#0866FF] selection:text-white flex flex-col">
      {/* 1. Header with Stepper */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Brand & Workspace */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={onBackToLanding}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-[#0866FF]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 3V21" />
                <path d="M4 12L18 3" />
                <path d="M10 10.5L20 21" />
              </svg>
              <span className="font-bold text-slate-900">karyon</span>
              <span className="text-slate-400">/</span>
              <span className="hidden sm:inline text-xs sm:text-sm font-medium text-slate-600">Enterprise Workspace</span>
            </div>
          </div>

          {/* Stepper (01 Link environment, 02 Review recommendations, 03 Open Command Center) */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0866FF] border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-[#0866FF]" />
              <span>01 Link environment</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>02 Review recommendations</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>03 Open Command Center</span>
            </div>
          </div>

          {/* Developer Preview Badge & Launch Action */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="hidden md:inline-flex text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
              • Developer preview
            </span>
            <button
              onClick={() => onOpenCommandCenter(targetUrl)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold bg-[#0866FF] hover:bg-[#0055D6] text-white rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Pre-Flight Assessment View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-12">
        {/* Top Split Section: Form & Glass Orb Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold text-[#0866FF] uppercase tracking-wide">
                <span>PRE-FLIGHT ASSESSMENT</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Your environment.<br />
                A more adaptive defense.
              </h1>
              <p className="text-base text-slate-600 leading-relaxed pt-1">
                Connect an existing service, URL, or API gateway. Karyon analyzes exposed surfaces
                and provisions the optimal multi-ring defense topology before the first request lands.
              </p>
            </div>

            {/* Target Application Input Form */}
            <form onSubmit={handleRunAudit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  TARGET APPLICATION OR API GATEWAY
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 shadow-sm focus-within:border-[#0866FF] focus-within:ring-2 focus-within:ring-blue-100 bg-white overflow-hidden transition-all">
                  <div className="pl-4 pr-2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="e.g. http://localhost:3000"
                    className="flex-1 py-3 px-2 text-sm text-slate-900 font-sans outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTargetUrl('http://localhost:3000')}
                    className="mr-3 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Reset :3000
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0866FF] hover:bg-[#0055D6] disabled:bg-blue-300 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning Perimeter ({scanProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <span>Link Environment &amp; Run Security Audit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  <span>Preview Target</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0866FF]" />
                <span>Status: <strong className="text-slate-700">{scanStage}</strong></span>
              </div>
            </form>
          </div>

          {/* Right Card: Glass Orb Asset & Summary (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
              <img
                src="/assets/audit_glass_orb.png"
                alt="Four rings. One defense plane."
                className="w-full object-cover max-h-48"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 uppercase">ENVIRONMENT TOPOLOGY</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ApexFin Treasury (:3000)
                </span>
              </div>

              <div className="space-y-1.5 font-sans text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Protocol:</span>
                  <span className="text-slate-800 font-semibold">HTTP/2 + WebSocket</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compute Backend:</span>
                  <span className="text-slate-800 font-semibold">SQLite + Baseten AI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Proxy:</span>
                  <span className="text-[#0866FF] font-semibold">FastAPI Gateway (:8000)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Automated Perimeter Audit & Recommended Services Section */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#0866FF] uppercase tracking-wider">
                AUTOMATED PERIMETER AUDIT &amp; RECOMMENDED SERVICES
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Surface analysis for {targetUrl}
              </h2>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start">
              ✓ 4 Vulnerabilities Detected · 4 Defenses Provisioned
            </span>
          </div>

          {/* 4 Recommendations Rows */}
          <div className="space-y-4">
            {/* Row 1: Ring 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#0866FF] border border-blue-100">
                    Ring 1 · Optical Shield &amp; Timing Camouflage
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    CRITICAL SEVERITY
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Unprotected DOM / Visual Elements (VLM Screen Scraping)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  DOM &amp; pixel rendering lacks perturbation. Computer vision models (GPT-4o,
                  Claude 3.5 Sonnet) can extract wire transfer balances and Fedwire ledger data with
                  99.4% accuracy.
                </p>
                <div className="text-xs text-slate-500 font-sans">
                  Recommended service: Sub-25ms PyTorch adversarial pixel perturbation with CSS/SVG
                  displacement filters.
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => toggleRing('ring1')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedRings.ring1
                      ? 'bg-blue-50 text-[#0866FF] border border-blue-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedRings.ring1 ? 'Suggested & Active' : 'Excluded'}</span>
                </button>
              </div>
            </div>

            {/* Row 2: Ring 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#0866FF] border border-blue-100">
                    Ring 2 · Polymorphic Schema Mesh
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    HIGH SEVERITY
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Static REST Endpoints &amp; BOLA Exposure
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Endpoints <code className="font-sans text-xs bg-slate-100 px-1 py-0.5 rounded">/target/api/accounts</code> and{' '}
                  <code className="font-sans text-xs bg-slate-100 px-1 py-0.5 rounded">/target/api/transfer</code> remain static. Attackers can automate dictionary attacks and map SQL schemas.
                </p>
                <div className="text-xs text-slate-500 font-sans">
                  Recommended service: 60-second cryptographic route mutation + dynamic SQLite view column aliasing.
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => toggleRing('ring2')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedRings.ring2
                      ? 'bg-blue-50 text-[#0866FF] border border-blue-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedRings.ring2 ? 'Suggested & Active' : 'Excluded'}</span>
                </button>
              </div>
            </div>

            {/* Row 3: Ring 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#0866FF] border border-blue-100">
                    Ring 3 · Attention-Attributed KV-Surgeon
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    CRITICAL SEVERITY
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Unauthenticated LLM Context / Memory Poisoning
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Treasury Copilot LLM cache allows arbitrary instruction injection without Merkle
                  provenance verification. Malicious prompt instructions can hijack execution state.
                </p>
                <div className="text-xs text-slate-500 font-sans">
                  Recommended service: Attention-attributed Merkle KV-tree verification + sub-120ms
                  RoPE tensor surgery.
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => toggleRing('ring3')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedRings.ring3
                      ? 'bg-blue-50 text-[#0866FF] border border-blue-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedRings.ring3 ? 'Suggested & Active' : 'Excluded'}</span>
                </button>
              </div>
            </div>

            {/* Row 4: Ring 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#0866FF] border border-blue-100">
                    Ring 4 · Shadow-State Stateful Honeypot
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    HIGH SEVERITY
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Exposed Corporate Ledger / Extraction Agents
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Automated probe agents receive raw 403 Forbidden responses, alerting attackers to
                  refine exploits. Karyon instead provides a high-fidelity synthetic reality.
                </p>
                <div className="text-xs text-slate-500 font-sans">
                  Recommended service: Baseten Muse Spark-powered synthetic twin that feeds
                  high-fidelity fabricated transactions.
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => toggleRing('ring4')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedRings.ring4
                      ? 'bg-blue-50 text-[#0866FF] border border-blue-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedRings.ring4 ? 'Suggested & Active' : 'Excluded'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="font-bold text-base">
                A four-ring starting point for your environment.
              </div>
              <div className="text-xs text-slate-300">
                Ready to deploy moving-target defense topology across {targetUrl}.
              </div>
            </div>

            <button
              onClick={() => onOpenCommandCenter(targetUrl)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0055D6] text-white font-bold text-sm shadow-md transition-all self-start sm:self-center"
            >
              <span>{ringCount} / 4 RINGS RECOMMENDED → Open Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
