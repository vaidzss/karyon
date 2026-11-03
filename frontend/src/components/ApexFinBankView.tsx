import React, { useState } from 'react';
import {
  Building2,
  Send,
  ArrowRightLeft,
  Clock,
  Bot,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Search,
  ExternalLink
} from 'lucide-react';
import type { Account, Transaction, SessionThreat } from '../types';
import { KaryonService } from '../services/api';

interface ApexFinBankViewProps {
  accounts: Account[];
  transactions: Transaction[];
  currentSession: SessionThreat | undefined;
  sessionId: string;
  onRefresh: () => void;
  onSwitchToDefense?: () => void;
}

export const ApexFinBankView: React.FC<ApexFinBankViewProps> = ({
  accounts,
  transactions,
  currentSession,
  sessionId,
  onRefresh,
  onSwitchToDefense
}) => {
  // Wire transfer form state
  const [sourceAcc, setSourceAcc] = useState<string>(accounts[0]?.account_number || 'ACC-882190');
  const [destAcc, setDestAcc] = useState<string>('ACC-449102');
  const [amount, setAmount] = useState<number>(250000);
  const [memo, setMemo] = useState<string>('Corporate Treasury Liquidity Sweep');
  const [transferMsg, setTransferMsg] = useState<{ status: 'success' | 'error'; text: string; details?: any } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Chat assistant state
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Good day, Dr. Rostova. ApexFin Treasury Intelligence is active. All fiduciary operations are protected by Karyon Context Firewall. How may I assist your treasury operations today?'
    }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  // Optical shield active flag
  const isCamouflageActive = currentSession?.optical_camouflage_active || false;
  const isShadowMode = currentSession?.shadow_mode || false;

  const totalLiquidity = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTransferMsg(null);
    try {
      const res = await KaryonService.executeTransfer(
        { source_account: sourceAcc, dest_account: destAcc, amount, memo },
        sessionId
      );
      setTransferMsg({
        status: 'success',
        text: res.message || 'Wire Transfer settled successfully.',
        details: res.tx_id || res.canary_audit_token ? res : undefined
      });
      onRefresh();
    } catch (err: any) {
      setTransferMsg({ status: 'error', text: err.message || 'Transfer failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;
    const userText = chatPrompt;
    setChatPrompt('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatting(true);

    try {
      const res = await KaryonService.chatAssistant(userText, sourceAcc, sessionId);
      setChatHistory((prev) => [...prev, { role: 'assistant', text: res.reply }]);
      onRefresh();
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: `Verification error: ${err.message}` }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.tx_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.source_account.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.dest_account.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-full bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Authentic Bank Brand Navigation Header */}
      <div className="bg-[#0c1427] border-b border-slate-800/80 px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  ApexFin Federal Treasury Portal
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  FDIC Insured · Fedwire
                </span>
                {isShadowMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    Deception Honeypot Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Institutional Liquidity Node #021000021 · Corporate Custody Division
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">Dr. Elena Rostova</div>
              <div className="text-[11px] text-slate-400 font-sans">Treasury Officer #449102</div>
            </div>

            {onSwitchToDefense && (
              <button
                onClick={onSwitchToDefense}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-sans text-cyan-400 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Karyon SOC</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bank Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Top Financial Health Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0c1427]/80 border border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Total Sovereign Liquidity</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-sans tracking-tight">
              ${totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real SQLite Fiduciary Ledger</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0c1427]/80 border border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">30-Day Fedwire Settlement Volume</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-sans tracking-tight">
              $14,820,000.00
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              100% On-Time Reserve Clearance
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0c1427]/80 border border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Defense Shield Security</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-sans tracking-tight flex items-center gap-2">
              <span>PROTECTED</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Karyon 4-Ring Context Firewall Active
            </div>
          </div>
        </div>

        {/* Corporate Accounts Grid */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Corporate Treasury Accounts
            </h2>
            {isCamouflageActive && (
              <span className="text-xs font-sans text-red-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Optical Camouflage Perturbation Active (Bounding Box Shift)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.account_number}
                className={`p-5 rounded-xl border transition-all ${
                  isCamouflageActive
                    ? 'karyon-shield-active bg-[#0d162b] border-red-500/40 shadow-red-950/20'
                    : 'bg-[#0c1427] hover:bg-[#0f1933] border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{acc.customer_name}</span>
                    <span className="text-[11px] text-slate-400">{acc.account_type}</span>
                  </div>
                  <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {acc.account_number}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Available Balance</div>
                  <div className="account-balance-value text-xl font-bold text-emerald-400 font-sans tracking-tight mt-0.5">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span>Routing: {acc.routing_number}</span>
                  <span className="text-emerald-400 font-medium">{acc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wire Transfer & AI Assistant Split Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Wire Transfer Execution Form (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-xl bg-[#0c1427] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Execute Fedwire Institutional Transfer
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-sans">Node ID: 021000021</span>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Source Debit Account</label>
                  <select
                    value={sourceAcc}
                    onChange={(e) => setSourceAcc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.account_number} value={acc.account_number}>
                        {acc.account_number} - {acc.customer_name} (${acc.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Destination Routing / Account</label>
                  <input
                    type="text"
                    value={destAcc}
                    onChange={(e) => setDestAcc(e.target.value)}
                    placeholder="e.g. ACC-449102"
                    className="recipient-account-input w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Transfer Amount ($ USD)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1}
                    step={100}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Settlement Memo / Reference</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`wire-transfer-btn px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    isCamouflageActive ? 'karyon-shield-active' : ''
                  } ${
                    isSubmitting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Clearing Fedwire Node...' : 'Authorize Wire Transfer'}</span>
                </button>

                {transferMsg && (
                  <div
                    className={`text-xs font-sans flex items-center gap-1.5 p-2 rounded-md ${
                      transferMsg.status === 'success'
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-950/50 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {transferMsg.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <span>{transferMsg.text}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right: ApexFin AI Treasury Assistant (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-[#0c1427] border border-slate-800 flex flex-col h-[340px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  ApexFin Treasury Copilot
                </h3>
              </div>
              <span className="text-[10px] font-sans text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                Ring 3 Protected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-sans text-xs">
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg leading-relaxed ${
                    item.role === 'user'
                      ? 'bg-slate-900 text-slate-100 ml-6 border border-slate-700/60'
                      : 'bg-purple-950/20 text-purple-200 mr-6 border border-purple-500/25'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold">
                    {item.role === 'user' ? 'OFFICER' : 'APEXFIN AI (MUSE SPARK)'}
                  </div>
                  <div className="whitespace-pre-wrap">{item.text}</div>
                </div>
              ))}
              {isChatting && (
                <div className="p-2 text-xs font-sans text-purple-400 animate-pulse">
                  Evaluating tokens via Merkle KV Cache Firewall...
                </div>
              )}
            </div>

            <form onSubmit={handleChat} className="mt-3 flex gap-2 pt-2 border-t border-slate-800/80">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Ask about liquidity, account balances, or compliance..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-sans text-white focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={isChatting}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-sans text-xs font-semibold transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Recent Ledger Settlements Table */}
        <div className="p-6 rounded-xl bg-[#0c1427] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Federal Settlement Ledger (Recent Transfers)
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter transactions..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5">TX ID</th>
                  <th className="pb-2.5">Source</th>
                  <th className="pb-2.5">Destination</th>
                  <th className="pb-2.5">Description</th>
                  <th className="pb-2.5">Amount ($)</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.slice(0, 8).map((tx) => (
                  <tr key={tx.tx_id} className="hover:bg-slate-900/50 text-slate-300">
                    <td className="py-2.5 text-cyan-400 font-semibold">{tx.tx_id}</td>
                    <td className="py-2.5">{tx.source_account}</td>
                    <td className="py-2.5">{tx.dest_account}</td>
                    <td className="py-2.5 text-slate-400">{tx.description}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">${tx.amount.toLocaleString()}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-medium">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info: Demonstrates real protected boundary */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Target Web Surface: <strong>ApexFin Federal Treasury</strong></span>
            <span>·</span>
            <span>Protected by: <strong>Karyon Air-Gapped Context Firewall</strong></span>
          </div>

          <div className="font-sans text-[11px] text-slate-500">
            Database: SQLite bank.db · Zero-403 Active
          </div>
        </div>
      </div>
    </div>
  );
};
