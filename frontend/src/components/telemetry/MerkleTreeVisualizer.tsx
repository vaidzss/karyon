import React from 'react';
import { GitBranch, Scissors } from 'lucide-react';
import type { MerkleBlock } from '../../types';
import { KaryonService } from '../../services/api';

interface MerkleTreeVisualizerProps {
  blocks: MerkleBlock[];
  sessionId: string;
  onBlockEvicted: () => void;
}

export const MerkleTreeVisualizer: React.FC<MerkleTreeVisualizerProps> = ({
  blocks,
  sessionId,
  onBlockEvicted
}) => {
  const handleEvict = async (blockId: string) => {
    try {
      await KaryonService.executeSurgicalEvict(sessionId, blockId);
      onBlockEvicted();
    } catch (err) {
      console.error('Evict failed:', err);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#282A30]">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#0866FF]" />
          <span className="text-xs font-semibold text-white">
            Merkle KV-Cache Provenance Tree
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#A8ACB4]">
          <span>Blocks: <strong className="text-white font-medium">{blocks.length}</strong></span>
          <span className="px-2 py-0.5 rounded-full bg-[#242528] text-[#F5F6F8] border border-[#303236] text-[10px]">
            RoPE Splice Engine
          </span>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#71757E]">
          No KV memory blocks registered. Click <strong className="text-white">[C] Prompt Inject</strong> to simulate ingestion.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {blocks.map((block) => {
            const isPoisoned = block.status === 'POISONED';
            const isSpliced = block.status === 'SPLICED';
            const isEvicted = block.status === 'EVICTED';

            return (
              <div
                key={block.block_id}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  isPoisoned
                    ? 'bg-[#FA383E]/10 border-[#FA383E]/40'
                    : isSpliced
                    ? 'bg-[#0866FF]/10 border-[#0866FF]/30'
                    : isEvicted
                    ? 'bg-[#1C1D22] border-[#282A30] opacity-50 line-through'
                    : 'bg-[#16171B] border-[#282A30]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#242528] text-white font-sans text-[10px]">
                      #{block.index} [{block.role.toUpperCase()}]
                    </span>
                    <span className="text-white font-sans text-[11px] font-medium">{block.block_id}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        isPoisoned
                          ? 'bg-[#FA383E]/20 text-[#FA383E] border-[#FA383E]/40'
                          : isSpliced
                          ? 'bg-[#0866FF]/20 text-[#0866FF] border-[#0866FF]/40'
                          : isEvicted
                          ? 'bg-[#242528] text-[#71757E] border-[#303236]'
                          : 'bg-[#00A400]/20 text-[#00A400] border-[#00A400]/40'
                      }`}
                    >
                      {block.status}
                    </span>

                    {isPoisoned && (
                      <button
                        onClick={() => handleEvict(block.block_id)}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FA383E] hover:bg-[#D92C32] text-white font-medium text-[11px] transition-colors"
                        title="Surgically evict this block and re-stitch Merkle tree"
                      >
                        <Scissors className="w-3 h-3" />
                        <span>Evict</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tokens preview */}
                <div className="p-2.5 rounded-lg bg-[#1C1D22] border border-[#282A30] text-[#F5F6F8] text-xs mb-2 leading-relaxed break-words font-sans">
                  {block.tokens}
                </div>

                {/* Merkle Hashes & Anomaly Score */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#A8ACB4]">
                  <div>
                    <span className="text-[#71757E]">SHA256: </span>
                    <span className="text-white font-sans">{block.sha256_hash.slice(0, 10)}...</span>
                  </div>
                  <div>
                    <span className="text-[#71757E]">Parent: </span>
                    <span className="text-white font-sans">{block.parent_hash.slice(0, 10)}...</span>
                  </div>
                  <div>
                    <span className="text-[#71757E]">Anomaly: </span>
                    <span
                      className={`font-semibold ${
                        block.attention_anomaly_score >= 0.65 ? 'text-[#FA383E]' : 'text-[#00A400]'
                      }`}
                    >
                      {(block.attention_anomaly_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
