import React, { useRef, useEffect, useState } from 'react';
import { Eye, Activity, ShieldCheck, Cpu, ChevronDown, ChevronUp, RefreshCw, AlertCircle } from 'lucide-react';
import { KaryonService } from '../../services/api';

interface OpticalCanvasPreviewProps {
  isCamouflageActive: boolean;
  threatScore: number;
  packetsJittered: number;
  perturbedImageBase64?: string | null;
  visionProbeResult?: any;
  sessionId?: string;
}

export const OpticalCanvasPreview: React.FC<OpticalCanvasPreviewProps> = ({
  isCamouflageActive,
  threatScore,
  packetsJittered,
  perturbedImageBase64: initialImageBase64,
  visionProbeResult,
  sessionId = 'attacker_session_01'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'pytorch' | 'canvas'>('pytorch');
  const [pytorchImage, setPytorchImage] = useState<string | null>(initialImageBase64 || null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [showReasoningTrace, setShowReasoningTrace] = useState<boolean>(false);

  useEffect(() => {
    if (initialImageBase64) {
      setPytorchImage(initialImageBase64);
    }
  }, [initialImageBase64]);

  useEffect(() => {
    if (!pytorchImage) {
      loadPytorchShield();
    }
  }, [isCamouflageActive]);

  const loadPytorchShield = async () => {
    setLoadingImage(true);
    try {
      const data = await KaryonService.getRenderedShield(sessionId);
      if (data?.perturbed_base64) {
        setPytorchImage(data.perturbed_base64);
      }
    } catch (err) {
      console.error('Failed to load rendered PyTorch shield:', err);
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'canvas') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#16171B';
      ctx.fillRect(0, 0, w, h);

      const boxX = 20;
      const boxY = 15;
      const boxW = w - 40;
      const boxH = h - 30;

      ctx.fillStyle = '#1C1D22';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = isCamouflageActive ? '#FA383E' : '#282A30';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#F5F6F8';
      ctx.font = '500 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('WIRE TRANSFER: $4,850,250.00', w / 2, boxY + boxH / 2);

      if (isCamouflageActive) {
        const imgData = ctx.getImageData(boxX, boxY, boxW, boxH);
        const data = imgData.data;

        const phase = frame * 0.08;
        for (let y = 0; y < boxH; y++) {
          for (let x = 0; x < boxW; x++) {
            const idx = (y * boxW + x) * 4;
            const noise = Math.sin(x * 0.2 + phase) * Math.cos(y * 0.2 - phase) * 22;
            data[idx] = Math.min(255, Math.max(0, data[idx] + noise + 10));
            data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + (noise * 0.5)));
            data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] - noise + 15));
          }
        }
        ctx.putImageData(imgData, boxX, boxY);

        ctx.strokeStyle = 'rgba(250, 56, 62, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const shearY = boxY + (frame % boxH);
        ctx.moveTo(boxX, shearY);
        ctx.lineTo(boxX + boxW, shearY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isCamouflageActive, viewMode]);

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#282A30]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#0866FF]" />
          <span className="text-xs font-semibold text-white">
            Optical Perturbation & TLS Shield
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A8ACB4]">
            Threat: <strong className="text-white font-medium">{(threatScore * 100).toFixed(0)}%</strong>
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              isCamouflageActive
                ? 'bg-[#FA383E]/10 text-[#FA383E] border-[#FA383E]/30'
                : 'bg-[#242528] text-[#A8ACB4] border-[#303236]'
            }`}
          >
            {isCamouflageActive ? 'Perturbation Active' : 'Shield Standby'}
          </span>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#16171B] p-1 rounded-lg border border-[#282A30] text-xs">
          <button
            onClick={() => setViewMode('pytorch')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 font-medium ${
              viewMode === 'pytorch'
                ? 'bg-[#0866FF] text-white'
                : 'text-[#A8ACB4] hover:text-white'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>PyTorch Buffer</span>
          </button>
          <button
            onClick={() => setViewMode('canvas')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              viewMode === 'canvas'
                ? 'bg-[#0866FF] text-white'
                : 'text-[#A8ACB4] hover:text-white'
            }`}
          >
            <span>Canvas Emulation</span>
          </button>
        </div>

        {viewMode === 'pytorch' && (
          <button
            onClick={loadPytorchShield}
            disabled={loadingImage}
            className="flex items-center gap-1 text-xs text-[#A8ACB4] hover:text-white transition-colors"
            title="Re-render PyTorch Perturbation"
          >
            <RefreshCw className={`w-3 h-3 ${loadingImage ? 'animate-spin text-[#0866FF]' : ''}`} />
            <span>Re-render</span>
          </button>
        )}
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        {/* Optical Bounding Box Live Preview */}
        <div className="space-y-1.5">
          <div className="text-xs text-[#A8ACB4] flex items-center justify-between">
            <span>{viewMode === 'pytorch' ? 'PyTorch Tensor Buffer' : 'Dynamic Canvas'}</span>
            <span className={isCamouflageActive ? 'text-[#FA383E] font-medium' : 'text-[#A8ACB4]'}>
              {isCamouflageActive ? 'Adversarial Noise Injected' : 'Clean UI'}
            </span>
          </div>

          <div className="border border-[#282A30] rounded-xl bg-[#16171B] overflow-hidden flex items-center justify-center min-h-[90px]">
            {viewMode === 'pytorch' ? (
              pytorchImage ? (
                <img
                  src={`data:image/png;base64,${pytorchImage}`}
                  alt="PyTorch Perturbed Bounding Box Shield"
                  className="w-full h-auto object-cover max-h-[140px]"
                />
              ) : (
                <div className="p-4 text-center text-xs text-[#71757E]">
                  {loadingImage ? 'Synthesizing PyTorch Tensor Perturbations...' : 'No tensor buffer available.'}
                </div>
              )
            ) : (
              <canvas ref={canvasRef} width={280} height={90} className="w-full h-auto block" />
            )}
          </div>
        </div>

        {/* TLS Constant-Time Packet Timing Shield Graph */}
        <div className="p-3 rounded-xl bg-[#16171B] border border-[#282A30] space-y-2">
          <div className="flex items-center justify-between text-xs text-white">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-[#0866FF]" />
              TLS Timing Normalization
            </span>
            <span className="text-[#00A400] font-medium font-sans text-[11px]">256-Byte / 25ms</span>
          </div>

          {/* Visual Flatline packet representation */}
          <div className="h-12 flex items-end gap-1 px-1 py-1 bg-[#1C1D22] rounded-lg border border-[#282A30]">
            {[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256].map((sz, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#00A400]/80 rounded-t transition-all"
                  style={{ height: '70%' }}
                  title={`Packet ${i}: ${sz}B, delta 25.0ms`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#A8ACB4]">
            <span>Entropy: <strong className="text-[#00A400]">0.00 bits</strong></span>
            <span>Frames: <strong className="text-white">{packetsJittered}</strong></span>
          </div>
        </div>
      </div>

      {/* Multimodal Rogue Vision Agent Live Verification Panel */}
      {visionProbeResult && (
        <div className="p-3.5 rounded-xl bg-[#16171B] border border-[#282A30] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#282A30] pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00A400]" />
              <span className="text-xs font-semibold text-white">
                Live Vision Probe: Meta Muse Spark Open OCR Scrape
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                visionProbeResult.optical_cloak_effective
                  ? 'bg-[#00A400]/10 text-[#00A400] border-[#00A400]/20'
                  : 'bg-[#F7971D]/10 text-[#F7971D] border-[#F7971D]/20'
              }`}
            >
              {visionProbeResult.optical_cloak_effective ? 'CLOAK VERIFIED: MISREAD INDUCED' : 'READABLE'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-[#1C1D22] border border-[#282A30]">
              <span className="text-[#71757E] block text-[10px]">Real Account</span>
              <span className="text-white font-sans text-[11px] font-medium">ACC-882190</span>
            </div>
            <div className="p-2 rounded-lg bg-[#1C1D22] border border-[#282A30]">
              <span className="text-[#71757E] block text-[10px]">Rogue Extracted</span>
              <span className={`font-sans text-[11px] font-medium ${
                visionProbeResult.extracted_account !== 'ACC-882190'
                  ? 'text-[#FA383E]'
                  : 'text-white'
              }`}>
                {visionProbeResult.extracted_account || 'ERR_UNREADABLE'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#1C1D22] border border-[#282A30]">
              <span className="text-[#71757E] block text-[10px]">Parsed Balance</span>
              <span className="text-[#F7971D] font-sans text-[11px] font-medium">{visionProbeResult.extracted_balance || '$0.00'}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#1C1D22] border border-[#282A30]">
              <span className="text-[#71757E] block text-[10px]">Confidence</span>
              <span className="text-[#0866FF] font-sans text-[11px] font-medium">
                {((visionProbeResult.confidence_score ?? 0.35) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Reasoning trace collapsible */}
          {visionProbeResult.reasoning_trace && (
            <div className="pt-1">
              <button
                onClick={() => setShowReasoningTrace(!showReasoningTrace)}
                className="flex items-center gap-1 text-xs text-[#0866FF] hover:underline"
              >
                {showReasoningTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showReasoningTrace ? 'Hide Vision Model Chain-of-Thought' : 'Inspect Muse Spark Reasoning Trace'}</span>
              </button>

              {showReasoningTrace && (
                <div className="mt-2 p-3 rounded-lg bg-[#1C1D22] border border-[#282A30] text-xs font-sans text-[#A8ACB4] max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  <div className="flex items-center gap-1.5 text-white font-medium mb-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5 text-[#0866FF]" />
                    <span>Raw Model Internal Reasoning:</span>
                  </div>
                  {visionProbeResult.reasoning_trace}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
