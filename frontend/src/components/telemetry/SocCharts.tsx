import React, { useState } from 'react';
import {
  TrendingUp
} from 'lucide-react';

interface SocChartsProps {
  attacksNeutralized: number;
  packetsJittered: number;
  activeEpoch: number;
}

export const SocCharts: React.FC<SocChartsProps> = ({
  attacksNeutralized,
  packetsJittered,
  activeEpoch
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1h' | '24h' | '7d'>('24h');

  // SVG Pie Chart Data: Threat Vector Distribution
  const vectorData = [
    { label: 'Visual UI Scraping (OCR)', value: 38, color: '#0866FF' },
    { label: 'API Schema Probing (BOLA)', value: 27, color: '#00A400' },
    { label: 'RAG Context Injection', value: 22, color: '#F7971D' },
    { label: 'Agent Ledger Extraction', value: 13, color: '#9333EA' }
  ];

  // Calculate SVG Pie segments
  let cumulativePercent = 0;
  const pieSlices = vectorData.map((item) => {
    const startAngle = cumulativePercent * 3.6; // 360 deg * (percent / 100)
    cumulativePercent += item.value;
    const endAngle = cumulativePercent * 3.6;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const r = 40;
    const cx = 50;
    const cy = 50;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArcFlag = item.value > 50 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      ...item,
      pathData
    };
  });


  // Dynamic Timeline points based on selected activeTimeframe
  const timelineDataMap = {
    '1h': [
      { time: '10m', total: Math.max(2, Math.round(attacksNeutralized * 0.2)), blocked: Math.max(2, Math.round(attacksNeutralized * 0.2)) },
      { time: '20m', total: Math.max(4, Math.round(attacksNeutralized * 0.4)), blocked: Math.max(4, Math.round(attacksNeutralized * 0.4)) },
      { time: '30m', total: Math.max(6, Math.round(attacksNeutralized * 0.6)), blocked: Math.max(6, Math.round(attacksNeutralized * 0.6)) },
      { time: '40m', total: Math.max(8, Math.round(attacksNeutralized * 0.8)), blocked: Math.max(8, Math.round(attacksNeutralized * 0.8)) },
      { time: '50m', total: Math.max(10, Math.round(attacksNeutralized * 0.95)), blocked: Math.max(10, Math.round(attacksNeutralized * 0.95)) },
      { time: 'Now', total: Math.max(14, attacksNeutralized), blocked: Math.max(14, attacksNeutralized) }
    ],
    '24h': [
      { time: '00:00', total: 12, blocked: 12 },
      { time: '04:00', total: 28, blocked: 28 },
      { time: '08:00', total: 64, blocked: 64 },
      { time: '12:00', total: 110, blocked: 110 },
      { time: '16:00', total: 85, blocked: 85 },
      { time: '20:00', total: 54, blocked: 54 },
      { time: 'Now', total: Math.max(92, attacksNeutralized), blocked: Math.max(92, attacksNeutralized) }
    ],
    '7d': [
      { time: 'Mon', total: 140, blocked: 140 },
      { time: 'Tue', total: 210, blocked: 210 },
      { time: 'Wed', total: 320, blocked: 320 },
      { time: 'Thu', total: 280, blocked: 280 },
      { time: 'Fri', total: 390, blocked: 390 },
      { time: 'Sat', total: 180, blocked: 180 },
      { time: 'Sun', total: Math.max(240, attacksNeutralized * 4), blocked: Math.max(240, attacksNeutralized * 4) }
    ]
  };

  const timelinePoints = timelineDataMap[activeTimeframe];
  const maxVal = Math.max(...timelinePoints.map((p) => p.total), 10) * 1.25;
  const graphWidth = 500;
  const graphHeight = 150;
  const paddingX = 30;
  const paddingY = 20;

  const pointsString = timelinePoints
    .map((pt, idx) => {
      const x = paddingX + (idx / (timelinePoints.length - 1)) * (graphWidth - paddingX * 2);
      const y = graphHeight - paddingY - (pt.blocked / maxVal) * (graphHeight - paddingY * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `${pointsString} ${graphWidth - paddingX},${graphHeight - paddingY} ${paddingX},${graphHeight - paddingY}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F2637]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0866FF]" />
            <span>Autonomous AI Defense Analytics &amp; Telemetry</span>
          </h2>
          <p className="text-xs text-[#8A94A6] mt-0.5">
            Real-time multi-vector mitigation metrics across ApexFin Banking Ingress.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0D14] border border-[#1F2637] text-xs">
          {(['1h', '24h', '7d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTimeframe === tf
                  ? 'bg-[#0866FF] text-white shadow-sm'
                  : 'text-[#8A94A6] hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Area Graph & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Graph: Attack Traffic vs 100% Mitigation (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20 inline-block mb-1">
                TELEMETRY TRAFFIC
              </div>
              <h3 className="text-sm font-semibold text-white">
                Adversarial Requests vs 100% Mitigation Timeline
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>0 Breaches</span>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-44">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0866FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0866FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={graphHeight - paddingY} x2={graphWidth - paddingX} y2={graphHeight - paddingY} stroke="#1F2637" strokeWidth="1" />
              <line x1={paddingX} y1={graphHeight / 2} x2={graphWidth - paddingX} y2={graphHeight / 2} stroke="#1F2637" strokeDasharray="4 4" strokeWidth="0.8" />
              <line x1={paddingX} y1={paddingY} x2={graphWidth - paddingX} y2={paddingY} stroke="#1F2637" strokeDasharray="4 4" strokeWidth="0.8" />

              {/* Area */}
              <polygon points={areaString} fill="url(#areaGradient)" />

              {/* Line */}
              <polyline points={pointsString} fill="none" stroke="#0866FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points */}
              {timelinePoints.map((pt, idx) => {
                const x = paddingX + (idx / (timelinePoints.length - 1)) * (graphWidth - paddingX * 2);
                const y = graphHeight - paddingY - (pt.blocked / maxVal) * (graphHeight - paddingY * 2);
                return (
                  <g key={pt.time}>
                    <circle cx={x} cy={y} r="3.5" fill="#0A0D14" stroke="#0866FF" strokeWidth="2" />
                    <text x={x} y={graphHeight - 4} textAnchor="middle" fontSize="9" fill="#8A94A6" fontFamily="Inter, -apple-system, sans-serif">
                      {pt.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8A94A6] pt-2 border-t border-[#1F2637] font-sans">
            <span>Interception Efficacy: <strong className="text-emerald-400">100.0% Success</strong></span>
            <span>Uptime: <strong className="text-white">99.999% Zero Downtime</strong></span>
          </div>
        </div>

        {/* Pie Chart: Threat Vector Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#0866FF] border border-blue-500/20 inline-block mb-1">
              ATTACK COMPOSITION
            </div>
            <h3 className="text-sm font-semibold text-white">
              Threat Distribution by Vector
            </h3>
          </div>

          {/* SVG Pie Chart + Legends */}
          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            <div className="w-32 h-32 flex-shrink-0 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {pieSlices.map((slice) => (
                  <path
                    key={slice.label}
                    d={slice.pathData}
                    fill={slice.color}
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
                {/* Center hole for donut style */}
                <circle cx="50" cy="50" r="22" fill="#101522" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-white font-sans">4 RINGS</span>
                <span className="text-[9px] text-[#8A94A6]">ACTIVE</span>
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-2 flex-1 text-xs">
              {vectorData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#8A94A6] text-[11px]">{item.label}</span>
                  </div>
                  <span className="font-sans text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] text-[11px] text-[#8A94A6] flex items-center justify-between font-sans">
            <span>Total Neutralized: <strong className="text-white font-sans">{attacksNeutralized}</strong></span>
            <span>Current Epoch: <strong className="text-[#0866FF]">v{activeEpoch}</strong></span>
          </div>
        </div>
      </div>

      {/* Row 2: Defense Ring Performance Bar Chart & Memory Attribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ring Mitigation Performance Bar Chart */}
        <div className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-4 shadow-sm">
          <div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-1">
              RING BENCHMARKS
            </div>
            <h3 className="text-sm font-semibold text-white">
              Countermeasure Latency &amp; Efficacy Rates
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {/* Ring 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-300">Ring 1: Optical Camouflage (PyTorch)</span>
                <span className="text-emerald-400 font-bold">94.2% OCR Error / &lt;25ms</span>
              </div>
              <div className="w-full bg-[#0A0D14] h-2 rounded-full overflow-hidden border border-[#1F2637]">
                <div className="h-full bg-[#0866FF] rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>

            {/* Ring 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-300">Ring 2: Polymorphic Route Mesh</span>
                <span className="text-emerald-400 font-bold">100% Ingress Rotation (60s)</span>
              </div>
              <div className="w-full bg-[#0A0D14] h-2 rounded-full overflow-hidden border border-[#1F2637]">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Ring 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-300">Ring 3: RoPE Context Surgery</span>
                <span className="text-emerald-400 font-bold">&lt;120ms Recovery (84ms Avg)</span>
              </div>
              <div className="w-full bg-[#0A0D14] h-2 rounded-full overflow-hidden border border-[#1F2637]">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            {/* Ring 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-300">Ring 4: Baseten Stateful Honeypot</span>
                <span className="text-emerald-400 font-bold">0 HTTP 403s / 100% Compute Trapped</span>
              </div>
              <div className="w-full bg-[#0A0D14] h-2 rounded-full overflow-hidden border border-[#1F2637]">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KV-Cache Memory Provenance Distribution */}
        <div className="p-6 rounded-2xl bg-[#101522] border border-[#1F2637] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-1">
              KV PROVENANCE
            </div>
            <h3 className="text-sm font-semibold text-white">
              Attention Block Provenance Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] space-y-1">
              <div className="text-[11px] text-[#8A94A6]">Clean Memory Blocks</div>
              <div className="text-xl font-bold text-white font-sans">98.4%</div>
              <div className="text-[10px] text-emerald-400 font-medium">Merkle Signed</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] space-y-1">
              <div className="text-[11px] text-[#8A94A6]">Spliced / Evicted</div>
              <div className="text-xl font-bold text-amber-400 font-sans">1.6%</div>
              <div className="text-[10px] text-amber-300 font-medium">RoPE Excised</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] space-y-1">
              <div className="text-[11px] text-[#8A94A6]">SSE Timing Jitter</div>
              <div className="text-xl font-bold text-white font-sans">{packetsJittered}</div>
              <div className="text-[10px] text-blue-400 font-medium">Normalized 256B</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1F2637] space-y-1">
              <div className="text-[11px] text-[#8A94A6]">Session Recovery</div>
              <div className="text-xl font-bold text-white font-sans">0 ms</div>
              <div className="text-[10px] text-emerald-400 font-medium">Zero Restarts</div>
            </div>
          </div>

          <div className="text-xs font-sans text-[#8A94A6] pt-2 border-t border-[#1F2637]">
            Certified via Merkle DAG Hash verification on SQLite immutable ledger.
          </div>
        </div>
      </div>
    </div>
  );
};
