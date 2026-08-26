import React, { useState } from 'react';
import { ActionDecision, ScreeningCase } from '../types';
import {
  CheckCircle2, AlertTriangle, ShieldAlert, XOctagon,
  FileSignature, Save, Lock, Check, Tag,
} from 'lucide-react';

interface OfficerDecisionPanelProps {
  currentCase: ScreeningCase | null;
  officerId: string;
  onRecordDecision: (decision: ActionDecision, notes: string) => void;
  theme?: 'dark' | 'light';
}

export const OfficerDecisionPanel: React.FC<OfficerDecisionPanelProps> = ({
  currentCase,
  officerId,
  onRecordDecision,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [selectedDecision, setSelectedDecision] = useState<ActionDecision>(
    currentCase?.riskBreakdown?.recommendedAction || 'MANUAL_VERIFICATION'
  );
  const [notes, setNotes] = useState<string>(currentCase?.decisionState?.officerNotes || '');
  const [isSaved, setIsSaved] = useState<boolean>(Boolean(currentCase?.decisionState));

  const quickTags = [
    'All biometric and ICAO checks passed',
    'Laminate border splicing detected',
    'UIDAI Verhoeff checksum failure',
    'MRZ check digit mismatch',
    'BFS graph syndicate link found',
    'PAN fifth character initial mismatch',
  ];

  const handleAddTag = (tag: string) => {
    setNotes((prev) => (prev ? `${prev} | ${tag}` : tag));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!currentCase) return;
    onRecordDecision(selectedDecision, notes);
    setIsSaved(true);
  };

  const decisions = [
    {
      id: 'CLEAR_ENTRY' as ActionDecision,
      label: 'Clear Entry',
      range: '0–30 Risk',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'emerald',
      desc: 'Approve document and clear traveller through immigration.',
      btnId: 'btn-decision-clear',
    },
    {
      id: 'MANUAL_VERIFICATION' as ActionDecision,
      label: 'Manual Review',
      range: '31–70 Risk',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'amber',
      desc: 'Cross-examine traveller and inspect physical security features.',
      btnId: 'btn-decision-manual',
    },
    {
      id: 'SECONDARY_INSPECTION' as ActionDecision,
      label: 'Secondary Inspect',
      range: '71–85 Risk',
      icon: <ShieldAlert className="w-4 h-4" />,
      color: 'rose',
      desc: 'Escalate for forensic lab analysis and physical inspection.',
      btnId: 'btn-decision-secondary',
    },
    {
      id: 'DENY_ENTRY_DETAIN' as ActionDecision,
      label: 'Deny / Detain',
      range: '86–100 Risk',
      icon: <XOctagon className="w-4 h-4" />,
      color: 'rose',
      desc: 'High-risk identity breach. Hold and alert cyber intelligence.',
      btnId: 'btn-decision-detain',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    rose: 'text-rose-500',
  };

  const activeBorderMap: Record<string, string> = {
    emerald: 'border-emerald-500 ring-2 ring-emerald-500/30',
    amber: 'border-amber-500 ring-2 ring-amber-500/30',
    rose: 'border-rose-500 ring-2 ring-rose-500/30',
  };

  const rangeBgMap: Record<string, string> = {
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-800/50',
  };

  return (
    <div className={`surface-card rounded-3xl p-6 sm:p-8 border shadow-lg ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
    }`}>

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Officer Decision Panel</h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Human-in-the-loop with cryptographic audit logging</p>
          </div>
        </div>
      </div>

      {/* Decision grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {decisions.map((d) => {
          const isSelected = selectedDecision === d.id;
          return (
            <button
              key={d.id}
              type="button"
              id={d.btnId}
              disabled={!currentCase}
              onClick={() => { setSelectedDecision(d.id); setIsSaved(false); }}
              className={`p-4.5 rounded-2xl border text-left transition-all flex flex-col gap-2.5 ${
                !currentCase
                  ? isLight ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed' : 'bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? `${isLight ? 'bg-slate-50' : 'bg-slate-800/80'} ${activeBorderMap[d.color]}`
                  : isLight
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100 cursor-pointer'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 text-sm font-bold ${isSelected ? colorMap[d.color] : isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {d.icon}
                  {d.label}
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${rangeBgMap[d.color]}`}>
                  {d.range}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{d.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Quick tags */}
      <div className="mb-6">
        <div className={`text-xs font-semibold mb-2.5 flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <Tag className="w-3.5 h-3.5 text-accent-500" />
          Quick justification tags:
        </div>
        <div className="flex flex-wrap gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              disabled={!currentCase}
              onClick={() => handleAddTag(tag)}
              className={`text-xs px-3.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                !currentCase
                  ? isLight ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes & submit */}
      <div className={`border rounded-2xl p-5 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
      }`}>
        <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Officer Notes & Justification
        </label>
        <textarea
          id="officer-decision-notes"
          rows={3}
          disabled={!currentCase}
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setIsSaved(false); }}
          placeholder={currentCase ? "Enter detailed justification for the screening outcome…" : "No document loaded. Upload or select a scenario to record decision notes."}
          className={`w-full border rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none ${
            isLight ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
          }`}
        />
        <div className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Digital Signature: <strong className={isLight ? 'text-slate-800' : 'text-white'}>SHA256-ECDSA</strong></span>
          </div>
          <button
            type="button"
            id="btn-sign-and-save-decision"
            disabled={!currentCase}
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md ${
              !currentCase
                ? isLight ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : isSaved
                ? 'bg-emerald-700 text-white cursor-pointer'
                : 'bg-accent-600 hover:bg-accent-500 text-white cursor-pointer'
            }`}
          >
            {isSaved ? (
              <><Check className="w-4 h-4" /><span>Decision Committed</span></>
            ) : (
              <><Save className="w-4 h-4" /><span>Commit to Audit Trail</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
