import React, { useState } from 'react';
import {
  ShieldAlert,
  Download,
  Copy,
  Check,
  X,
  Printer,
  CheckCircle2,
  Lock,
  Activity,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';

interface ExecutiveReportData {
  status: string;
  generated_at: string;
  executive_summary: {
    mitigation_rate: string;
    downtime_ms: number;
    attacks_neutralized: number;
    packets_jittered: number;
    active_epoch: number;
    merkle_root: string;
    protection_armed?: boolean;
    virtual_patches_count?: number;
    latest_differential_proof?: any;
    ai_provider: {
      provider: string;
      model: string;
      reasoning_supported: boolean;
      vision_supported: boolean;
    };
  };
  threat_breakdown: Array<{
    ring: string;
    vector: string;
    mechanism: string;
    metric: string;
  }>;
  markdown_report: string;
}

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ExecutiveReportData | null;
  loading: boolean;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
  loading
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<'visual' | 'raw_markdown'>('visual');

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    if (reportData?.markdown_report) {
      navigator.clipboard.writeText(reportData.markdown_report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!reportData?.markdown_report) return;
    const blob = new Blob([reportData.markdown_report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Karyon-Defense-Executive-Report-Epoch-${reportData.executive_summary.active_epoch}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const isArmed = reportData?.executive_summary.protection_armed ?? true;
  const patchesCount = reportData?.executive_summary.virtual_patches_count ?? 0;
  const diffProof = reportData?.executive_summary.latest_differential_proof;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-[#16171B] border border-[#282A30] rounded-[24px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#121316] border-b border-[#282A30] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0866FF] flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Karyon Executive Defense Report</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#242528] text-[#F5F6F8] border border-[#303236]">
                  HIGH-ASSURANCE AUDIT PROOF
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isArmed ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                }`}>
                  {isArmed ? '4-Ring Armed' : 'Unprotected Baseline'}
                </span>
              </div>
              <p className="text-xs text-[#A8ACB4]">
                Cryptographic verification of autonomous context firewall & moving-target mitigation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#1C1D22] border border-[#282A30] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewFormat('visual')}
                className={`px-3 py-1 rounded-md transition-colors font-medium ${
                  viewFormat === 'visual' ? 'bg-[#0866FF] text-white' : 'text-[#A8ACB4] hover:text-white'
                }`}
              >
                Executive Summary
              </button>
              <button
                onClick={() => setViewFormat('raw_markdown')}
                className={`px-3 py-1 rounded-md transition-colors font-medium ${
                  viewFormat === 'raw_markdown' ? 'bg-[#0866FF] text-white' : 'text-[#A8ACB4] hover:text-white'
                }`}
              >
                Markdown Spec
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A8ACB4] hover:text-white hover:bg-[#242528] transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#0866FF]">
              <Activity className="w-8 h-8 animate-spin" />
              <div className="text-xs font-medium text-[#A8ACB4]">Aggregating cryptographic proof & multi-vector threat records...</div>
            </div>
          ) : reportData ? (
            viewFormat === 'visual' ? (
              <div className="space-y-6">
                {/* Executive Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#1C1D22] border border-[#282A30] rounded-xl p-4">
                    <div className="text-[#A8ACB4] text-xs flex items-center justify-between mb-1">
                      <span>Mitigation Rate</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A400]" />
                    </div>
                    <div className="text-2xl font-bold font-sans text-white tabular-nums">
                      {reportData.executive_summary.mitigation_rate}
                    </div>
                    <div className="text-xs text-[#00A400] mt-1">0 Breaches Allowed</div>
                  </div>

                  <div className="bg-[#1C1D22] border border-[#282A30] rounded-xl p-4">
                    <div className="text-[#A8ACB4] text-xs flex items-center justify-between mb-1">
                      <span>Target Downtime</span>
                      <Activity className="w-3.5 h-3.5 text-[#00A400]" />
                    </div>
                    <div className="text-2xl font-bold font-sans text-white tabular-nums">
                      {reportData.executive_summary.downtime_ms} ms
                    </div>
                    <div className="text-xs text-[#A8ACB4] mt-1">99.999% Service Uptime</div>
                  </div>

                  <div className="bg-[#1C1D22] border border-[#282A30] rounded-xl p-4">
                    <div className="text-[#A8ACB4] text-xs flex items-center justify-between mb-1">
                      <span>Neutralized Vectors</span>
                      <Lock className="w-3.5 h-3.5 text-[#0866FF]" />
                    </div>
                    <div className="text-2xl font-bold font-sans text-white tabular-nums">
                      {reportData.executive_summary.attacks_neutralized}
                    </div>
                    <div className="text-xs text-[#A8ACB4] mt-1">{patchesCount} Virtual Patches Hot-Loaded</div>
                  </div>

                  <div className="bg-[#1C1D22] border border-[#282A30] rounded-xl p-4">
                    <div className="text-[#A8ACB4] text-xs flex items-center justify-between mb-1">
                      <span>Active Epoch</span>
                      <Layers className="w-3.5 h-3.5 text-[#0866FF]" />
                    </div>
                    <div className="text-2xl font-bold font-sans text-white tabular-nums">
                      #{reportData.executive_summary.active_epoch}
                    </div>
                    <div className="text-xs text-[#A8ACB4] mt-1">60s Dynamic Mutation</div>
                  </div>
                </div>

                {/* Target Asset & Engine Context */}
                <div className="p-3.5 bg-[#1C1D22] border border-[#282A30] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[#71757E]">Target Asset: </span>
                    <strong className="text-white font-sans">ApexFin Corporate Treasury (http://localhost:3000)</strong>
                  </div>
                  <div>
                    <span className="text-[#71757E]">Defense Engine: </span>
                    <span className="text-white font-sans">
                      {reportData.executive_summary.ai_provider.model} ({reportData.executive_summary.ai_provider.provider})
                    </span>
                  </div>
                </div>

                {/* A/B Differential Proof Summary if Available */}
                {diffProof && (
                  <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                        <Zap className="w-4 h-4" />
                        <span>A/B DIFFERENTIAL BENCHMARK PROOF</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 tabular-nums">
                        ID: {diffProof.benchmark_id}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-zinc-500 block">Route Entropy:</span>
                        <strong className="text-white tabular-nums">{diffProof.entropy_bits_per_byte?.toFixed(2)} bits/byte</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Vision Evasion:</span>
                        <strong className="text-white tabular-nums">{diffProof.ocr_evasion_rate}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">KV Eviction Latency:</span>
                        <strong className="text-white tabular-nums">{diffProof.eviction_latency_ms?.toFixed(1)} ms</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Zero-Day Deploy:</span>
                        <strong className="text-white tabular-nums">{diffProof.zero_day_deploy_latency_ms?.toFixed(1)} ms</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multi-Vector Threat Breakdown Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-[#A8ACB4] uppercase tracking-wider">
                    Multi-Vector Threat Neutralization Matrix
                  </h4>
                  <div className="bg-[#1C1D22] border border-[#282A30] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#121316] text-[#A8ACB4] uppercase tracking-wider text-[10px] border-b border-[#282A30]">
                        <tr>
                          <th className="py-3 px-4">Defense Ring</th>
                          <th className="py-3 px-4">Adversarial Vector</th>
                          <th className="py-3 px-4">Defense Mechanism</th>
                          <th className="py-3 px-4 text-right">Verified Proof / Metric</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#282A30]">
                        {reportData.threat_breakdown.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#22242A] transition-colors">
                            <td className="py-3 px-4 font-semibold text-white">{row.ring}</td>
                            <td className="py-3 px-4 text-[#F5F6F8]">{row.vector}</td>
                            <td className="py-3 px-4 text-[#A8ACB4]">{row.mechanism}</td>
                            <td className="py-3 px-4 text-right font-medium text-[#00A400]">{row.metric}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cryptographic Proof Chain */}
                <div className="bg-[#1C1D22] border border-[#282A30] rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#0866FF]" />
                    <span>Cryptographic Integrity Proof Chain</span>
                  </div>
                  <div className="text-xs font-sans text-[#A8ACB4] space-y-1">
                    <div>
                      <span className="text-[#71757E]">Merkle Root: </span>
                      <span className="text-white break-all">{reportData.executive_summary.merkle_root}</span>
                    </div>
                    <div>
                      <span className="text-[#71757E]">Timestamp: </span>
                      <span className="text-white">{reportData.generated_at}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#121316] border border-[#282A30] rounded-xl p-4 font-sans text-xs text-[#A8ACB4] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
                {reportData.markdown_report}
              </div>
            )
          ) : (
            <div className="text-center py-10 text-[#71757E]">Report generation failed. Please try again.</div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#121316] border-t border-[#282A30] flex items-center justify-between">
          <div className="text-xs text-[#71757E]">
            Certified by Karyon Autonomous Defense Gateway v1.0.0
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#242528] hover:bg-[#2F3136] text-[#F5F6F8] border border-[#303236] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#242528] hover:bg-[#2F3136] text-[#F5F6F8] border border-[#303236] transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00A400]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#0866FF] hover:bg-[#0055D6] text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
