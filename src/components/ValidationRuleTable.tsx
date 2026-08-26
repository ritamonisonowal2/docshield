import React, { useState } from 'react';
import { 
  ValidationCheck, 
  ExtractedDocData 
} from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ValidationRuleTableProps {
  checks: ValidationCheck[];
  extractedData?: ExtractedDocData;
  onOpenVerhoeffModal?: () => void;
  isPiiMasked?: boolean;
  theme?: 'dark' | 'light';
}

export const ValidationRuleTable: React.FC<ValidationRuleTableProps> = ({
  checks,
  extractedData,
  onOpenVerhoeffModal,
  isPiiMasked = false,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'warning' | 'fail'>('all');

  const toggleExpand = (id: string) => {
    setExpandedCheckId(prev => (prev === id ? null : id));
  };

  const renderMaskedValue = (value: string) => {
    if (!isPiiMasked || !value) return value;
    if (value.includes('14/06/1998') || value.includes('1988') || value.includes('1998') || /\d{2}\/\d{2}\/\d{4}/.test(value)) {
      return <span className={`select-none rounded px-2 py-0.5 font-mono text-xs ${isLight ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-transparent'}`}>██/██/████</span>;
    }
    if (/^[A-Z][0-9]{7}$/.test(value.trim()) || value.includes('K4892014') || value.includes('N1938472')) {
      return <span className={`select-none rounded px-2 py-0.5 font-mono text-xs ${isLight ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-transparent'}`}>████████</span>;
    }
    if (value.includes('8942 5013 7798') || value.includes('894250137798') || /^\d{12}$/.test(value.trim())) {
      return <span className={`select-none rounded px-2 py-0.5 font-mono text-xs ${isLight ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-transparent'}`}>████ ████ ████</span>;
    }
    if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.trim())) {
      return <span className={`select-none rounded px-2 py-0.5 font-mono text-xs ${isLight ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-transparent'}`}>██████████</span>;
    }
    return value;
  };

  const getCategoryIcon = (cat: ValidationCheck['category']) => {
    switch (cat) {
      case 'checksum':
        return <Cpu className="w-4.5 h-4.5 text-accent-500" />;
      case 'format':
        return <FileText className={`w-4.5 h-4.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />;
      case 'date':
        return <Calendar className={`w-4.5 h-4.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />;
      case 'security':
      case 'watchlist':
      default:
        return <ShieldCheck className={`w-4.5 h-4.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />;
    }
  };

  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  const filteredChecks = checks.filter(c => {
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className={`surface-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full border shadow-xl ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
    }`}>
      <div>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Extracted Data & Deterministic Rule Engine
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Polynomial checksums, format regex & chronology verifications
              </p>
            </div>
          </div>

          {/* Status Counter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter(statusFilter === 'fail' ? 'all' : 'fail')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === 'fail'
                  ? 'bg-rose-900 text-rose-100 border-rose-600 shadow'
                  : 'bg-rose-950/60 text-rose-200 border-rose-800 hover:bg-rose-900/60'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{failCount} Fail</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'warning' ? 'all' : 'warning')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === 'warning'
                  ? 'bg-amber-900 text-amber-100 border-amber-600 shadow'
                  : 'bg-amber-950/60 text-amber-200 border-amber-800 hover:bg-amber-900/60'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{warnCount} Warn</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'pass' ? 'all' : 'pass')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === 'pass'
                  ? 'bg-emerald-900 text-emerald-100 border-emerald-600 shadow'
                  : 'bg-emerald-950/60 text-emerald-200 border-emerald-800 hover:bg-emerald-900/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{passCount} Pass</span>
            </button>
          </div>
        </div>

        {/* Extracted Metadata Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4.5 rounded-2xl border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
        }`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Full Name
            </span>
            <span className={`text-sm font-bold truncate block mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isPiiMasked ? '████████████' : (extractedData?.fullName || 'N/A')}
            </span>
          </div>

          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Document Number
            </span>
            <span className={`text-sm font-mono font-bold block mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isPiiMasked ? '████████' : (extractedData?.documentNumber || 'N/A')}
            </span>
          </div>

          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Date of Birth
            </span>
            <span className={`text-sm font-semibold block mt-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {isPiiMasked ? '██/██/████' : extractedData?.dateOfBirth ? `${extractedData.dateOfBirth} ${extractedData.age ? `(${extractedData.age} yrs)` : ''}` : 'N/A'}
            </span>
          </div>

          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Nationality / Sex
            </span>
            <span className={`text-sm font-semibold block mt-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {extractedData?.nationality || 'N/A'} • {extractedData?.gender || 'N/A'}
            </span>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'checksum', 'format', 'date', 'watchlist'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                filterCategory === cat
                  ? 'bg-accent-600 text-white border-accent-500 shadow'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-[#0a0d16] text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Algorithmic Checks List */}
        {filteredChecks.length === 0 ? (
          <div className={`p-6 rounded-2xl border text-center text-xs font-mono ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0a0d16] border-slate-800 text-slate-400'
          }`}>
            No validation rules evaluated yet. Select a sample scenario or upload a document scan to run checks.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChecks.map((check) => {
              const isExpanded = expandedCheckId === check.id;
              const isWarn = check.status === 'warning';
              const isFail = check.status === 'fail';

              return (
                <div
                  key={check.id}
                  className={`rounded-2xl border transition-all ${
                    isFail
                      ? 'bg-rose-950/20 border-rose-900/60'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-900/60'
                      : isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#0a0d16] border-slate-800'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(check.id)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        {getCategoryIcon(check.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{check.title}</span>
                          <span className={`text-[10.5px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>[{check.category}]</span>
                        </div>
                        <div className={`text-xs truncate mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          {check.reason}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase border ${
                          isFail
                            ? 'bg-rose-950/70 text-rose-200 border-rose-800'
                            : isWarn
                            ? 'bg-amber-950/70 text-amber-200 border-amber-800'
                            : 'bg-emerald-950/70 text-emerald-200 border-emerald-800'
                        }`}
                      >
                        {isFail ? <XCircle className="w-3.5 h-3.5 text-rose-400" /> : isWarn ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{check.status}</span>
                      </span>

                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && (
                    <div className={`px-4 pb-4 pt-2 border-t text-xs sm:text-sm space-y-2.5 ${
                      isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-200'
                    }`}>
                      <div className={`p-3 rounded-xl border font-mono text-xs space-y-1.5 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#090b12] border-slate-800'
                      }`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Value Tested:</span> 
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{renderMaskedValue(check.valueTested)}</span>
                        </div>
                        {check.expectedPattern && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Expected:</span> 
                            <span className="text-accent-500 font-bold">{check.expectedPattern}</span>
                          </div>
                        )}
                      </div>

                      {check.details && (
                        <p className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#090b12] border-slate-800 text-slate-200'
                        }`}>
                          {check.details}
                        </p>
                      )}

                      {onOpenVerhoeffModal && (
                        <button
                          type="button"
                          onClick={onOpenVerhoeffModal}
                          className="text-xs text-accent-500 hover:text-accent-600 font-bold flex items-center gap-1.5 pt-1 cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open Rule Sandbox</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Helper */}
      <div className={`pt-4 mt-5 border-t text-xs flex items-center justify-between font-mono ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
      }`}>
        <span>Deterministic Mathematical Engine</span>
        <span className="text-emerald-500 font-bold">{checks.length > 0 ? `${passCount}/${checks.length} Passed` : 'Ready'}</span>
      </div>
    </div>
  );
};
