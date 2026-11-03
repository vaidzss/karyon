import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  ArrowUpRight,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Bot,
  RefreshCw,
  Wallet,
  TrendingUp,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface Account {
  account_number: string;
  customer_name: string;
  account_type: string;
  balance: number;
  currency: string;
  routing_number: string;
  status: string;
  created_at: string;
}

interface Transaction {
  tx_id: string;
  source_account: string;
  dest_account: string;
  amount: number;
  currency: string;
  description: string;
  tx_type: string;
  timestamp: string;
  status: string;
}

const API_BASE = 'http://127.0.0.1:8000/target/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transfers' | 'ledger' | 'advisor'>('overview');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Wire Transfer Form State
  const [sourceAccount, setSourceAccount] = useState<string>('');
  const [destAccount, setDestAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [transferStatus, setTransferStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // AI Financial Advisor State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: 'Good morning. I am your ApexFin Treasury Copilot. I can analyze liquidity positions, verify compliance limits, or summarize counterparty settlement flows. How may I assist your treasury operations today?',
      time: '09:00 AM'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Fetch accounts and transactions
  const loadData = useCallback(async () => {
    try {
      const [accRes, txRes] = await Promise.all([
        fetch(`${API_BASE}/accounts`, {
          headers: { 'X-Karyon-Session': 'corporate_treasury_cfo' }
        }),
        fetch(`${API_BASE}/transactions`, {
          headers: { 'X-Karyon-Session': 'corporate_treasury_cfo' }
        })
      ]);

      if (accRes.ok && txRes.ok) {
        const accJson = await accRes.json();
        const txJson = await txRes.json();
        const accData: Account[] = Array.isArray(accJson) ? accJson : (accJson.accounts || []);
        const txData: Transaction[] = Array.isArray(txJson) ? txJson : (txJson.transactions || []);
        setAccounts(accData);
        setTransactions(txData);
        if (accData.length > 0 && !sourceAccount) {
          setSourceAccount(accData[0].account_number);
          setDestAccount(accData[1]?.account_number || 'ACC-882191');
        }
      }
    } catch (err) {
      console.error('Failed to load bank records:', err);
    } finally {
      setLoading(false);
    }
  }, [sourceAccount]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleWireTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferStatus(null);
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setTransferStatus({ type: 'error', message: 'Please enter a valid transfer amount.' });
      return;
    }

    const selectedAcc = accounts.find(a => a.account_number === sourceAccount);
    if (selectedAcc && numAmount > selectedAcc.balance) {
      setTransferStatus({
        type: 'error',
        message: `Insufficient liquidity. Available balance: $${selectedAcc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Karyon-Session': 'corporate_treasury_cfo'
        },
        body: JSON.stringify({
          source_account: sourceAccount,
          dest_account: destAccount,
          amount: numAmount,
          currency: 'USD',
          memo: description || 'Corporate Interbank Wire'
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'SETTLED') {
        setTransferStatus({
          type: 'success',
          message: `Wire transfer ${data.tx_id} executed successfully. Settled via Fedwire clearing.`
        });
        setAmount('');
        setDescription('');
        await loadData();
      } else {
        setTransferStatus({
          type: 'error',
          message: data.detail || 'Transfer authorization failed.'
        });
      }
    } catch (err: any) {
      setTransferStatus({ type: 'error', message: 'Network or gateway connectivity error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAiLoading) return;

    const userText = inputQuery.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInputQuery('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setIsAiLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Karyon-Session': 'corporate_treasury_cfo'
        },
        body: JSON.stringify({
          prompt: userText,
          session_id: 'corporate_treasury_cfo',
          account_number: sourceAccount || 'ACC-882190'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.reply || 'Request completed with zero detected anomalies.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: 'I am temporarily unable to consult the financial ledger. Please retry shortly.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Advisory connection error. Please verify backend service availability.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const totalBalance = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F9FAFB] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Institutional Top Navigation Header */}
      <header className="bg-[#111827] border-b border-[#1F2937] px-6 lg:px-10 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-white tracking-tight">ApexFin</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1F2937] text-[#9CA3AF] border border-[#374151]">
                  Treasury
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280]">Institutional Banking &amp; Liquidity Portal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0A0E17] p-1 rounded-lg border border-[#1F2937]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'transfers'
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Wire Transfers
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'ledger'
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Settlement Ledger
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Treasury AI</span>
            </button>
          </nav>
        </div>

        {/* User Profile on Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-medium text-white flex items-center justify-end gap-1">
              <span>Dr. Elena Rostova</span>
              <UserCheck className="w-3.5 h-3.5 text-[#059669]" />
            </div>
            <div className="text-[11px] text-[#6B7280]">VP Corporate Treasury · Apex Holdings</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1F2937] border border-[#374151] flex items-center justify-center text-xs font-semibold text-white">
            ER
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* TAB 1: Treasury Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Liquidity Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span>Total Liquid Reserves</span>
                  <Wallet className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="text-3xl font-bold text-white tabular-nums">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#059669]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+2.4% vs previous clearing cycle</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span>Fedwire Daily Clearing Limit</span>
                  <CreditCard className="w-4 h-4 text-[#059669]" />
                </div>
                <div className="text-3xl font-bold text-white tabular-nums">$100,000,000.00</div>
                <div className="text-xs text-[#9CA3AF]">Available Headroom: $95,149,750.00</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span>Federal Clearing Node</span>
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                </div>
                <div className="text-xl font-bold text-white tracking-wide">FED-NY-NODE-04</div>
                <div className="text-xs text-[#9CA3AF]">Settlement Window: Active (09:00 - 17:00 EST)</div>
              </div>
            </div>

            {/* Operating Accounts Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Institutional Operating Accounts</h2>
                  <p className="text-xs text-[#9CA3AF]">FDIC insured commercial treasury accounts under multi-currency sweep.</p>
                </div>
                <button
                  onClick={() => setActiveTab('transfers')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Initiate Wire Transfer</span>
                </button>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-[#6B7280]">
                  Loading institutional accounts...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {accounts.map(account => (
                    <div
                      key={account.account_number}
                      className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-colors space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">{account.customer_name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                            {account.status}
                          </span>
                        </div>

                        <div>
                          <div className="text-[11px] text-[#6B7280]">Account Balance ({account.currency})</div>
                          <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
                            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#1F2937] space-y-1.5 text-xs text-[#9CA3AF]">
                        <div className="flex items-center justify-between">
                          <span>Account Number:</span>
                          <button
                            onClick={() => copyToClipboard(account.account_number, account.account_number)}
                            className="text-white tabular-nums flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                            title="Copy Account Number"
                          >
                            <span>{account.account_number}</span>
                            {copiedAccount === account.account_number ? (
                              <Check className="w-3 h-3 text-[#059669]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#6B7280]" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Routing Number:</span>
                          <span className="tabular-nums text-[#F9FAFB]">{account.routing_number}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Account Type:</span>
                          <span className="text-white">{account.account_type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Settlements Preview Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Recent Fedwire Settlements</h3>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="text-xs text-[#2563EB] hover:underline"
                >
                  View Full Ledger
                </button>
              </div>

              <div className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0E17] text-[#9CA3AF] text-[10px] uppercase tracking-wider border-b border-[#1F2937]">
                    <tr>
                      <th className="py-3 px-4">TX ID</th>
                      <th className="py-3 px-4">Source Account</th>
                      <th className="py-3 px-4">Destination Account</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Amount (USD)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2937]">
                    {transactions.slice(0, 4).map(tx => (
                      <tr key={tx.tx_id} className="hover:bg-[#182133] transition-colors">
                        <td className="py-3 px-4 text-white tabular-nums font-medium">{tx.tx_id}</td>
                        <td className="py-3 px-4 text-[#9CA3AF] tabular-nums">{tx.source_account}</td>
                        <td className="py-3 px-4 text-[#9CA3AF] tabular-nums">{tx.dest_account}</td>
                        <td className="py-3 px-4 text-white">{tx.description}</td>
                        <td className="py-3 px-4 text-right text-[#059669] tabular-nums font-medium">
                          ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Wire Transfers Form */}
        {activeTab === 'transfers' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Execute Fedwire Interbank Transfer</h2>
              <p className="text-xs text-[#9CA3AF]">
                Same-day irrevocable settlement through the Federal Reserve National Settlement Service.
              </p>
            </div>

            {transferStatus && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  transferStatus.type === 'success'
                    ? 'bg-[#059669]/10 border-[#059669]/30 text-[#059669]'
                    : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
                }`}
              >
                {transferStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{transferStatus.type === 'success' ? 'Settlement Confirmed' : 'Transfer Authorization Error'}</div>
                  <div className="text-[#9CA3AF] mt-0.5">{transferStatus.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleWireTransfer} className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                  Source Treasury Account
                </label>
                <select
                  value={sourceAccount}
                  onChange={e => setSourceAccount(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                >
                  {accounts.map(acc => (
                    <option key={acc.account_number} value={acc.account_number}>
                      {acc.account_number} — {acc.customer_name} (${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                  Beneficiary Destination Account
                </label>
                <input
                  type="text"
                  value={destAccount}
                  onChange={e => setDestAccount(e.target.value)}
                  placeholder="ACC-882191"
                  required
                  className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#9CA3AF]">Transfer Amount (USD)</label>
                  <div className="flex gap-2">
                    {['50000', '250000', '1000000'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
                      >
                        ${parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-[#6B7280] text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="250000.00"
                    required
                    className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                  Fedwire Memo / Purpose
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Corporate Treasury Sweep / Interbank Liquidity"
                  className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#1F2937] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Clearing Transfer via Fedwire...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Authorize &amp; Execute Wire Transfer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Transactions Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Fedwire Settlement Ledger</h2>
              <p className="text-xs text-[#9CA3AF]">Real-time record of settled transactions across all accounts.</p>
            </div>

            <div className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0E17] text-[#9CA3AF] text-[10px] uppercase tracking-wider border-b border-[#1F2937]">
                  <tr>
                    <th className="py-3 px-4">TX ID</th>
                    <th className="py-3 px-4">Source Account</th>
                    <th className="py-3 px-4">Destination Account</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Amount (USD)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {transactions.map(tx => (
                    <tr key={tx.tx_id} className="hover:bg-[#182133] transition-colors">
                      <td className="py-3 px-4 text-white tabular-nums font-medium">{tx.tx_id}</td>
                      <td className="py-3 px-4 text-[#9CA3AF] tabular-nums">{tx.source_account}</td>
                      <td className="py-3 px-4 text-[#9CA3AF] tabular-nums">{tx.dest_account}</td>
                      <td className="py-3 px-4 text-white">{tx.description}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#1F2937] text-[#9CA3AF]">
                          {tx.tx_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6B7280]">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#059669] tabular-nums">
                        ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: AI Financial Advisor */}
        {activeTab === 'advisor' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#2563EB]" />
                <span>ApexFin Institutional Financial Assistant</span>
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                Automated treasury advisor for liquidity position summaries and counterparty flow verification.
              </p>
            </div>

            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl h-[480px] flex flex-col overflow-hidden">
              {/* Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-[#6B7280] mb-1 px-1">
                      {msg.sender === 'user' ? 'You (Treasury Controller)' : 'ApexFin Advisor'} · {msg.time}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#2563EB] text-white rounded-br-none shadow-sm'
                          : 'bg-[#182133] text-[#F9FAFB] rounded-bl-none border border-[#1F2937]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                    <span>Analyzing liquidity positions and compiling financial recommendation...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAiChatSubmit} className="p-3 bg-[#0A0E17] border-t border-[#1F2937] flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  placeholder="Ask advisor: e.g. 'Summarize total liquidity across all accounts' or 'What is our largest wire transfer?'"
                  className="flex-1 bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !inputQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-[#1F2937] bg-[#111827] py-6 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2563EB]" />
            <span className="text-[#9CA3AF] font-medium">ApexFin Institutional Trust N.A.</span>
            <span>· Member FDIC</span>
            <span>· Fedwire Participant APEX-NY-0210</span>
          </div>
          <p>© 2026 Apex Global Holdings. All rights reserved. 256-bit TLS encrypted session.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
