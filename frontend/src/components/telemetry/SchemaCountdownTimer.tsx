import React, { useState, useEffect } from 'react';
import { RefreshCw, Shuffle, Database, Globe, ArrowRight } from 'lucide-react';
import type { SchemaManifest } from '../../types';
import { KaryonService } from '../../services/api';

interface SchemaCountdownTimerProps {
  manifest: SchemaManifest | null;
  onRotated: () => void;
}

export const SchemaCountdownTimer: React.FC<SchemaCountdownTimerProps> = ({
  manifest,
  onRotated
}) => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (!manifest) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor(manifest.expires_at - Date.now() / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        onRotated();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [manifest, onRotated]);

  const handleForceRotation = async () => {
    setIsRotating(true);
    try {
      await KaryonService.rotateSchema();
      onRotated();
    } catch (err) {
      console.error('Failed to force schema rotation:', err);
    } finally {
      setIsRotating(false);
    }
  };

  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / 60) * 100));

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#282A30]">
        <div className="flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-[#0866FF]" />
          <span className="text-xs font-semibold text-white">
            Polymorphic Schema Cycle
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A8ACB4]">
            Epoch: <strong className="text-white font-medium">v{manifest?.version || 1}</strong>
          </span>
          <button
            onClick={handleForceRotation}
            disabled={isRotating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#242528] hover:bg-[#2F3136] border border-[#303236] text-[#F5F6F8] text-xs font-medium transition-colors"
            title="Force immediate polymorphic re-mapping"
          >
            <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Force Mutation</span>
          </button>
        </div>
      </div>

      {/* Countdown progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A8ACB4]">Next Automatic Ingress & SQL View Rotation:</span>
          <span className="text-white font-medium font-sans">{secondsLeft}s remaining</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#1C1D22] overflow-hidden border border-[#282A30]">
          <div
            className="h-full bg-[#0866FF] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Dynamic View & Route Mappings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Dynamic REST Endpoints */}
        <div className="p-3 rounded-xl bg-[#16171B] border border-[#282A30] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Globe className="w-3.5 h-3.5 text-[#0866FF]" />
            <span>Active Polymorphic Ingress</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {manifest?.route_mappings &&
              Object.entries(manifest.route_mappings).map(([canon, poly]) => (
                <div key={canon} className="text-[11px] p-2 rounded-lg bg-[#1C1D22] border border-[#282A30] font-sans">
                  <div className="text-[#A8ACB4] truncate">{canon}</div>
                  <div className="flex items-center gap-1 text-[#0866FF] font-medium truncate mt-0.5">
                    <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{poly}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Dynamic SQLite VIEW Column Aliases */}
        <div className="p-3 rounded-xl bg-[#16171B] border border-[#282A30] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#00A400]" />
              <span>SQLite Dynamic VIEW</span>
            </div>
            <span className="text-[10px] text-[#00A400] px-1.5 py-0.5 rounded bg-[#00A400]/10 border border-[#00A400]/20 font-sans">
              {manifest?.active_view_name || 'v_accounts_polymorphic'}
            </span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {manifest?.column_mappings?.accounts &&
              Object.entries(manifest.column_mappings.accounts).map(([orig, alias]) => (
                <div
                  key={orig}
                  className="flex items-center justify-between text-[11px] font-sans px-2 py-1 rounded-lg bg-[#1C1D22] border border-[#282A30]"
                >
                  <span className="text-[#A8ACB4]">{orig}</span>
                  <span className="text-[#00A400] font-medium">{alias}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
