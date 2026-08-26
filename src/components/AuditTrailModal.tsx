import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { History, Search, Filter, Lock } from 'lucide-react';

interface AuditTrailModalProps {
  logs: AuditLogEntry[];
  onSelectCaseNumber?: (docNum: string) => void;
  theme?: 'dark' | 'light';
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ logs, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');

  const filteredLogs = logs.filter((entry) => {
    const matchesSearch =
      entry.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.officerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'ALL' || entry.riskTier === filterTier;
    return matchesSearch && matchesTier;
  });

  const decisionColor = (d: string) => {
    if (d === 'CLEAR_ENTRY') return 'text-emerald-400';
    if (d === 'MANUAL_VERIFICATION') return 'text-amber-400';
    if (d === 'SECONDARY_INSPECTION') return 'text-orange-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className={`surface-card rounded-3xl p-6 sm:p-8 border shadow-lg ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-accent-950/50 border-accent-800/40 text-accent-400'
            }`}>
              <History className="w-3.5 h-3.5 text-accent-500" />
              <span>CRYPTOGRAPHIC IMMUTABLE LEDGER</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Audit Trail</h1>
            <p className={`text-sm max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Tamper-evident verification ledger with SHA256-ECDSA cryptographic hashes for all officer decisions.
            </p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-800/60 border-slate-700 text-slate-300'
          }`}>
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>{logs.length} Signed Records</span>
          </div>
        </div>
      </div>

      {/* Empty state — no logs yet */}
      {logs.length === 0 ? (
        <div className={`surface-card rounded-3xl border flex flex-col items-center justify-center py-24 px-8 text-center ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#161b27] border-slate-800'
        }`}>
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-800/60 border-slate-700 text-slate-500'
          }`}>
            <History className="w-10 h-10" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            No Audit Records Yet
          </h3>
          <p className={`text-sm max-w-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Audit entries will appear here after officer decisions are made on screened documents. Upload and analyse a document to get started.
          </p>
        </div>
      ) : (
        <div className={`surface-card rounded-3xl p-6 sm:p-8 border shadow-lg space-y-5 ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
        }`}>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doc number or officer ID…"
                className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-4 h-4 text-slate-500 mr-1" />
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setFilterTier(tier)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterTier === tier
                      ? 'bg-accent-600 text-white shadow-sm'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className={`overflow-x-auto rounded-2xl border ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0f1117]'
          }`}>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`text-xs font-semibold tracking-wider border-b ${
                isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Document</th>
                  <th className="py-3.5 px-4">Risk</th>
                  <th className="py-3.5 px-4">Decision</th>
                  <th className="py-3.5 px-4">Hash</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono text-xs ${
                isLight ? 'divide-slate-200' : 'divide-slate-800'
              }`}>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 italic font-sans text-sm">
                      No entries match your search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((entry) => {
                    const isHigh = entry.riskTier === 'HIGH';
                    const isMed = entry.riskTier === 'MEDIUM';
                    return (
                      <tr key={entry.id} className={`transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/30'
                      }`}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-accent-500">{entry.id}</div>
                          <div className={`font-sans mt-0.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{entry.timestamp}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className={`font-bold font-sans text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{entry.documentNumber}</div>
                          <span className={`text-[10px] px-2 py-0.5 rounded border uppercase inline-block mt-1 ${
                            isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                            {entry.documentType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-block ${
                            isHigh
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                              : isMed
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                          }`}>
                            {entry.overallRisk}% · {entry.riskTier}
                          </span>
                          <div className={`font-sans mt-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            Face: {entry.faceMatchPercent}% · Tamper: {entry.tamperingDetectedCount}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-bold font-sans text-xs block ${decisionColor(entry.decision)}`}>
                            {entry.decision.replace(/_/g, ' ')}
                          </span>
                          {entry.decisionNotes && (
                            <span className={`font-sans text-[11px] line-clamp-1 mt-0.5 max-w-[220px] block ${
                              isLight ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              {entry.decisionNotes}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className={`font-bold text-[11px] ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{entry.officerId}</div>
                          <div className="text-slate-400 truncate max-w-[140px] mt-0.5 text-[10px]" title={entry.cryptographicHash}>
                            {entry.cryptographicHash}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
