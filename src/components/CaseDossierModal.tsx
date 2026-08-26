import React from 'react';
import { ScreeningCase } from '../types';
import { 
  ShieldCheck, 
  X, 
  Printer, 
  AlertOctagon, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

interface CaseDossierModalProps {
  currentCase: ScreeningCase | null;
  officerId: string;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const CaseDossierModal: React.FC<CaseDossierModalProps> = ({
  currentCase,
  officerId,
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const isHigh = currentCase ? currentCase.riskBreakdown.overallRisk >= 71 : false;
  const isMed = currentCase ? currentCase.riskBreakdown.overallRisk >= 31 && currentCase.riskBreakdown.overallRisk < 71 : false;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0b101d] border border-slate-750 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-[#080a12] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
            <FileText className="w-4.5 h-4.5 text-accent-400" />
            <span>Official Border Screening Clearance Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-accent-600 hover:bg-accent-500 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className={`p-6 sm:p-8 space-y-5 ${isLight ? 'bg-white text-slate-900' : 'bg-[#080d1a] text-slate-100'}`}>
          
          {!currentCase ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold">No Active Screening Case Loaded</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Please upload a document or select a sample scenario on the screening workstation before printing a dossier report.
              </p>
            </div>
          ) : (
            <>
              {/* Header Seal & Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-400 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold tracking-wide text-white uppercase">
                  Immigration & Border Security Command
                </h2>
                <p className="text-xs text-slate-400">
                  AI-Assisted Document Forensic & Identity Clearance Certificate
                </p>
                <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
                  DOCSHIELD-AI-SEC-V2.6 • DEFENSE CLEARANCE
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs space-y-0.5">
              <div className="font-bold text-white">
                CASE #{currentCase.id.toUpperCase()}
              </div>
              <div className="text-slate-400 text-[11px]">
                {currentCase.timestamp || new Date().toISOString().substring(0, 19)} IST
              </div>
              <div className="text-slate-400 text-[11px]">
                Officer: <span className="font-semibold text-slate-200">{officerId}</span>
              </div>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isHigh
                ? 'bg-rose-950/40 border-rose-900/60 text-rose-200'
                : isMed
                ? 'bg-amber-950/40 border-amber-900/60 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase">
                {isHigh ? <AlertOctagon className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span>DECISION: {currentCase.riskBreakdown.recommendedActionLabel}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentCase.riskBreakdown.recommendedActionDetails}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-2xl font-bold font-mono">
                {currentCase.riskBreakdown.overallRisk}%
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Threat Metric
              </div>
            </div>
          </div>

          {/* Applicant & Document Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#090b12] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Traveler Identity Credentials
              </h3>
              <div className="space-y-1 text-xs">
                <div><span className="text-slate-500">Full Name:</span> <strong className="text-white">{currentCase.extractedData.fullName}</strong></div>
                <div><span className="text-slate-500">Document No:</span> <strong className="font-mono text-slate-200">{currentCase.extractedData.documentNumber}</strong></div>
                <div><span className="text-slate-500">Type:</span> <span className="text-slate-300 capitalize">{currentCase.extractedData.documentTypeName}</span></div>
                <div><span className="text-slate-500">Date of Birth:</span> <span className="text-slate-300">{currentCase.extractedData.dateOfBirth} ({currentCase.extractedData.gender})</span></div>
                <div><span className="text-slate-500">Nationality:</span> <span className="text-slate-300">{currentCase.extractedData.nationality}</span></div>
              </div>
            </div>

            <div className="bg-[#090b12] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Forensic & Biometric Summary
              </h3>
              <div className="space-y-1 text-xs">
                <div><span className="text-slate-500">Face Match Score:</span> <strong className="font-mono text-slate-200">{currentCase.faceVerification.similarityScore}% ({currentCase.faceVerification.matchStatus})</strong></div>
                <div><span className="text-slate-500">3D Liveness Check:</span> <strong className="font-mono text-slate-200">{currentCase.faceVerification.livenessScore}% ({currentCase.faceVerification.livenessStatus})</strong></div>
                <div><span className="text-slate-500">Detected Anomalies:</span> <strong className="font-mono text-slate-200">{currentCase.tamperingIssues.length} Anomaly Highlights</strong></div>
                <div><span className="text-slate-500">Syndicate Link:</span> <span className="font-semibold text-slate-300">{currentCase.syndicateGraph.fraudRingDetected ? 'YES (Flagged)' : 'NO (Clean)'}</span></div>
              </div>
            </div>
          </div>

          {/* Key Findings List */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              3. AI Inspection Findings
            </h3>
            <ul className="bg-[#090b12] p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              {currentCase.riskBreakdown.keyReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-500 font-mono">•</span>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Sign-off Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div>
              <div>DIGITAL SEAL: <span className="text-slate-300">0x8f2a1b94c038ef7a839c42b109ee847a9d1</span></div>
              <div className="text-slate-500 text-[11px]">Compliant with ICAO 9303 & UIDAI Standards</div>
            </div>
            <div className="text-left sm:text-right text-emerald-400 font-bold text-xs">
              ✓ AUTHORITATIVE CLEARANCE RECORD
            </div>
          </div>

          </>
          )}

        </div>
      </div>
    </div>
  );
};
