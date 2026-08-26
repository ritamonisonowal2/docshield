import React from 'react';
import { ScreeningCase } from '../types';
import { PRESET_SCENARIOS } from '../data/mockScenarios';
import {
  AlertOctagon, CheckCircle2, UploadCloud, User,
} from 'lucide-react';

interface ScenarioSelectorProps {
  currentCaseId: string | null;
  onSelectScenario: (scenario: ScreeningCase) => void;
  isCustomUpload: boolean;
  onSelectCustomMode: () => void;
  theme?: 'dark' | 'light';
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentCaseId,
  onSelectScenario,
  isCustomUpload,
  onSelectCustomMode,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const currentScenario = currentCaseId ? PRESET_SCENARIOS.find((s) => s.id === currentCaseId) : null;
  const risk = currentScenario ? currentScenario.riskBreakdown.overallRisk : 0;
  const isHighRisk = risk >= 71;
  const isMedRisk = risk >= 31 && risk < 71;

  const scenarioLabels: Record<string, string> = {
    'CASE-2026-IND-8821': 'Photo Splicing + MRZ Error',
    'CASE-2026-AAD-9042': 'Verhoeff D5 Checksum Failure',
    'CASE-2026-PAN-4190': 'PAN Syntax + Altered Stamp',
    'CASE-2026-GEN-1004': '100% Genuine — Fast-Track Clearance',
  };

  const scenarioDisplayNames: Record<string, string> = {
    'CASE-2026-IND-8821': 'Subject A',
    'CASE-2026-AAD-9042': 'Subject B',
    'CASE-2026-PAN-4190': 'Subject C',
    'CASE-2026-GEN-1004': 'Subject D',
  };

  return (
    <div className={`surface-card rounded-3xl p-6 sm:p-8 border shadow-lg space-y-6 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
    }`}>

      {/* Active case header */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${
            isLight ? 'border-slate-200 bg-slate-100' : 'border-slate-700 bg-slate-900'
          }`}>
            {isCustomUpload || !currentScenario ? (
              <User className="w-7 h-7 text-accent-500" />
            ) : (
              <img
                src={currentScenario.livePersonImageUrl || currentScenario.documentImageUrl}
                alt="Subject"
                className="w-full h-full object-cover rounded-2xl"
              />
            )}
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className={`text-lg sm:text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isCustomUpload
                  ? 'Live Upload Session'
                  : currentScenario
                  ? scenarioDisplayNames[currentScenario.id] || 'Subject'
                  : 'Awaiting Document Input'}
              </h1>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded-lg border uppercase ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {currentScenario ? currentScenario.documentType : 'NO DATA'}
              </span>
              {currentScenario ? (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 border ${
                    isHighRisk || isMedRisk
                      ? 'bg-rose-950/50 text-rose-300 border-rose-800/60'
                      : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                  }`}
                >
                  {isHighRisk || isMedRisk ? (
                    <AlertOctagon className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {risk}% Risk · {currentScenario.riskBreakdown.riskTier}
                </span>
              ) : (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                  isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  Awaiting Analysis
                </span>
              )}
            </div>
            <p className={`text-xs font-mono truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Doc: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>
                {currentScenario ? currentScenario.extractedData.documentNumber : '----------------'}
              </strong>
              <span className="mx-2 opacity-50">·</span>
              {isCustomUpload
                ? 'Custom Upload Mode'
                : currentScenario
                ? currentScenario.title
                : 'Select a sample scenario or upload a document to launch forensic screening.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-select-custom-upload"
          onClick={onSelectCustomMode}
          className={`shrink-0 px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
            isCustomUpload
              ? 'bg-accent-600 text-white border-accent-500 shadow-md'
              : isLight
              ? 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <UploadCloud className="w-4.5 h-4.5" />
          <span>Upload Custom Document</span>
        </button>
      </div>

      {/* Preset scenario picker */}
      <div>
        <p className="text-xs font-mono font-bold text-accent-500 uppercase tracking-widest mb-3.5">
          Sample Test Scenarios
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_SCENARIOS.map((scenario) => {
            const isSelected = !isCustomUpload && currentCaseId === scenario.id;
            const isHigh = scenario.riskBreakdown.overallRisk >= 71;
            const displayName = scenarioDisplayNames[scenario.id] || 'Subject';

            return (
              <button
                key={scenario.id}
                id={`preset-case-${scenario.id}`}
                onClick={() => onSelectScenario(scenario)}
                className={`p-4.5 rounded-2xl text-left transition-all border flex flex-col gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-accent-600/10 border-accent-500 ring-2 ring-accent-500/30'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border uppercase ${
                    isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {scenario.documentType}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    isHigh
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                  }`}>
                    {scenario.riskBreakdown.overallRisk}%
                  </span>
                </div>
                <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{displayName}</div>
                <div className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {scenarioLabels[scenario.id] || scenario.title}
                </div>
                <div className={`flex items-center justify-between pt-2 border-t text-xs font-mono ${
                  isLight ? 'border-slate-200 text-slate-400' : 'border-slate-800 text-slate-500'
                }`}>
                  <span>{scenario.extractedData.documentNumber}</span>
                  {isSelected && <span className="text-accent-500 font-bold text-[10px] tracking-wider">ACTIVE</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
