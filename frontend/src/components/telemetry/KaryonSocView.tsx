import React from 'react';
import { MerkleTreeVisualizer } from './MerkleTreeVisualizer';
import { SchemaCountdownTimer } from './SchemaCountdownTimer';
import { OpticalCanvasPreview } from './OpticalCanvasPreview';
import { ShadowTerminal } from './ShadowTerminal';
import {
  Shield,
  Cpu,
  Lock,
  Activity,
  Zap,
  Database,
  Brain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import type { SchemaManifest, HoneypotLog, MerkleBlock, SessionThreat } from '../../types';

interface KaryonSocViewProps {
  manifest: SchemaManifest | null;
  honeypotLogs: HoneypotLog[];
  blocks: MerkleBlock[];
  currentSession: SessionThreat | undefined;
  sessionId: string;
  attacksNeutralized: number;
  packetsJittered: number;
  perturbedImageBase64?: string | null;
  visionProbeResult?: any;
  latestModelReasoning?: string | null;
  activeAiProvider?: any;
  onRefreshTelemetry: () => void;
}

export const KaryonSocView: React.FC<KaryonSocViewProps> = ({
  manifest,
  honeypotLogs,
  blocks,
  currentSession,
  sessionId,
  attacksNeutralized,
  packetsJittered,
  perturbedImageBase64,
  visionProbeResult,
  latestModelReasoning,
  activeAiProvider,
  onRefreshTelemetry
}) => {
  const [showReasoning, setShowReasoning] = React.useState<boolean>(false);

  const threatScore = currentSession ? currentSession.threat_score : 0.0;
  const isCamouflage = currentSession ? currentSession.optical_camouflage_active : false;
  const isShadow = currentSession ? currentSession.shadow_mode : false;

  const providerName = activeAiProvider?.provider || 'BASETEN';
  const modelName = activeAiProvider?.model || 'meta-models/muse-spark-open-1026';

  return (
    <div className="min-h-full bg-[#070a12] text-slate-100 flex flex-col font-sans">
      {/* SOC Command Bar Header */}
      <div className="bg-[#0b0f1a] border-b border-cyber-border/80 px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-lg font-bold tracking-wider text-white uppercase flex items-center gap-2">
                  Karyon SOC <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">AIR-GAPPED DEFENSE PLANE</span>
                </h1>
                <span className="text-[10px] text-slate-400 font-sans">v1.0.0-SOVEREIGN</span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Moving-Target AI Defense & Context Firewall · Protecting: <strong className="text-slate-200">ApexFin Treasury</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-xs font-sans text-emerald-300 flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Target Bank (:3000)</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">VRAM:</span>
              <span className="text-emerald-400 font-bold">1.8GB / 6GB</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded">RTX 3050</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-xs">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">AI:</span>
              <span className="text-cyan-400 font-bold">{providerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main SOC Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
        {/* Defense Posture & Ring Health Overview Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-[#0c1222] border border-cyber-border/80">
            <div className="text-[11px] text-slate-400 uppercase">Target Threat Level</div>
            <div className={`text-2xl font-bold mt-1 ${
              threatScore >= 0.7 ? 'text-red-400 animate-pulse' : threatScore >= 0.5 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {(threatScore * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Threshold: 50% Camouflage | 70% Zero-403
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1222] border border-cyber-border/80">
            <div className="text-[11px] text-slate-400 uppercase">Attacks Neutralized</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>{attacksNeutralized}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Zero Unauthorized Balance Exfiltrations
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1222] border border-cyber-border/80">
            <div className="text-[11px] text-slate-400 uppercase">TLS Clock Jitter Ticks</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>{packetsJittered}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              25ms / 256-Byte Constant-Time Frames
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1222] border border-cyber-border/80">
            <div className="text-[11px] text-slate-400 uppercase">4-Ring Mesh Status</div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                isCamouflage ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                R1: OPT
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/40">
                R2: POLY
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/40">
                R3: MERKLE
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                isShadow ? 'bg-amber-500/25 text-amber-300 border-amber-500 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                R4: ZERO-403
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Active Defense Topology
            </div>
          </div>
        </div>

        {/* AI Defense Engine & Model Reasoning Drawer */}
        <div className="p-4 rounded-xl bg-[#0c1222] border border-cyber-border/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400">Autonomous Reasoning Coprocessor: </span>
                <strong className="text-white">{providerName}</strong>
                <span className="text-slate-400 text-[11px] ml-1">({modelName})</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>SQLite Memoization: <strong className="text-emerald-400">ENABLED</strong></span>
              </div>
              <div className="flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>Circuit Breaker: <strong className="text-cyan-400">60 calls/hr</strong></span>
              </div>
            </div>
          </div>

          {latestModelReasoning && (
            <div className="border-t border-slate-800/80 pt-2.5">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center justify-between w-full text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <Brain className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>Meta Muse Spark Open — Live Chain-of-Thought Reasoning Stream</span>
                </span>
                {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReasoning && (
                <div className="mt-2.5 p-3.5 rounded-lg bg-black/60 border border-purple-500/30 text-xs text-slate-200 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {latestModelReasoning}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ring 3: Merkle KV-Cache Block Tree */}
        <MerkleTreeVisualizer
          blocks={blocks}
          sessionId={sessionId}
          onBlockEvicted={onRefreshTelemetry}
        />

        {/* Ring 2: Polymorphic Schema Rotator */}
        <SchemaCountdownTimer
          manifest={manifest}
          onRotated={onRefreshTelemetry}
        />

        {/* Ring 1: Optical Camouflage & TLS Timing Shield */}
        <OpticalCanvasPreview
          isCamouflageActive={isCamouflage}
          threatScore={threatScore}
          packetsJittered={packetsJittered}
          perturbedImageBase64={perturbedImageBase64}
          visionProbeResult={visionProbeResult}
          sessionId={sessionId}
        />

        {/* Ring 4: Zero-403 Shadow-State Honeypot Feed */}
        <ShadowTerminal logs={honeypotLogs} />
      </div>
    </div>
  );
};
