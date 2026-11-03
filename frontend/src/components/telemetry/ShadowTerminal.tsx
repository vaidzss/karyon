import React from 'react';
import { Terminal, Key } from 'lucide-react';
import type { HoneypotLog } from '../../types';

interface ShadowTerminalProps {
  logs: HoneypotLog[];
}

export const ShadowTerminal: React.FC<ShadowTerminalProps> = ({ logs }) => {
  return (
    <div className="w-full flex flex-col h-72 space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#282A30]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#F7971D]" />
          <span className="text-xs font-semibold text-white">
            Zero-403 Shadow Deception Feed
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#A8ACB4]">
          <span className="px-2 py-0.5 rounded-full bg-[#F7971D]/10 text-[#F7971D] border border-[#F7971D]/20 text-[10px] font-medium">
            Deception Active
          </span>
          <span>
            Intercepts: <strong className="text-white font-medium">{logs.length}</strong>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-[#71757E]">
            Zero honeypot intercepts logged. Click <strong className="text-white">[B] Expired Schema</strong> to observe the synthetic shadow loop.
          </div>
        ) : (
          logs.slice().reverse().map((entry) => (
            <div
              key={entry.log_id}
              className="p-3 rounded-xl bg-[#16171B] border border-[#282A30] space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-[#282A30]">
                <span className="text-[#F7971D] font-medium">[{entry.decoy_type}]</span>
                <span className="text-[#71757E] font-sans">{new Date(entry.timestamp * 1000).toLocaleTimeString()}</span>
              </div>

              <div className="text-xs">
                <span className="text-[#71757E]">Query: </span>
                <span className="text-[#FA383E] font-sans">{entry.requested_path}</span>
                <span className="text-[#71757E] ml-2">Session: </span>
                <span className="text-white font-sans">{entry.session_id}</span>
              </div>

              {entry.canary_token_issued && (
                <div className="flex items-center gap-1.5 text-xs text-[#F7971D] pt-0.5">
                  <Key className="w-3.5 h-3.5 text-[#F7971D] flex-shrink-0" />
                  <span>Canary Token Seeded: </span>
                  <code className="px-1.5 py-0.5 rounded bg-[#1C1D22] border border-[#282A30] font-sans text-[11px] text-white">
                    {entry.canary_token_issued}
                  </code>
                </div>
              )}

              <div className="mt-1 p-2 rounded-lg bg-[#1C1D22] border border-[#282A30] font-sans text-[10px] text-[#A8ACB4] overflow-x-auto">
                <pre>{JSON.stringify(entry.decoy_payload, null, 2)}</pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
