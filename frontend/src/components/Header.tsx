import React, { useState } from 'react';
import {
  Shield,
  ExternalLink,
  Brain,
  X,
  Copy,
  Check,
  Zap,
  Lock,
  Activity,
  FileCheck2
} from 'lucide-react';
import type { SessionThreat } from '../types';

interface HeaderProps {
  currentSession: SessionThreat | undefined;
  attacksNeutralized: number;
  packetsJittered: number;
  activeAiProvider?: {
    provider: string;
    model: string;
    base_url: string;
    reasoning_supported: boolean;
    vision_supported: boolean;
  } | null;
  latestModelReasoning?: string | null;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  attacksNeutralized,
  packetsJittered,
  activeAiProvider,
  latestModelReasoning,
  onOpenReportModal
}) => {
  const [showReasoningModal, setShowReasoningModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const copyReasoning = () => {
    if (latestModelReasoning) {
      navigator.clipboard.writeText(latestModelReasoning);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const providerName = activeAiProvider?.provider || 'BASETEN';
  const modelName = activeAiProvider?.model || 'meta-models/muse-spark-open-1026';

  return (
    <>
      <header className="border-b border-slate-800 bg-[#070b14]/95 backdrop-blur-md px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-lg shadow-black/50">
        {/* Brand Identity & System Badge */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans flex items-center gap-2">
                KARYON <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">CYBER SOC</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous Moving-Target AI Defense & Context Firewall
            </p>
          </div>
        </div>

        {/* Clear Target Ingress Indicator */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Target Protected:</span>
            <span className="text-emerald-400 font-semibold">ApexFin Treasury (:3000)</span>
          </div>
          <span className="text-slate-700">|</span>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 font-sans transition"
          >
            Launch Target Bank
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Defense Counters, Live Model Badge, & Executive Report Generator Button */}
        <div className="flex items-center space-x-3">
          {/* Active Model Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <div className="font-sans text-slate-300 flex items-center gap-1.5">
              <span className="text-cyan-400 font-semibold">{providerName}:</span>
              <span className="text-slate-400 text-[11px]">{modelName}</span>
            </div>
            {latestModelReasoning && (
              <button
                onClick={() => setShowReasoningModal(true)}
                className="ml-1 text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 flex items-center gap-1 transition"
                title="View live model chain-of-thought"
              >
                <Brain className="w-3 h-3" />
                <span>Reasoning</span>
              </button>
            )}
          </div>

          {/* Attacks Neutralized */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-sans">
            <span className="text-slate-400">Neutralized:</span>
            <span className="font-bold text-cyan-400">{attacksNeutralized}</span>
          </div>

          {/* Packets Jittered */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-sans">
            <span className="text-slate-400">Jittered:</span>
            <span className="font-bold text-purple-400">{packetsJittered}</span>
          </div>

          {/* Executive Defense Report Generator Button */}
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Generate Defense Report</span>
          </button>
        </div>
      </header>

      {/* Live Model Reasoning Drawer / Modal */}
      {showReasoningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#070b14] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Brain className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                  Meta Muse Spark Live CoT Reasoning Stream
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyReasoning}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => setShowReasoningModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500 selection:text-black">
              {latestModelReasoning || 'No active reasoning tokens recorded yet.'}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-2.5 bg-[#070b14] border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                meta-models/muse-spark-open-1026
              </span>
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3 h-3" />
                  Reasoning Preserved
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Lock className="w-3 h-3" />
                  SQLite Cached
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
