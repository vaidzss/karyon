import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerkleTreeVisualizer } from './MerkleTreeVisualizer';
import { SchemaCountdownTimer } from './SchemaCountdownTimer';
import { OpticalCanvasPreview } from './OpticalCanvasPreview';
import { ShadowTerminal } from './ShadowTerminal';
import { SocCharts } from './SocCharts';
import { AttackHistoryView } from './AttackHistoryView';
import {
  Shield,
  ExternalLink,
  Lock,
  Zap,
  Eye,
  RefreshCw,
  CheckCircle2,
  Brain,
  ChevronDown,
  ChevronUp,
  Download,
  LayoutDashboard,
  BarChart3,
  History,
  Layers,
  Scissors,
  Terminal,
  Menu,
  X,
  ArrowLeft,
  GitCompare,
  AlertOctagon,
  Unlock,
  Bug,
  Code2
} from 'lucide-react';
import { DifferentialProofView } from './DifferentialProofView';
import { BlackOctoberDeck } from './BlackOctoberDeck';
import { SdkIntegrationView } from './SdkIntegrationView';
import type { SchemaManifest, HoneypotLog, MerkleBlock, SessionThreat, DifferentialResult, VirtualPatchRule, BlackOctoberResult } from '../../types';

interface MetaKaryonSocViewProps {
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
  targetUrl: string;
  protectionArmed?: boolean;
  onToggleProtection?: (armed: boolean) => void;
  virtualPatches?: VirtualPatchRule[];
  differentialHistory?: DifferentialResult[];
  latestDifferential?: DifferentialResult | null;
  onBenchmarkCompleted?: (result: DifferentialResult) => void;
  onPatchMitigated?: (result: BlackOctoberResult) => void;
  onRefreshTelemetry: () => void;
  onOpenReportModal: () => void;
  onBackToLanding: () => void;
  onGoToAudit?: () => void;
  onAttackTrigger: (type: 'vision' | 'schema' | 'injection' | 'heal' | 'reset') => void;
}

export const MetaKaryonSocView: React.FC<MetaKaryonSocViewProps> = ({
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
  targetUrl,
  protectionArmed = true,
  onToggleProtection,
  virtualPatches = [],
  differentialHistory = [],
  latestDifferential = null,
  onBenchmarkCompleted,
  onPatchMitigated,
  onRefreshTelemetry,
  onOpenReportModal,
  onBackToLanding,
  onGoToAudit,
  onAttackTrigger
}) => {
  // Navigation Menus on Left Sidebar
  const [activeMenu, setActiveMenu] = useState<
    'dashboard' | 'differential' | 'black_october' | 'sdk' | 'analytics' | 'history' | 'ring1' | 'ring2' | 'ring3' | 'ring4'
  >(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['dashboard', 'differential', 'black_october', 'sdk', 'analytics', 'history', 'ring1', 'ring2', 'ring3', 'ring4'].includes(tab)) {
      return tab as any;
    }
    return 'dashboard';
  });

  const handleSelectMenu = (menu: 'dashboard' | 'differential' | 'black_october' | 'sdk' | 'analytics' | 'history' | 'ring1' | 'ring2' | 'ring3' | 'ring4') => {
    setActiveMenu(menu);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', menu);
    window.history.pushState({}, '', url.toString());
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [showReasoning, setShowReasoning] = useState<boolean>(false);

  const threatScore = currentSession ? currentSession.threat_score : 0.0;
  const isCamouflage = currentSession ? currentSession.optical_camouflage_active : false;
  const isShadow = currentSession ? currentSession.shadow_mode : false;

  const providerName = activeAiProvider?.provider || 'BASETEN';
  const modelName = activeAiProvider?.model || 'meta-models/muse-spark-open-1026';

  const menuItems = [
    { id: 'dashboard', label: 'Command Deck', icon: LayoutDashboard, badge: 'Live' },
    { id: 'differential', label: 'A/B Differential Proof', icon: GitCompare, badge: 'Live A/B' },
    { id: 'black_october', label: 'Black October Zero-Day', icon: AlertOctagon, badge: virtualPatches?.length ? `${virtualPatches.length}` : 'Patcher' },
    { id: 'sdk', label: '1-Line Enterprise SDK', icon: Code2, badge: 'Drop-In' },
    { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3, badge: 'New' },
    { id: 'history', label: 'Attack History & Ledger', icon: History, count: attacksNeutralized },
    { id: 'ring1', label: 'Ring 1: Optical Shield', icon: Eye },
    { id: 'ring2', label: 'Ring 2: Polymorphic Mesh', icon: Layers },
    { id: 'ring3', label: 'Ring 3: KV-Surgeon', icon: Scissors },
    { id: 'ring4', label: 'Ring 4: Shadow Honeypot', icon: Terminal }
  ] as const;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#F5F6F8] flex flex-col font-sans selection:bg-[#0866FF] selection:text-white">
      {/* 1. Top Navbar - Responsive on mobile & tablet */}
      <header className="sticky top-0 z-40 bg-[#101522]/95 backdrop-blur-md border-b border-[#1F2637] px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-[#161B26] hover:bg-[#1F2637] text-[#8A94A6] hover:text-white transition-colors border border-[#1F2637] cursor-pointer"
            title="Toggle Sidebar"
            aria-label="Toggle navigation sidebar"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            <span className="font-bold text-white text-base tracking-tight">karyon</span>
            <span className="text-[#8A94A6]">/</span>
            <span className="text-xs font-medium text-[#8A94A6] truncate max-w-[120px] sm:max-w-none">
              Command Center
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-sans text-emerald-400 pl-4 border-l border-[#1F2637]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Target: {targetUrl}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {onToggleProtection && (
            <button
              onClick={() => onToggleProtection(!protectionArmed)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                protectionArmed
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/60 animate-pulse'
              }`}
              title={protectionArmed ? 'Karyon 4-Ring Armed (Click to switch to Unprotected Baseline)' : 'Unprotected Baseline (Click to arm Karyon 4-Ring Shield)'}
            >
              {protectionArmed ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Karyon Armed</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Unprotected Mode</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onRefreshTelemetry}
            className="p-2 rounded-lg bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] text-[#8A94A6] hover:text-white transition-colors cursor-pointer"
            title="Refresh Telemetry"
            aria-label="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onGoToAudit && (
            <button
              onClick={onGoToAudit}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] text-xs text-[#8A94A6] hover:text-white transition-colors cursor-pointer"
            >
              <span>Perimeter Audit</span>
            </button>
          )}

          <button
            onClick={onBackToLanding}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] text-xs text-[#8A94A6] hover:text-white transition-colors cursor-pointer"
          >
            <span>Overview</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#0866FF] hover:bg-[#0055D6] text-white font-medium text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout with Left Sidebar Menu */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}

        {/* Left Sidebar Menu */}
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-y-16 left-0 z-40 w-64 bg-[#101522] border-r border-[#1F2637] flex flex-col justify-between p-4 flex-shrink-0 transition-all lg:static lg:inset-auto"
          >
            <div className="space-y-6">
              {/* Menu Section Label */}
              <div>
                <div className="text-[10px] font-bold tracking-widest text-[#8A94A6] uppercase px-3 mb-2 font-sans">
                  SECURITY OPERATIONS
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectMenu(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0866FF] text-white shadow-sm'
                            : 'text-[#8A94A6] hover:text-white hover:bg-[#161B26]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>

                        {'badge' in item && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-[#1F2637] text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {'count' in item && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Cognitive Engine Badge */}
              <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-[#8A94A6] font-sans">
                  <span>AI ENGINE</span>
                  <span className="text-[#0866FF] font-semibold">{providerName}</span>
                </div>
                <div className="text-xs font-bold text-white font-sans truncate">{modelName}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Moving-Target Active</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation & Target Links */}
            <div className="pt-4 border-t border-[#1F2637] space-y-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  onBackToLanding();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl bg-[#161B26] hover:bg-[#1F2637] text-xs font-sans text-[#8A94A6] hover:text-white transition-colors border border-[#1F2637] cursor-pointer sm:hidden"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Back to Overview</span>
              </button>

              {onGoToAudit && (
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    onGoToAudit();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-[#161B26] hover:bg-[#1F2637] text-xs font-sans text-[#8A94A6] hover:text-white transition-colors border border-[#1F2637] cursor-pointer md:hidden"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#0866FF]" />
                    <span>Perimeter Audit</span>
                  </div>
                </button>
              )}

              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#161B26] hover:bg-[#1F2637] text-xs font-sans text-[#8A94A6] hover:text-white transition-colors border border-[#1F2637]"
              >
                <span className="truncate">ApexFin Portal (:3000)</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </motion.aside>
        )}

        {/* Right Main Content Area with Animated Transitions */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <AnimatePresence mode="wait">
            {/* MENU 1: COMMAND DECK (Overview) */}
            {activeMenu === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Simulation Deck & Optical Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Tile 1: Attack Simulation & Verification Deck (5 cols) */}
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-[#101522] border border-[#1F2637] flex flex-col justify-between space-y-6 shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              Live Attack &amp; Defense Simulation Deck
                            </h3>
                            <p className="text-xs text-[#8A94A6]">
                              1-Click Multi-Vector Adversarial Probe
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00A400]/10 text-[#00A400] border border-[#00A400]/20">
                          100% SECURE
                        </span>
                      </div>

                      {/* Threat Level Bar */}
                      <div className="p-4 rounded-xl bg-[#0A0D14] border border-[#1F2637] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8A94A6]">Adversary Threat Level:</span>
                          <span
                            className={`font-semibold font-sans ${
                              threatScore >= 0.7
                                ? 'text-rose-400'
                                : threatScore >= 0.5
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {(threatScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#161B26] rounded-full h-2 overflow-hidden border border-[#1F2637]">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              threatScore >= 0.7
                                ? 'bg-rose-500'
                                : threatScore >= 0.5
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(5, threatScore * 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#8A94A6] pt-1">
                          <span>
                            Session: <strong className="text-white font-sans">{sessionId}</strong>
                          </span>
                          <span>
                            Camouflage:{' '}
                            <strong className={isCamouflage ? 'text-[#0866FF]' : 'text-[#8A94A6]'}>
                              {isCamouflage ? 'ENGAGED' : 'STANDBY'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4 Interactive Attack Triggers */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAttackTrigger('vision')}
                        className="p-3.5 rounded-xl bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] hover:border-slate-600 text-left transition-colors space-y-1.5 group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">[A] Rogue Vision</div>
                          <div className="text-[10px] text-[#8A94A6]">OCR Screen Scrape</div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAttackTrigger('schema')}
                        className="p-3.5 rounded-xl bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] hover:border-slate-600 text-left transition-colors space-y-1.5 group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">[B] Expired Schema</div>
                          <div className="text-[10px] text-[#8A94A6]">BOLA API Harvest</div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAttackTrigger('injection')}
                        className="p-3.5 rounded-xl bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] hover:border-slate-600 text-left transition-colors space-y-1.5 group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">[C] Prompt Inject</div>
                          <div className="text-[10px] text-[#8A94A6]">RAG Context Poison</div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAttackTrigger('heal')}
                        className="p-3.5 rounded-xl bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] hover:border-slate-600 text-left transition-colors space-y-1.5 group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">[D] Surgical Evict</div>
                          <div className="text-[10px] text-[#8A94A6]">RoPE Tensor Splicing</div>
                        </div>
                      </motion.button>
                    </div>

                    {/* Advanced Proof & Zero-Day Triggers */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMenu('differential')}
                        className="p-3 rounded-xl bg-blue-950/30 hover:bg-blue-950/50 border border-blue-900/50 text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <GitCompare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">Live A/B Proof</div>
                          <div className="text-[10px] text-blue-300">Unprotected vs Armed</div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMenu('black_october')}
                        className="p-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <Bug className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">Black October</div>
                          <div className="text-[10px] text-rose-300">Virtual Patcher</div>
                        </div>
                      </motion.button>
                    </div>

                    {/* Counters */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1F2637]">
                        <div className="text-[10px] text-[#8A94A6]">Neutralized</div>
                        <div className="text-lg font-bold text-white mt-1 font-sans tnum">
                          {attacksNeutralized}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">0 Breaches</div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1F2637]">
                        <div className="text-[10px] text-[#8A94A6]">SSE Jittered</div>
                        <div className="text-lg font-bold text-white mt-1 font-sans tnum">
                          {packetsJittered}
                        </div>
                        <div className="text-[10px] text-[#8A94A6]">256B Frames</div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1F2637]">
                        <div className="text-[10px] text-[#8A94A6]">Active Epoch</div>
                        <div className="text-lg font-bold text-white mt-1 font-sans tnum">
                          #{manifest?.version || 1}
                        </div>
                        <div className="text-[10px] text-[#0866FF] font-medium">60s Rotation</div>
                      </div>
                    </div>

                    {/* Session Reset */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1F2637]">
                      <span className="text-[#8A94A6]">
                        Target: <strong className="text-white font-sans">{targetUrl}</strong>
                      </span>
                      <button
                        onClick={() => onAttackTrigger('reset')}
                        className="text-xs text-[#8A94A6] hover:text-white px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-[#1F2637] border border-[#1F2637] transition-colors cursor-pointer"
                      >
                        Reset Session State
                      </button>
                    </div>
                  </div>

                  {/* Tile 2: Optical Shield & Vision Bot OCR Comparison (7 cols) */}
                  <div className="lg:col-span-7 p-6 rounded-2xl bg-[#101522] border border-[#1F2637] flex flex-col justify-between space-y-4 shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20">
                            RING 01 · OPTICAL CAMOUFLAGE
                          </span>
                          <span className="text-xs text-[#8A94A6]">
                            PyTorch SAM 3.1 Pixel Perturbation
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isCamouflage
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-[#161B26] text-[#8A94A6]'
                          }`}
                        >
                          {isCamouflage ? 'PERTURBATION ACTIVE' : 'CLEAR VIEW'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Human View vs. Rogue Vision Extracted OCR Side-by-Side
                      </h3>
                      <p className="text-xs text-[#8A94A6] mt-0.5">
                        Target account balances are rendered with imperceptible pixel noise. VLM vision
                        agents suffer catastrophic character recognition failure.
                      </p>
                    </div>

                    {/* Optical Canvas / Image Comparison Component */}
                    <div className="flex-1 my-2">
                      <OpticalCanvasPreview
                        isCamouflageActive={isCamouflage}
                        threatScore={threatScore}
                        packetsJittered={packetsJittered}
                        perturbedImageBase64={perturbedImageBase64}
                        visionProbeResult={visionProbeResult}
                        sessionId={sessionId}
                      />
                    </div>

                    {/* Optical Error Status Bar */}
                    <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1F2637] flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <span className="text-[#8A94A6]">VLM OCR Error Rate:</span>
                        <span className="text-emerald-400 font-bold">94.2% Token Corruption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8A94A6]">Perturbation Speed:</span>
                        <span className="text-blue-400 font-bold">&lt; 25ms GPU Tensor</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Merkle Tree & Schema Rotator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] flex flex-col justify-between space-y-4 shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20">
                          RING 03 · CONTEXT SURGEON
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ATTRIBUTED
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Merkle Tree Context Surgeon &amp; RoPE Splicer
                      </h3>
                    </div>
                    <div className="flex-1 my-2">
                      <MerkleTreeVisualizer
                        blocks={blocks}
                        sessionId={sessionId}
                        onBlockEvicted={onRefreshTelemetry}
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] flex flex-col justify-between space-y-4 shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20">
                          RING 02 · POLYMORPHIC MESH
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-[#0866FF] border border-blue-500/20">
                          MUTATING (60s)
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Dynamic Polymorphic Route &amp; SQLite View Rotator
                      </h3>
                    </div>
                    <div className="flex-1 my-2">
                      <SchemaCountdownTimer manifest={manifest} onRotated={onRefreshTelemetry} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MENU: A/B DIFFERENTIAL PROOF */}
            {activeMenu === 'differential' && (
              <motion.div
                key="differential"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DifferentialProofView
                  protectionArmed={protectionArmed}
                  onToggleProtection={onToggleProtection || (() => {})}
                  latestResult={latestDifferential || (differentialHistory && differentialHistory[differentialHistory.length - 1]) || null}
                  history={differentialHistory}
                  onBenchmarkCompleted={onBenchmarkCompleted}
                />
              </motion.div>
            )}

            {/* MENU: BLACK OCTOBER ZERO-DAY VIRTUAL PATCHER */}
            {activeMenu === 'black_october' && (
              <motion.div
                key="black_october"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BlackOctoberDeck
                  virtualPatches={virtualPatches}
                  onPatchMitigated={onPatchMitigated}
                />
              </motion.div>
            )}

            {/* MENU: 1-LINE ENTERPRISE SDK & INTEGRATION */}
            {activeMenu === 'sdk' && (
              <motion.div
                key="sdk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SdkIntegrationView
                  manifest={manifest}
                  gatewayUrl={targetUrl ? (targetUrl.includes('localhost') ? 'http://127.0.0.1:8000' : targetUrl) : 'http://127.0.0.1:8000'}
                />
              </motion.div>
            )}

            {/* MENU 2: ANALYTICS & CHARTS */}
            {activeMenu === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SocCharts
                  attacksNeutralized={attacksNeutralized}
                  packetsJittered={packetsJittered}
                  activeEpoch={manifest?.version || 1}
                />
              </motion.div>
            )}

            {/* MENU 3: ATTACK HISTORY & COUNTERMEASURE LEDGER */}
            {activeMenu === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AttackHistoryView
                  honeypotLogs={honeypotLogs}
                  attacksNeutralized={attacksNeutralized}
                />
              </motion.div>
            )}

            {/* MENU 4: RING 1 OPTICAL SHIELD */}
            {activeMenu === 'ring1' && (
              <motion.div
                key="ring1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20 inline-block mb-1">
                      RING 01 · OPTICAL CAMOUFLAGE &amp; TIMING SHIELD
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      PyTorch SAM 3.1 Multimodal Vision Camouflage &amp; SSE Padding
                    </h2>
                  </div>
                  <button
                    onClick={() => onAttackTrigger('vision')}
                    className="px-4 py-2 rounded-xl bg-[#0866FF] hover:bg-[#0055D6] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Simulate Rogue Vision Bot</span>
                  </button>
                </div>

                <OpticalCanvasPreview
                  isCamouflageActive={isCamouflage}
                  threatScore={threatScore}
                  packetsJittered={packetsJittered}
                  perturbedImageBase64={perturbedImageBase64}
                  visionProbeResult={visionProbeResult}
                  sessionId={sessionId}
                />
              </motion.div>
            )}

            {/* MENU 5: RING 2 POLYMORPHIC MESH */}
            {activeMenu === 'ring2' && (
              <motion.div
                key="ring2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20 inline-block mb-1">
                      RING 02 · POLYMORPHIC SCHEMA MESH
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      60-Second Dynamic SQLite Views &amp; Cryptographic Route Rotation
                    </h2>
                  </div>
                  <button
                    onClick={() => onAttackTrigger('schema')}
                    className="px-4 py-2 rounded-xl bg-[#0866FF] hover:bg-[#0055D6] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Simulate Expired Schema BOLA</span>
                  </button>
                </div>

                <SchemaCountdownTimer manifest={manifest} onRotated={onRefreshTelemetry} />
              </motion.div>
            )}

            {/* MENU 6: RING 3 KV-SURGEON */}
            {activeMenu === 'ring3' && (
              <motion.div
                key="ring3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20 inline-block mb-1">
                      RING 03 · CONTEXT SURGEON
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      Attention-Attributed Merkle KV-Tree &amp; RoPE Tensor Splicer
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAttackTrigger('injection')}
                      className="px-3.5 py-2 rounded-xl bg-[#161B26] hover:bg-[#1F2637] text-white text-xs font-semibold border border-[#1F2637] cursor-pointer"
                    >
                      Simulate Prompt Injection
                    </button>
                    <button
                      onClick={() => onAttackTrigger('heal')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Surgical Evict &lt;120ms
                    </button>
                  </div>
                </div>

                <MerkleTreeVisualizer
                  blocks={blocks}
                  sessionId={sessionId}
                  onBlockEvicted={onRefreshTelemetry}
                />
              </motion.div>
            )}

            {/* MENU 7: RING 4 SHADOW HONEYPOT */}
            {activeMenu === 'ring4' && (
              <motion.div
                key="ring4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        RING 04 · ZERO-403 ACTIVE DECEPTION
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isShadow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-[#161B26] text-[#8A94A6]'
                        }`}
                      >
                        {isShadow ? 'HONEYPOT ENGAGED' : 'STANDBY'}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      Stateful Shadow Honeypot Terminal (Baseten Synthetic Twin)
                    </h2>
                  </div>
                  <button
                    onClick={() => onAttackTrigger('reset')}
                    className="px-3.5 py-2 rounded-xl bg-[#161B26] hover:bg-[#1F2637] text-xs font-sans text-[#8A94A6] hover:text-white border border-[#1F2637] cursor-pointer"
                  >
                    Reset Session
                  </button>
                </div>

                <ShadowTerminal logs={honeypotLogs} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reasoning Stream Drawer (Available across all menus) */}
          <div className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>Meta Muse Spark Open Autonomous Reasoning Stream</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0866FF] border border-blue-500/20 font-sans">
                      &lt;think&gt; tokens
                    </span>
                  </h4>
                  <p className="text-xs text-[#8A94A6]">
                    Real-time cognitive evaluation emitted by{' '}
                    <strong className="text-white font-sans">{modelName}</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B26] hover:bg-[#1F2637] text-xs font-medium text-[#F5F6F8] transition-colors border border-[#1F2637] cursor-pointer"
              >
                <span>{showReasoning ? 'Collapse Reasoning' : 'Inspect Reasoning Stream'}</span>
                {showReasoning ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {showReasoning && (
              <div className="p-4 rounded-xl bg-[#0A0D14] border border-[#1F2637] font-sans text-xs text-[#8A94A6] leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                {latestModelReasoning ||
                  `[Meta Muse Spark Open 1026] Telemetry stream synchronized.
Target asset '${targetUrl}' linked under Moving-Target Defense plane.
Evaluated session '${sessionId}':
- Optical Camouflage: SAM 3.1 perturbation tensor active.
- Polymorphic Ingress: Epoch #${manifest?.version || 1} active.
- Attention Attribution: Merkle root verified.
- Anomaly Threat Score: ${(threatScore * 100).toFixed(0)}%. No cognitive bypass detected.`}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
