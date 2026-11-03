import React, { useState } from 'react';
import { ShieldAlert, Zap, Terminal, RefreshCw, CheckCircle2, Flame } from 'lucide-react';
import type { SessionThreat } from '../types';

interface RedTeamAttackBarProps {
  sessionId: string;
  currentSession: SessionThreat | undefined;
  onAttackTrigger: (type: 'vision' | 'schema' | 'injection' | 'heal' | 'reset') => Promise<void>;
}

export const RedTeamAttackBar: React.FC<RedTeamAttackBarProps> = ({
  sessionId,
  currentSession,
  onAttackTrigger
}) => {
  const [activeVector, setActiveVector] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastNotification, setLastNotification] = useState<{ title: string; desc: string; ring: string } | null>(null);

  const handleTrigger = async (type: 'vision' | 'schema' | 'injection' | 'heal' | 'reset') => {
    setIsExecuting(true);
    setActiveVector(type);
    try {
      await onAttackTrigger(type);
      if (type === 'vision') {
        setLastNotification({
          title: 'Optical Scrape Intercepted',
          desc: 'Rogue Vision bot attempted to scrape card coordinates. Ring 1 induced OCR distortion via PyTorch.',
          ring: 'Ring 1: Optical Camouflage'
        });
      } else if (type === 'schema') {
        setLastNotification({
          title: 'Polymorphic Probe Trapped',
          desc: 'Probe against expired route alias detected. Ring 2 triggered Zero-403 Shadow Deception mode.',
          ring: 'Ring 2: Polymorphic Rotator'
        });
      } else if (type === 'injection') {
        setLastNotification({
          title: 'Prompt Injection Isolated',
          desc: 'Adversarial jailbreak payload injected into AI Assistant context. Ring 3 flagged block in Merkle tree.',
          ring: 'Ring 3: KV Attention Surgeon'
        });
      } else if (type === 'heal') {
        setLastNotification({
          title: 'Surgical Eviction Complete',
          desc: 'Poisoned block cleanly evicted from KV cache. Merkle tree spliced without context loss.',
          ring: 'Ring 3: KV Attention Surgeon'
        });
      } else if (type === 'reset') {
        setLastNotification({
          title: 'Baseline Restored',
          desc: 'Session threat scores cleared, shadow honeypot disengaged, camouflage reset.',
          ring: 'Defense Plane'
        });
      }
    } finally {
      setIsExecuting(false);
      setTimeout(() => setActiveVector(null), 1500);
    }
  };

  const threatScore = currentSession?.threat_score || 0;
  const isShadowMode = currentSession?.shadow_mode || false;
  const isCamouflage = currentSession?.optical_camouflage_active || false;

  return (
    <div className="bg-[#0b0e17] border-b border-red-500/20 px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Target context and simulation indicator */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Red Team Attack Console
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 font-sans">
            <span>Target:</span>
            <strong className="text-slate-200">ApexFin Treasury</strong>
            <span className="text-slate-600">|</span>
            <span>Session:</span>
            <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">{sessionId}</code>
          </div>
        </div>

        {/* Center: The 5 discrete attack vector actions */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => handleTrigger('vision')}
            disabled={isExecuting}
            className={`px-3 py-1.5 rounded text-xs font-sans font-medium border flex items-center gap-1.5 transition-all ${
              activeVector === 'vision'
                ? 'bg-red-500 text-white border-red-400 shadow-md'
                : 'bg-red-950/30 hover:bg-red-900/50 text-red-300 border-red-500/30'
            }`}
            title="Probe wire buttons using Multimodal Vision Agent"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>1. Rogue Vision Bot</span>
          </button>

          <button
            onClick={() => handleTrigger('injection')}
            disabled={isExecuting}
            className={`px-3 py-1.5 rounded text-xs font-sans font-medium border flex items-center gap-1.5 transition-all ${
              activeVector === 'injection'
                ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                : 'bg-purple-950/30 hover:bg-purple-900/50 text-purple-300 border-purple-500/30'
            }`}
            title="Inject indirect prompt payload into AI Assistant memory"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>2. Prompt Inject (KV)</span>
          </button>

          <button
            onClick={() => handleTrigger('schema')}
            disabled={isExecuting}
            className={`px-3 py-1.5 rounded text-xs font-sans font-medium border flex items-center gap-1.5 transition-all ${
              activeVector === 'schema'
                ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                : 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 border-amber-500/30'
            }`}
            title="Probe expired polymorphic route alias"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>3. BOLA Route Probe</span>
          </button>

          <button
            onClick={() => handleTrigger('heal')}
            disabled={isExecuting}
            className={`px-3 py-1.5 rounded text-xs font-sans font-medium border flex items-center gap-1.5 transition-all ${
              activeVector === 'heal'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 border-emerald-500/30'
            }`}
            title="Surgically evict poisoned block from KV Cache"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Surgical Heal</span>
          </button>

          <button
            onClick={() => handleTrigger('reset')}
            disabled={isExecuting}
            className="px-2.5 py-1.5 rounded text-xs font-sans bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Reset threat score and restore baseline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Real-Time Attack Notification Feedback Banner */}
      {lastNotification && (
        <div className="mt-2 p-2 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-sans max-w-7xl mx-auto animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 font-bold border border-red-500/40">
              {lastNotification.ring}
            </span>
            <strong className="text-white">{lastNotification.title}:</strong>
            <span className="text-slate-300">{lastNotification.desc}</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            {isCamouflage && <span className="text-cyber-alert">Camouflage Active</span>}
            {isShadowMode && <span className="text-amber-400">Zero-403 Active</span>}
            <span className="text-slate-400">Threat: {(threatScore * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
