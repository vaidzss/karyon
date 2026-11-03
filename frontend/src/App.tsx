import React, { useState, useEffect, useCallback } from 'react';
import { KaryonLandingPage } from './components/KaryonLandingPage';
import { TargetAuditView } from './components/telemetry/TargetAuditView';
import { MetaKaryonSocView } from './components/telemetry/MetaKaryonSocView';
import { ExecutiveReportModal } from './components/telemetry/ExecutiveReportModal';
import type { SchemaManifest, HoneypotLog, MerkleBlock, SessionThreat, VirtualPatchRule, DifferentialResult } from './types';
import { KaryonService } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'audit' | 'soc'>(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'audit' || v === 'soc') return v;
    return 'landing';
  });

  const handleSetView = (view: 'landing' | 'audit' | 'soc') => {
    setCurrentView(view);
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    window.history.pushState({}, '', url.toString());
  };
  const [targetUrl, setTargetUrl] = useState<string>('http://localhost:3000');
  const [sessionId] = useState<string>('attacker_session_01');

  // Telemetry & Ring State
  const [manifest, setManifest] = useState<SchemaManifest | null>(null);
  const [honeypotLogs, setHoneypotLogs] = useState<HoneypotLog[]>([]);
  const [blocks, setBlocks] = useState<MerkleBlock[]>([]);
  const [sessions, setSessions] = useState<Record<string, SessionThreat>>({});
  const [attacksNeutralized, setAttacksNeutralized] = useState<number>(0);
  const [packetsJittered, setPacketsJittered] = useState<number>(0);
  const [svgFilterHtml, setSvgFilterHtml] = useState<string>('');
  const [cssRules, setCssRules] = useState<string>('');

  // Protection Mode & Autonomous Defense Engine State
  const [protectionArmed, setProtectionArmed] = useState<boolean>(true);
  const [virtualPatches, setVirtualPatches] = useState<VirtualPatchRule[]>([]);
  const [differentialHistory, setDifferentialHistory] = useState<DifferentialResult[]>([]);
  const [latestDifferential, setLatestDifferential] = useState<DifferentialResult | null>(null);

  // AI Provider & Multimodal Telemetry State
  const [latestModelReasoning, setLatestModelReasoning] = useState<string | null>(null);
  const [latestVisionProbeResult, setLatestVisionProbeResult] = useState<any>(null);
  const [activeAiProvider, setActiveAiProvider] = useState<any>(null);
  const [perturbedImageBase64, setPerturbedImageBase64] = useState<string | null>(null);

  // Executive Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isReportLoading, setIsReportLoading] = useState<boolean>(false);

  const currentSession = sessions[sessionId];

  const refreshAllData = useCallback(async () => {
    try {
      const snap = await KaryonService.getTelemetrySnapshot();

      if (snap.active_manifest) setManifest(snap.active_manifest);
      setHoneypotLogs(snap.honeypot_logs || []);
      setAttacksNeutralized(snap.total_attacks_neutralized || 0);
      setPacketsJittered(snap.total_packets_jittered || 0);

      if (snap.protection_armed !== undefined) {
        setProtectionArmed(snap.protection_armed);
      }
      if (snap.virtual_patches) {
        setVirtualPatches(snap.virtual_patches);
      }
      if (snap.differential_history && snap.differential_history.length > 0) {
        setDifferentialHistory(snap.differential_history);
        setLatestDifferential(snap.differential_history[snap.differential_history.length - 1]);
      }

      if (snap.latest_model_reasoning) {
        setLatestModelReasoning(snap.latest_model_reasoning);
      }
      if (snap.latest_vision_probe_result) {
        setLatestVisionProbeResult(snap.latest_vision_probe_result);
      }
      if (snap.active_ai_provider) {
        setActiveAiProvider(snap.active_ai_provider);
      }

      const sessionMap: Record<string, SessionThreat> = {};
      (snap.sessions || []).forEach((s) => {
        sessionMap[s.session_id] = s;
      });
      setSessions(sessionMap);
    } catch (err) {
      console.error('Failed to refresh SOC telemetry:', err);
    }
  }, []);

  // Load optical styles if camouflage is active
  useEffect(() => {
    if (currentSession?.optical_camouflage_active) {
      KaryonService.getOpticalStyles(sessionId)
        .then((res) => {
          if (res.svg_filter) setSvgFilterHtml(res.svg_filter);
          if (res.css_rules) setCssRules(res.css_rules);
        })
        .catch(console.error);
    } else {
      setSvgFilterHtml('');
      setCssRules('');
    }
  }, [currentSession?.optical_camouflage_active, sessionId]);

  // Initial load and WebSocket subscriptions
  useEffect(() => {
    refreshAllData();

    // Subscribe to telemetry WebSocket
    const unsubTelemetry = KaryonService.subscribeTelemetry((msg) => {
      if (msg.type === 'SCHEMA_ROTATED') {
        refreshAllData();
      } else if (msg.type === 'HONEYPOT_ATTACK_NEUTRALIZED' && msg.log) {
        setHoneypotLogs((prev) => [...prev, msg.log]);
        setAttacksNeutralized((prev) => prev + 1);
        refreshAllData();
      } else if (msg.type === 'KV_SURGICAL_EVICTION') {
        if (msg.remaining_blocks) {
          setBlocks(msg.remaining_blocks);
        }
        refreshAllData();
      } else if (msg.type === 'ATTACK_SIMULATED' || msg.type === 'SESSION_RESET') {
        if (msg.latest_reasoning) {
          setLatestModelReasoning(msg.latest_reasoning);
        }
        if (msg.vision_probe) {
          setLatestVisionProbeResult(msg.vision_probe);
        }
        if (msg.perturbed_image_base64) {
          setPerturbedImageBase64(msg.perturbed_image_base64);
        }
        refreshAllData();
      } else if (msg.type === 'PROTECTION_MODE_CHANGED') {
        if (msg.protection_armed !== undefined) {
          setProtectionArmed(msg.protection_armed);
        }
        refreshAllData();
      } else if (msg.type === 'DIFFERENTIAL_AB_COMPLETED' && msg.result) {
        setLatestDifferential(msg.result);
        setDifferentialHistory((prev) => [...prev, msg.result]);
        refreshAllData();
      } else if (msg.type === 'BLACK_OCTOBER_MITIGATED') {
        if (msg.patch) {
          setVirtualPatches((prev) => [...prev, msg.patch]);
        }
        setAttacksNeutralized((prev) => prev + 1);
        refreshAllData();
      }
    });

    // Subscribe to polymorphic schema manifest WebSocket
    const unsubManifest = KaryonService.subscribeManifest((m) => {
      setManifest(m);
    });

    const pollInterval = setInterval(refreshAllData, 4000);

    return () => {
      unsubTelemetry();
      unsubManifest();
      clearInterval(pollInterval);
    };
  }, [refreshAllData]);

  const handleToggleProtection = async (armed: boolean) => {
    try {
      const res = await KaryonService.setProtectionMode(armed);
      setProtectionArmed(res.protection_armed);
      refreshAllData();
    } catch (err) {
      console.error('Failed to change protection mode:', err);
    }
  };

  // Attack simulator triggers executed via Red Team deck
  const handleAttackTrigger = async (type: 'vision' | 'schema' | 'injection' | 'heal' | 'reset') => {
    try {
      let res;
      if (type === 'vision') {
        res = await KaryonService.simulateRogueVision(sessionId);
        if (res?.perturbed_image_base64) {
          setPerturbedImageBase64(res.perturbed_image_base64);
        }
        if (res?.vision_probe) {
          setLatestVisionProbeResult(res.vision_probe);
        }
      } else if (type === 'schema') {
        res = await KaryonService.simulateExpiredSchemaProbe(sessionId);
      } else if (type === 'injection') {
        res = await KaryonService.simulatePromptInjection(sessionId);
        if (res?.blocks) {
          setBlocks(res.blocks);
        }
      } else if (type === 'heal') {
        res = await KaryonService.executeSurgicalEvict(sessionId);
        if (res?.remaining_blocks) {
          setBlocks(res.remaining_blocks);
        }
      } else if (type === 'reset') {
        res = await KaryonService.resetSession(sessionId);
        setBlocks([]);
        setLatestVisionProbeResult(null);
      }
      refreshAllData();
    } catch (err: any) {
      console.error('Attack execution error:', err);
    }
  };

  const handleOpenReportModal = async () => {
    setIsReportModalOpen(true);
    setIsReportLoading(true);
    try {
      const data = await KaryonService.getExecutiveReport();
      setReportData(data);
    } catch (err) {
      console.error('Failed to compile executive defense report:', err);
    } finally {
      setIsReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#0866FF] selection:text-white relative">
      {/* Dynamic Optical Camouflage SVG filter injection */}
      {svgFilterHtml && <div dangerouslySetInnerHTML={{ __html: svgFilterHtml }} />}
      {cssRules && <style dangerouslySetInnerHTML={{ __html: cssRules }} />}

      {/* Main View Router */}
      {currentView === 'landing' && (
        <KaryonLandingPage
          onGetStarted={() => handleSetView('audit')}
          onLaunchSoc={() => handleSetView('soc')}
          onOpenReportModal={handleOpenReportModal}
          attacksNeutralized={attacksNeutralized}
          packetsJittered={packetsJittered}
          activeEpoch={manifest?.version}
        />
      )}

      {currentView === 'audit' && (
        <TargetAuditView
          initialTargetUrl={targetUrl}
          onBackToLanding={() => handleSetView('landing')}
          onOpenCommandCenter={(url) => {
            setTargetUrl(url);
            handleSetView('soc');
          }}
        />
      )}

      {currentView === 'soc' && (
        <MetaKaryonSocView
          manifest={manifest}
          honeypotLogs={honeypotLogs}
          blocks={blocks}
          currentSession={currentSession}
          sessionId={sessionId}
          attacksNeutralized={attacksNeutralized}
          packetsJittered={packetsJittered}
          perturbedImageBase64={perturbedImageBase64}
          visionProbeResult={latestVisionProbeResult}
          latestModelReasoning={latestModelReasoning}
          activeAiProvider={activeAiProvider}
          targetUrl={targetUrl}
          protectionArmed={protectionArmed}
          onToggleProtection={handleToggleProtection}
          virtualPatches={virtualPatches}
          differentialHistory={differentialHistory}
          latestDifferential={latestDifferential}
          onBenchmarkCompleted={(res) => {
            setLatestDifferential(res);
            setDifferentialHistory((prev) => [...prev, res]);
            refreshAllData();
          }}
          onPatchMitigated={(res) => {
            if (res.patch) {
              setVirtualPatches((prev) => [...prev, res.patch]);
            }
            setAttacksNeutralized((prev) => prev + 1);
            refreshAllData();
          }}
          onRefreshTelemetry={refreshAllData}
          onOpenReportModal={handleOpenReportModal}
          onBackToLanding={() => handleSetView('landing')}
          onGoToAudit={() => handleSetView('audit')}
          onAttackTrigger={handleAttackTrigger}
        />
      )}

      {/* Executive Defense Report Generator Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportData={reportData}
        loading={isReportLoading}
      />
    </div>
  );
};

export default App;
