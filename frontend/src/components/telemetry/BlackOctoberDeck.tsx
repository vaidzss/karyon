import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bug, 
  Key, 
  CheckCircle2, 
  AlertOctagon, 
  Code2, 
  Radio
} from 'lucide-react';
import type { BlackOctoberResult, VirtualPatchRule } from '../../types';
import { KaryonService } from '../../services/api';

interface BlackOctoberDeckProps {
  virtualPatches: VirtualPatchRule[];
  onPatchMitigated?: (result: BlackOctoberResult) => void;
}

const EXPLOIT_OPTIONS = [
  {
    id: 'SUPPLY_CHAIN_ENV_LEAK',
    name: 'Railway / LiteLLM Env Leak & Schema Replay',
    desc: 'Stolen .env secrets, retired schema replay & BOLA account enumeration probe',
    cveClass: 'CVE-2026-OCT-8821'
  },
  {
    id: 'PHP2SHELL_RCE_PROBE',
    name: 'Unauthenticated RCE & Polyglot Injection Probe',
    desc: 'Zero-day unauthenticated command injection & SQL parameter traversal',
    cveClass: 'CVE-2026-OCT-4491'
  },
  {
    id: 'POISONED_PACKAGE_EXFIL',
    name: 'Malicious Dependency Context Exfiltration',
    desc: 'Supply-chain package attempting RAG memory & KV cache secret exfiltration',
    cveClass: 'CVE-2026-OCT-1204'
  }
];

export const BlackOctoberDeck: React.FC<BlackOctoberDeckProps> = ({
  virtualPatches,
  onPatchMitigated
}) => {
  const [selectedExploit, setSelectedExploit] = useState(EXPLOIT_OPTIONS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [latestMitigation, setLatestMitigation] = useState<BlackOctoberResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateExploit = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await KaryonService.simulateBlackOctober(selectedExploit);
      setLatestMitigation(res);
      if (onPatchMitigated) {
        onPatchMitigated(res);
      }
    } catch (err: any) {
      console.error('Black October simulation error:', err);
      setError(err?.message || 'Failed to trigger Black October simulation');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                "Black October" Autonomous Virtual Patcher
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Self-Healing Gateway
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Autonomous real-time counter-agent simulating the October 2026 enterprise exploit wave: dynamically synthesizes AST filters, hot-loads virtual patches, and shunts attackers to deception state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateExploit}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 transition-all shadow-sm disabled:opacity-50"
            >
              <Bug className={`w-4 h-4 fill-white ${isRunning ? 'animate-bounce' : ''}`} />
              <span>{isRunning ? 'Synthesizing Live Virtual Patch...' : 'Simulate Black October Zero-Day'}</span>
            </button>
          </div>
        </div>

        {/* Exploit Vector Selector */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXPLOIT_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelectedExploit(opt.id)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                selectedExploit === opt.id
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 dark:border-blue-600 shadow-sm'
                  : 'bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  {opt.cveClass}
                </span>
                <span className={`w-2 h-2 rounded-full ${selectedExploit === opt.id ? 'bg-blue-600 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {opt.name}
              </h4>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {opt.desc}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Kill Chain Pipeline Visualizer */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Autonomous Counter-Agent Kill-Chain Pipeline
            </h3>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Sub-8ms Dynamic Mitigation Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Zero-Day Ingress', sub: 'Anomaly Ingress Detected' },
            { step: '02', title: 'Muse Spark AI', sub: 'AST & Regex Synthesized' },
            { step: '03', title: 'Hot-Load Rule', sub: 'In-Memory Proxy Spliced' },
            { step: '04', title: 'Epoch Rotation', sub: 'Ring 2 Schema Invalidated' },
            { step: '05', title: 'Shadow Canary', sub: 'Ring 4 Deception Diverted' }
          ].map((s) => {
            const isCompleted = latestMitigation !== null;
            return (
              <div 
                key={s.step} 
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800' 
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-400">{s.step}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  )}
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {s.title}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Synthesized Virtual Patch Breakdown */}
      {latestMitigation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virtual Patch AST Box */}
          <div className="lg:col-span-2 bg-zinc-950 text-zinc-100 rounded-[24px] p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Active Virtual Patch AST Rule: {latestMitigation.patch.patch_id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 tabular-nums">
                  {latestMitigation.patch.deploy_latency_ms.toFixed(1)}ms Deploy Latency
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-400">Regex Ingress Signature:</div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-blue-300 font-sans break-all">
                {latestMitigation.patch.regex_signature}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-400">Dynamic AST Filter Rule:</div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-emerald-300 font-sans leading-relaxed">
                {latestMitigation.patch.ast_filter_rule}
              </div>
            </div>

            <div className="space-y-1 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
              <div className="font-semibold text-zinc-300">Reasoning Synthesis Trace:</div>
              <p className="leading-relaxed text-zinc-400">
                {latestMitigation.patch.reasoning_trace}
              </p>
            </div>
          </div>

          {/* Canary Token & Deception Shunt Status */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 space-y-5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Canary Token & Deception Sink</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Active Canary Token Assigned
              </div>
              <div className="text-sm font-bold text-amber-900 dark:text-amber-200 tabular-nums">
                {latestMitigation.canary_token}
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                Canary token bound to session {latestMitigation.session_id}. Any subsequent queries referencing this token reveal adversary scraping infrastructure without alert triggers.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Ring 2 Schema Epoched:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {latestMitigation.schema_rotated ? 'Rotated & Invalidated' : 'Unchanged'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Ring 4 Honeypot Shunt:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {latestMitigation.honeypot_diverted ? '200 OK Deception Active' : 'Direct'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Quarantined Payload:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">
                  {latestMitigation.attacker_payload_quarantined}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Hot-Loaded Virtual Patches Catalog */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] overflow-hidden shadow-sm">
        <div className="p-4 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Active Virtual Patch Catalog ({virtualPatches.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            In-Memory Gateway Rules
          </span>
        </div>

        {virtualPatches.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            No emergency virtual patches hot-loaded yet. Standard 4-ring baseline active.
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {virtualPatches.map((patch) => (
              <div key={patch.patch_id} className="p-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{patch.patch_id}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      {patch.mitigated_cve_class}
                    </span>
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 font-sans">
                    AST Rule: {patch.ast_filter_rule}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 tabular-nums">
                  <span>Latency: <strong className="text-emerald-600 dark:text-emerald-400">{patch.deploy_latency_ms.toFixed(1)}ms</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hot-Loaded
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
