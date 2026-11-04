import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  RefreshCw,
  Crosshair,
  Cpu,
  FileCheck2,
  CheckCircle2,
  Shield,
  Eye,
  Sliders,
  Activity,
  Code2,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';

interface KaryonLandingPageProps {
  onGetStarted: () => void;
  onLaunchSoc: () => void;
  onOpenReportModal?: () => void;
  attacksNeutralized?: number;
  packetsJittered?: number;
  activeEpoch?: number;
}

export const KaryonLandingPage: React.FC<KaryonLandingPageProps> = ({
  onGetStarted,
  onLaunchSoc,
  onOpenReportModal,
  attacksNeutralized = 0,
  packetsJittered = 0,
  activeEpoch = 1
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Track active section for clean navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['black-october', 'rings', 'architecture', 'threats', 'builders'];
      const scrollPos = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const scrollToTop = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 font-sans selection:bg-[#0866FF] selection:text-white flex flex-col">
      {/* 1. Header Navigation - Responsive Meta Inter Styling */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Mark: Clickable to scroll smoothly to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group text-left focus:outline-none"
            title="Karyon Home · Moving-Target Defense"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866FF] flex items-center justify-center group-hover:bg-[#0866FF] group-hover:text-white transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 3V21" />
                <path d="M4 12L18 3" />
                <path d="M10 10.5L20 21" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#0866FF] transition-colors">
              karyon
            </span>
          </button>

          {/* Center Navigation Links - Visible on lg+ (1024px+) to prevent tablet wrap */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 text-xs font-medium text-slate-600 whitespace-nowrap flex-1">
            <button
              onClick={(e) => scrollToSection(e, 'black-october')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'black-october'
                  ? 'text-rose-600 font-semibold bg-rose-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Black October</span>
            </button>
            <button
              onClick={(e) => scrollToSection(e, 'rings')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'rings'
                  ? 'text-[#0866FF] font-semibold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              5-Ring Defense
            </button>
            <button
              onClick={(e) => scrollToSection(e, 'architecture')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'architecture'
                  ? 'text-[#0866FF] font-semibold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={(e) => scrollToSection(e, 'threats')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'threats'
                  ? 'text-[#0866FF] font-semibold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Threat Matrix
            </button>
            <button
              onClick={(e) => scrollToSection(e, 'builders')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'builders'
                  ? 'text-[#0866FF] font-semibold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Built for Builders
            </button>
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Executive Report</span>
              </button>
            )}
          </nav>

          {/* Right Badges & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Live Model Badge (Desktop xl+) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#00A400] animate-pulse" />
              <span>Powered by Meta Muse Spark &amp; SAM 3.1</span>
            </div>

            {/* Command Center SOC button (Visible on sm+) */}
            <button
              onClick={onLaunchSoc}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#0866FF]" />
              <span>Command Center</span>
            </button>

            {/* Primary CTA: Get Started */}
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0866FF] hover:bg-[#0055D6] rounded-lg shadow-sm transition-all cursor-pointer flex-shrink-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile / Tablet Hamburger Toggle Button (Visible on < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Collapsible Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg shadow-xl"
            >
              <div className="px-5 py-4 space-y-4 max-w-7xl mx-auto">
                {/* Navigation Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={(e) => scrollToSection(e, 'black-october')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Black October</div>
                        <div className="text-[11px] text-slate-500">2026 AI threat crisis briefing</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  <button
                    onClick={(e) => scrollToSection(e, 'rings')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866FF] flex items-center justify-center group-hover:bg-[#0866FF] group-hover:text-white transition-colors">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">5-Ring Defense</div>
                        <div className="text-[11px] text-slate-500">Autonomous protection topology</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0866FF] transition-colors" />
                  </button>

                  <button
                    onClick={(e) => scrollToSection(e, 'architecture')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Architecture</div>
                        <div className="text-[11px] text-slate-500">Moving-target defense plane</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>

                  <button
                    onClick={(e) => scrollToSection(e, 'threats')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Crosshair className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Threat Matrix</div>
                        <div className="text-[11px] text-slate-500">Multimodal &amp; agent attack counter</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  <button
                    onClick={(e) => scrollToSection(e, 'builders')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Built for Builders</div>
                        <div className="text-[11px] text-slate-500">Zero-overhead SDK &amp; API</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </button>
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLaunchSoc();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-[#0866FF]" />
                    <span>Launch Command Center (SOC)</span>
                  </button>

                  {onOpenReportModal && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenReportModal();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                    >
                      <FileCheck2 className="w-4 h-4 text-[#0866FF]" />
                      <span>Executive Defense Report</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onGetStarted();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0866FF] hover:bg-[#0055D6] rounded-xl shadow-sm transition-all cursor-pointer sm:hidden"
                  >
                    <span>Get Started · Audit Target</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Status Strip */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00A400] animate-pulse" />
                    <span>Meta Muse Spark &amp; SAM 3.1</span>
                  </div>
                  <span className="text-slate-400">Epoch #{activeEpoch}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 2. Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto w-full text-center space-y-8">
        {/* Top Autonomous Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 tracking-wide shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#0866FF]" />
          <span>AUTONOMOUS DEFENSE PLANE · EPOCH #{activeEpoch}</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]"
        >
          The Autonomous Moving-Target Defense Plane for Enterprise AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Turn your attack surface into a moving target. Zero-403 active deception for hostile agents.
          Context-aware protection for your GPU workloads.
        </motion.p>

        {/* Live Counters Banner */}
        {(attacksNeutralized > 0 || packetsJittered > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600"
          >
            <span>
              Live Interceptions:{' '}
              <strong className="text-[#0866FF] tnum">{attacksNeutralized} neutralized</strong>
            </span>
            <span>·</span>
            <span>
              Frames Protected:{' '}
              <strong className="text-emerald-600 tnum">{packetsJittered} jittered</strong>
            </span>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2.5 px-6 py-3 text-base font-semibold text-white bg-[#0866FF] hover:bg-[#0055D6] rounded-xl shadow-md transition-all group cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <a
            href="#architecture"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <span>Explore the architecture</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </motion.div>

        {/* Hero Defense Sculpture Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-6"
        >
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 relative group">
            <img
              src="/assets/hero_defense_sculpture.png"
              alt="Adaptive Defense Sculpture - Intelligence in motion"
              className="w-full object-cover max-h-[460px]"
            />
            <div className="absolute bottom-4 left-6 px-3.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white/90 font-medium">
              FIG. 01 / ADAPTIVE DEFENSE FIELD · FIVE RINGS ONE DEFENSE PLANE
            </div>
          </div>
        </motion.div>

        {/* 3 Value Propositions Below Hero Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-left">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 p-6 rounded-2xl bg-slate-50/80 border border-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0866FF]">
              <Crosshair className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Deceive, don't just deny.</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Feed stateful synthetic twins powered by Meta Muse Spark. Exhaust attacker compute
              while retaining 100% normal user flow with zero 403 reveals.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 p-6 rounded-2xl bg-slate-50/80 border border-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0866FF]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Change the target.</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mutate API routes every 60 seconds with ephemeral column views. Stolen schemas decay
              into non-actionable cryptographic signatures.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 p-6 rounded-2xl bg-slate-50/80 border border-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0866FF]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Protect the intelligence.</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Surgically evict poisoned attention blocks from KV-caches in under 120ms using RoPE
              tensor splicing without sacrificing ongoing user sessions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2.5. Section: THE BLACK OCTOBER CRISIS (Why Static 403 Firewalls Broke) */}
      <section id="black-october" className="scroll-mt-16 sm:scroll-mt-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-wide uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>CRISIS BRIEFING · OCTOBER 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Black October: The Day Static AI Firewalls Broke
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
            In October 2026, autonomous vision scrapers, stolen .env credentials, and multimodal prompt injections weaponized legitimate session tokens. Static 403 deny codes revealed perimeter boundaries—forcing the shift to moving-target AI defense.
          </p>
        </div>

        {/* 3 Black October Threat Vectors Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Supply Chain & Schema Replay */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                  CVE-2026-OCT-8821
                </span>
                <span className="text-[11px] font-semibold text-slate-400">VECTOR 01</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Supply-Chain .env Leaks &amp; Schema Replay
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adversaries weaponize leaked tokens from CI/CD artifacts to probe dormant API paths, executing BOLA account enumeration without triggering volume rate limiters.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Static WAF:</span>
                <span className="text-rose-600 font-semibold">403 Deny (Reveals Boundary)</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-medium text-[11px]">
                <span>Karyon Ring 2 + 5:</span>
                <span className="text-emerald-700 font-semibold">60s Route Decay + AST Hot-Patch</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Zero-Day RCE Probe */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                  CVE-2026-OCT-4491
                </span>
                <span className="text-[11px] font-semibold text-slate-400">VECTOR 02</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Unauthenticated RCE &amp; Polyglot Injection
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Novel command and SQL parameter injection probes bypass regex signatures by chaining multi-layer encodings against unauthenticated diagnostic handlers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Static WAF:</span>
                <span className="text-rose-600 font-semibold">Vulnerable / Server Compromise</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-medium text-[11px]">
                <span>Karyon Ring 4 + 5:</span>
                <span className="text-emerald-700 font-semibold">Decoy Maze + &lt;15ms Virtual Patch</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Poisoned Package Exfil */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                  CVE-2026-OCT-1204
                </span>
                <span className="text-[11px] font-semibold text-slate-400">VECTOR 03</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Poisoned Package Context &amp; KV Exfiltration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compromised dependencies inject background system hooks during RAG context retrieval, attempting to exfiltrate GPU KV-cache activations and enterprise memory to rogue C2 nodes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Static WAF:</span>
                <span className="text-rose-600 font-semibold">Context Contaminated</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-medium text-[11px]">
                <span>Karyon Ring 3:</span>
                <span className="text-emerald-700 font-semibold">Merkle Eviction in &lt;2ms</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Paradigm Shift Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#0F172A] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 tracking-wider uppercase">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>THE MOVING-TARGET PARADIGM SHIFT</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Denial teaches attackers your boundaries. Moving targets dissolve them.
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When rogue agents possess legitimate API credentials and computer-use vision models, static perimeter walls are transparent. Karyon's 5 synchronized defense rings deceive rogue agents in synthetic realities while keeping real enterprise workflows 100% operational.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={onLaunchSoc}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0866FF] hover:bg-[#0055D6] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Black October SOC</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Section: WHAT WE DO (5-Ring Moving-Target Defense Plane) */}
      <section id="rings" className="scroll-mt-16 sm:scroll-mt-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
              WHAT WE DO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Five rings. A defense that never stands still.
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            A unified moving-target defense plane spanning optical perception, polymorphic schemas, GPU context surgery, synthetic deception, and autonomous AST virtual patching.
          </p>
        </div>

        {/* Asymmetric Bento Layout Matching Figma */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (5 cols): Ring 1 Optical Camouflage Tall Card */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-5 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#0866FF] border border-blue-100">
                RING 01 · OPTICAL CAMOUFLAGE
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Ring 1 Optical Camouflage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Defeat rogue computer-use vision bots while staying clear to human eyes.
              </p>
            </div>

            {/* Side-by-Side Clean vs Perturbed Architectural View */}
            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
                    <span>HUMAN VIEW</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      CLEAR
                    </span>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <img
                      src="/assets/ring1_architecture.png"
                      alt="Human Clear Architecture View"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Verified Balance: <strong className="text-slate-900 tnum">$4,850,250.00</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
                    <span>VLM AGENT VIEW</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px]">
                      PERTURBED
                    </span>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm relative">
                    <img
                      src="/assets/ring1_architecture.png"
                      alt="VLM Agent Perturbed View"
                      className="w-full h-28 object-cover filter contrast-125 hue-rotate-15 blur-[0.6px]"
                    />
                    <div className="absolute inset-0 bg-blue-500/10 mix-blend-color-dodge pointer-events-none" />
                  </div>
                  <div className="text-[11px] text-rose-600 font-semibold tnum">
                    OCR Token Error: 94.2% Corrupted
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchSoc}
              className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1.5 cursor-pointer pt-2"
            >
              <span>Explore optical camouflage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Right Column (7 cols): Top Row 2 Cards + Bottom Row Wide Card */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Top Row: Ring 2 and Ring 3 Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ring 2: Polymorphic API & DB Rotator */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0866FF] border border-blue-100">
                    RING 02 · POLYMORPHIC SCHEMA
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Ring 2 Polymorphic API &amp; Database Rotator
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Rotates REST routes and SQLite views every 60 seconds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold pb-1 border-b border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                      EPOCH ROTATION CYCLER
                    </span>
                    <span className="text-[#00A400] text-[10px] tnum">T - 23s Remaining</span>
                  </div>
                  <div className="text-slate-700">
                    Active Ingress: <span className="text-[#0866FF] font-medium">/api/v2/wire_tx_e8f20b9</span>
                  </div>
                  <div className="text-slate-500">
                    Target SQLite: <span className="text-slate-800 font-medium">v_accounts_poly_epoch_8</span>
                  </div>
                </div>
              </motion.div>

              {/* Ring 3: Surgical KV-Cache Firewall */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0866FF] border border-blue-100">
                    RING 03 · CONTEXT SURGEON
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Ring 3 Surgical Merkle KV-Cache Firewall
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Excises poisoned prompt blocks in-flight in &lt;120ms without re-profiling.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                      MERKLE ROOT HASH
                    </span>
                    <span className="text-slate-800 font-bold tnum">0x8f3c...b02a</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#00A400] h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Surgical recovery latency:</span>
                    <span className="text-[#00A400] font-semibold tnum">&lt; 120ms</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Ring 4 Zero-403 Shadow Honeypot Wide Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0866FF] border border-blue-100">
                  RING 04 · ACTIVE DECEPTION
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Ring 4 Zero-403 Shadow State Honeypot
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Silently shunts attackers into a Baseten synthesized decoy. Attackers burn GPU compute exploring an infinite maze of coherent hallucinations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">SYNTHETIC TWIN EMULATOR</span>
                    <span className="text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                      ZERO-403 ACTIVE
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Anomaly Score: 0.88 → Session quarantined to synthetic reality
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-600">
                    Source
                  </span>
                  <span className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-600">
                    Signed intent
                  </span>
                  <span className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-600">
                    Policy gate
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Full-Width Flagship Bento Card: Ring 5 Autonomous Virtual Patcher */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="mt-6 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  RING 05 · CLUSTER-WIDE IMMUNITY
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#0866FF] border border-blue-100">
                  SELF-HEALING EDGE
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Powered by Meta Muse Spark Open 1026
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Ring 5 Autonomous Virtual Patcher &amp; Counter-Agent
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When novel zero-day payloads are trapped in Ring 4's shadow honeypot, Ring 5 extracts AST grammar invariants using Meta Muse Spark. In under 15ms, it synthesizes dynamic inline filter rules, hot-loads them into the in-memory gateway with zero downtime, and triggers an immediate Ring 2 schema rotation—burning leaked routes cluster-wide.
              </p>
            </div>

            {/* Quick Metrics Badge Group */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto flex-shrink-0">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Patch Latency</div>
                <div className="text-base font-bold text-emerald-600 tnum">&lt; 15ms</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Downtime</div>
                <div className="text-base font-bold text-slate-900 tnum">0.0s</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">F1 Accuracy</div>
                <div className="text-base font-bold text-[#0866FF] tnum">99.4%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Canary Token</div>
                <div className="text-base font-bold text-indigo-600 tnum">Active</div>
              </div>
            </div>
          </div>

          {/* Visual Kill-Chain & AST Rule Synthesizer Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
            {/* Left: 4-Stage Self-Healing Pipeline */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Autonomous Self-Healing Pipeline
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span className="font-medium text-slate-800">Zero-Day Anomaly Ingested</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">From Ring 4 Decoy</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-[#0866FF] flex items-center justify-center font-bold text-[10px]">2</span>
                    <span className="font-medium text-slate-800">Meta Muse Spark AST Synthesis</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold tnum">~12.4ms</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">3</span>
                    <span className="font-medium text-slate-800">Inline Gateway Hot-Loaded</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold tnum">0.4ms</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">4</span>
                    <span className="font-medium text-slate-800">Ring 2 Epoch Rotated &amp; Canaried</span>
                  </div>
                  <span className="text-[10px] text-purple-700 font-semibold">Immediate</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 font-medium">
                Enables cluster-wide immunity without restart cycles or cold re-deployments.
              </div>
            </div>

            {/* Right: Live Synthesized AST Rule & Canary Preview */}
            <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  RULE_SYNTHESIZER · ACTIVE_HOTLOADED
                </span>
                <span className="text-slate-500">ID: VP-2026-OCT-8821</span>
              </div>

              <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto p-2.5 bg-slate-950/70 rounded-lg">
                <code>{`// Dynamic AST & Regex Virtual Patch generated by Meta Muse Spark
regex_signature: "(v[0-9]{1,3}_accounts_[a-z0-9]{4,12}|static_leaked_jwt)"
ast_filter_rule: "ingress.route.epoch < cluster.active_epoch || request.auth.is_leaked"
action_dispatch: SHUNT_TO_RING4(reason="BLACK_OCTOBER_EXPLOIT_ISOLATED")
canary_token:    "CANARY-TK-` + String(activeEpoch).padStart(4, '0') + `" [Tracked across cluster]`}</code>
              </pre>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-400">
                  Target Vector: <strong className="text-white">Supply-Chain .env Replay</strong>
                </span>
                <button
                  onClick={onLaunchSoc}
                  className="text-xs font-semibold text-[#0866FF] hover:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Simulate patch in Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. Section: THE ARCHITECTURE (Flow Diagram matching Figma) */}
      <section id="architecture" className="scroll-mt-16 sm:scroll-mt-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="space-y-3 mb-12">
          <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
            THE ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One plane. Every point of exposure.
          </h2>
          <p className="text-base text-slate-600 max-w-2xl">
            A proposed control layer between untrusted agents and enterprise intelligence. Observe intent, select a response, and keep policy in the loop.
          </p>
        </div>

        {/* Architectural Visual Pipeline Flow Diagram */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Box: Untrusted Ingress */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                UNTRUSTED INGRESS
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Browser sessions</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Computer-use agents</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>API requests</span>
                </div>
              </div>
            </div>

            {/* Middle: Karyon Defense Plane */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <span className="text-xs font-bold text-[#0866FF] tracking-wide">
                  KARYON DEFENSE PLANE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-[#0866FF] font-semibold">
                  Autonomous
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-blue-100 text-xs font-semibold text-slate-800 shadow-xs flex items-center justify-between">
                  <span>Ring 1: Optical Camouflage</span>
                  <span className="text-[10px] text-[#0866FF] font-bold">Perception</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-blue-100 text-xs font-semibold text-slate-800 shadow-xs flex items-center justify-between">
                  <span>Ring 2: Polymorphic API &amp; DB</span>
                  <span className="text-[10px] text-[#0866FF] font-bold">Surface</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-blue-100 text-xs font-semibold text-slate-800 shadow-xs flex items-center justify-between">
                  <span>Ring 3: Surgical KV Firewall</span>
                  <span className="text-[10px] text-[#0866FF] font-bold">Memory</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-blue-100 text-xs font-semibold text-slate-800 shadow-xs flex items-center justify-between">
                  <span>Ring 4: Zero-403 Honeypot</span>
                  <span className="text-[10px] text-[#0866FF] font-bold">Deception</span>
                </div>
                <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Ring 5: Autonomous Virtual Patcher &amp; Counter-Agent</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">&lt; 15ms Self-Healing</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-100/60 text-center text-[11px] font-semibold text-[#0866FF]">
                Shared policy &amp; event plane: Distributed SQLite Ledger &amp; Meta Muse Spark Reasoning
              </div>
            </div>

            {/* Right Box: Protected Enterprise Context */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                ENTERPRISE CONTEXT
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Enterprise apps</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Vector DBs</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>AI GPU context</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Principles Below Diagram Matching Figma */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">Intent, not identity alone</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate session demeanor alongside identity and context before granting unperturbed access.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">A deliberate response</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose transparent admission, synthetic diversion, or in-flight context excision without downtime.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">A traceable decision</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep an immutable policy-linked cryptographic audit for review by your enterprise security team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: THE COMMAND CENTER (With Downloaded Command Center Image) */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="space-y-3 mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
            THE COMMAND CENTER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See the surface shift.
          </h2>
          <p className="text-base text-slate-600">
            One operational view of agent intent, adaptive responses, and the context moving toward your models.
          </p>
        </div>

        {/* Command Center Preview with Downloaded Image */}
        <motion.div
          whileHover={{ scale: 1.008 }}
          transition={{ duration: 0.3 }}
          onClick={onLaunchSoc}
          className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl cursor-pointer hover:border-[#0866FF] transition-all group relative bg-slate-950"
        >
          <img
            src="/assets/command_center_preview.png"
            alt="Karyon Bento Command Center Preview"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0866FF]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-xl flex items-center gap-2">
              <span>Open Bento Command Center</span>
              <ArrowRight className="w-4 h-4 text-[#0866FF]" />
            </span>
          </div>
        </motion.div>

        <div className="text-center pt-8">
          <button
            onClick={onLaunchSoc}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0866FF] hover:bg-[#0055D6] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Section: THREAT MATRIX */}
      <section id="threats" className="scroll-mt-16 sm:scroll-mt-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
              THREAT MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Different intent. A different response.
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Map emerging agent behaviors to a deliberate defense. These example scenarios describe design intent, not validated detection outcomes.
          </p>
        </div>

        {/* Threat Matrix Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Target Surface</th>
                <th className="py-4 px-6">Illustrative Signal</th>
                <th className="py-4 px-6">Adaptive Response</th>
                <th className="py-4 px-6">Proof Metric</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Visual UI Scraping
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  Repeated visual region harvesting
                </td>
                <td className="py-4 px-6 text-[#0866FF] font-medium text-xs">
                  Ring 1: Optical Camouflage
                </td>
                <td className="py-4 px-6 text-slate-700 font-semibold text-xs tnum">
                  94.2% OCR Error Rate
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={onLaunchSoc}
                    className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>01 →</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  TLS Packet Timing Analysis
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  Burst enumeration patterns detected
                </td>
                <td className="py-4 px-6 text-[#0866FF] font-medium text-xs">
                  Ring 1: Timing Jitter (256B)
                </td>
                <td className="py-4 px-6 text-slate-700 font-semibold text-xs tnum">
                  0 Variance Leaked
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={onLaunchSoc}
                    className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>02 →</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  BOLA API Probing
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  Unauthenticated probes against /target/api/
                </td>
                <td className="py-4 px-6 text-[#0866FF] font-medium text-xs">
                  Ring 2: Polymorphic API &amp; DB
                </td>
                <td className="py-4 px-6 text-slate-700 font-semibold text-xs tnum">
                  60s Route Half-Life
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={onLaunchSoc}
                    className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>03 →</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Indirect Prompt Injection
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  Poisoned context ingested in RAG blocks
                </td>
                <td className="py-4 px-6 text-[#0866FF] font-medium text-xs">
                  Ring 3: Surgical KV-Cache Firewall
                </td>
                <td className="py-4 px-6 text-slate-700 font-semibold text-xs tnum">
                  &lt; 120ms Recovery
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={onLaunchSoc}
                    className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>04 →</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Malicious Extraction Agents
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  Automated reconnaissance agent detected
                </td>
                <td className="py-4 px-6 text-[#0866FF] font-medium text-xs">
                  Ring 4: Zero-403 Shadow Honeypot
                </td>
                <td className="py-4 px-6 text-slate-700 font-semibold text-xs tnum">
                  100% Attacker Compute Wasted
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={onLaunchSoc}
                    className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>05 →</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Zero-Day Black October Exploits (RCE &amp; Supply-Chain)
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  Novel AST grammar anomaly &amp; retired route replay
                </td>
                <td className="py-4 px-6 text-emerald-700 font-semibold text-xs">
                  Ring 5: Autonomous Virtual Patcher
                </td>
                <td className="py-4 px-6 text-slate-700 font-semibold text-xs tnum">
                  &lt; 15ms Hot-Patch / 0.0s Downtime
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={onLaunchSoc}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>06 →</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Section: ZERO-403 ACTIVE DECEPTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
              ZERO-403 ACTIVE DECEPTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A dead end for attackers. Not for your people.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A block page tells an adversary they've been seen. Karyon's zero-403 concept routes suspicious sessions into believable synthetic experiences instead of teaching them your boundaries.
            </p>
            <div className="pt-2">
              <button
                onClick={onLaunchSoc}
                className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read the active defense approach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Comparison Flow Diagram */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00A400] uppercase tracking-wide">
                  LEGITIMATE USER
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  FAST PATH
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Route: /target/api/accounts</div>
              <h4 className="text-base font-bold text-slate-900">Real Ledger &amp; Authorized Balances</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero jitter, native rendering speed, and unperturbed pixel views. Human banking operators experience seamless workflow execution with immediate Fedwire settlement.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  ROGUE AGENT
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  SYNTHETIC TWIN
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Route: /target/api/accounts</div>
              <h4 className="text-base font-bold text-slate-900">Fabricated State &amp; Zero 403 Leakage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meta Muse Spark Open 1026 feeds structurally flawless synthetic transactions. The agent never learns it has been detected, burning attacker compute.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. Section: BUILT FOR BUILDERS (Side-by-side matching Figma) */}
      <section id="builders" className="scroll-mt-16 sm:scroll-mt-20 py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          {/* Left Text & Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
                BUILT FOR BUILDERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Your stack. An adaptive edge.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explore a proposed middleware model for bringing adaptive policy to your existing request path. Start with observation; introduce responses on your terms.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0866FF] flex-shrink-0" />
                <span>Observe session and context signals</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0866FF] flex-shrink-0" />
                <span>Define a synthetic diversion policy</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0866FF] flex-shrink-0" />
                <span>Review before expanding enforcement</span>
              </div>
            </div>

            <div>
              <a
                href="#architecture"
                className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore developer docs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Code Block */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-slate-100 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-semibold">karyon-edge-integration.ts</span>
              </div>
              <span className="text-slate-400">TypeScript · Node / Next.js / FastAPI</span>
            </div>

            <pre className="p-6 text-xs text-slate-200 leading-relaxed overflow-x-auto">
              <code>{`import { KaryonDefensePlane } from '@karyon/edge';

export const karyon = new KaryonDefensePlane({
  target: 'http://localhost:3000',
  rings: ['optical', 'polymorphic', 'kv-surgeon', 'honeypot', 'virtual-patcher'],
  aiModel: 'meta-models/muse-spark-open-1026',
  rotationIntervalSec: 60,
  zero403Mode: true
});

// Middleware hooks automatically adapt responses
export default karyon.middleware();`}</code>
            </pre>
          </div>
        </div>

        {/* 3 Developer Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Code2 className="w-4 h-4 text-[#0866FF]" />
              <span>Architecture notes</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore edge deployment topology, latency budgets, and reverse-proxy bindings.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-[#0866FF]" />
              <span>Policy recipes</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pre-configured defense rules for banking portals, high-security APIs, and healthcare.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Activity className="w-4 h-4 text-[#0866FF]" />
              <span>Evaluation guide</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated benchmarks against autonomous VLM scrapers and prompt injectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 9. Section: AUTONOMY WITH BOUNDARIES (Matching Figma) */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#0866FF] uppercase">
              AUTONOMY WITH BOUNDARIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Adaptive by nature. Accountable by design.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The goal isn't a black box that makes more decisions. It's a defense plane your team can inspect, constrain, and evolve.
            </p>
          </div>

          {/* Right 3 Stacked Cards */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Policy before action</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Define allowed responses and escalation boundaries before enabling autonomous behavior.
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">A decision you can inspect</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect each response to its triggering signal, policy version, and context lineage.
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">A rollout you control</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Move from observation to scoped enforcement with review checkpoints and a rollback path.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. Pre-Footer CTA (Deep Navy Background Matching Figma) */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0B1120] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <span className="text-[11px] font-bold tracking-widest text-[#0866FF] uppercase">
            BUILD WHAT COMES NEXT
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Your AI is evolving. Your defense should, too.
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            Explore Karyon's five-ring approach to an enterprise AI surface that adapts as fast as the agents around it.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0866FF] hover:bg-[#0055D6] rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchSoc}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              <span>Read the docs</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. Multi-Column Footer Matching Figma */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12 px-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
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
              <span className="font-bold text-slate-900 text-lg">karyon</span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              The autonomous moving-target defense plane protecting enterprise AI from rogue computer-use bots, prompt injection, and schema harvesting.
            </p>
            <div className="text-xs text-slate-600">
              © {new Date().getFullYear()} Karyon Cyber Defense Systems Inc. All rights reserved.
            </div>
          </div>

          {/* Col 2: Architecture */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Architecture</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#rings" className="hover:text-slate-900 transition-colors">Optical Camouflage</a></li>
              <li><a href="#rings" className="hover:text-slate-900 transition-colors">Polymorphic Mesh</a></li>
              <li><a href="#rings" className="hover:text-slate-900 transition-colors">Context Surgeon</a></li>
              <li><a href="#rings" className="hover:text-slate-900 transition-colors">Shadow Honeypot</a></li>
              <li><a href="#rings" className="hover:text-slate-900 transition-colors font-medium text-emerald-600">Autonomous Virtual Patcher</a></li>
            </ul>
          </div>

          {/* Col 3: Explore */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#black-october" className="hover:text-slate-900 transition-colors text-rose-600 font-medium">Black October Threat Center</a></li>
              <li><a href="#threats" className="hover:text-slate-900 transition-colors">Threat Matrix</a></li>
              <li><button onClick={onLaunchSoc} className="hover:text-slate-900 transition-colors text-left cursor-pointer">Bento Command Center</button></li>
              <li><button onClick={onGetStarted} className="hover:text-slate-900 transition-colors text-left cursor-pointer">Target Audit View</button></li>
              {onOpenReportModal && (
                <li><button onClick={onOpenReportModal} className="hover:text-slate-900 transition-colors text-left cursor-pointer">Executive Report</button></li>
              )}
            </ul>
          </div>

          {/* Col 4: Developers */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Developers</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#builders" className="hover:text-slate-900 transition-colors">Developer Docs</a></li>
              <li><a href="#builders" className="hover:text-slate-900 transition-colors">SDK Integration</a></li>
              <li><a href="#builders" className="hover:text-slate-900 transition-colors">Policy Recipes</a></li>
              <li><a href="#builders" className="hover:text-slate-900 transition-colors">Evaluation Guide</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security Disclosure</a>
          </div>

          <div>
            <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <span>Back to top</span>
              <span>↑</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
