import React from 'react';
import { RiskScoreBreakdown } from '../types';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Scale 
} from 'lucide-react';

interface RiskScoreGaugeProps {
  risk: RiskScoreBreakdown;
  applicantName: string;
  theme?: 'dark' | 'light';
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  risk,
  applicantName,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const hasRisk = risk.overallRisk > 0;
  const isHigh = risk.overallRisk >= 71;
  const isMed = risk.overallRisk >= 31 && risk.overallRisk < 71;
  const isLow = hasRisk && risk.overallRisk < 31;

  // Semicircle needle calculation: 0 = -90deg, 100 = 90deg
  const needleRotation = -90 + (risk.overallRisk / 100) * 180;

  return (
    <div className={`surface-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full border shadow-lg ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
    }`}>
      
      <div>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Composite Threat & Risk Metric
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Multi-factor fusion of biometrics, OCR, and rules
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-lg uppercase border ${
              !hasRisk
                ? isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
                : isHigh
                ? 'bg-rose-950/70 text-rose-200 border-rose-800'
                : isMed
                ? 'bg-amber-950/70 text-amber-200 border-amber-800'
                : 'bg-emerald-950/70 text-emerald-200 border-emerald-800'
            }`}
          >
            {hasRisk ? `${risk.riskTier} RISK (${risk.overallRisk}/100)` : 'AWAITING EVALUATION'}
          </span>
        </div>

        {/* Speedometer Semicircle Gauge */}
        <div className="flex flex-col items-center justify-center my-3 relative">
          <svg 
            viewBox="0 0 200 120" 
            className="w-64 h-36 mx-auto overflow-visible select-none"
            aria-label="Risk Score Gauge"
          >
            {/* Background Track */}
            <path
              d="M 24 100 A 76 76 0 0 1 176 100"
              fill="none"
              stroke={isLight ? "#e2e8f0" : "#1e293b"}
              strokeWidth="13"
              strokeLinecap="round"
            />

            {/* Green Zone (Low: 0-30) */}
            <path
              d="M 24 100 A 76 76 0 0 1 55.33 38.52"
              fill="none"
              stroke="#10b981"
              strokeWidth="13"
              strokeLinecap="round"
              opacity={isLow ? "1" : "0.3"}
            />

            {/* Amber Zone (Med: 31-70) */}
            <path
              d="M 55.33 38.52 A 76 76 0 0 1 144.67 38.52"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="13"
              opacity={isMed ? "1" : "0.3"}
            />

            {/* Red Zone (High: 71-100) */}
            <path
              d="M 144.67 38.52 A 76 76 0 0 1 176 100"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="13"
              strokeLinecap="round"
              opacity={isHigh ? "1" : "0.3"}
            />

            {/* Pivot Center Point */}
            <circle cx="100" cy="100" r="7.5" fill={isLight ? "#ffffff" : "#0b101d"} stroke={isLight ? "#94a3b8" : "#cbd5e1"} strokeWidth="2.5" />

            {/* Needle Line */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="34"
              stroke={!hasRisk ? "#94a3b8" : isHigh ? "#f43f5e" : isMed ? "#f59e0b" : "#10b981"}
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${needleRotation} 100 100)`}
              className="transition-transform duration-500 ease-out"
            />

            {/* Ticks */}
            <text x="24" y="118" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">0 (CLEAR)</text>
            <text x="100" y="20" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">50 (EVAL)</text>
            <text x="176" y="118" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">100 (THREAT)</text>
          </svg>

          {/* Large Center Readout */}
          <div className="text-center -mt-2 mb-4">
            <div className={`text-4xl font-extrabold font-mono tracking-tight ${
              !hasRisk ? isLight ? 'text-slate-400' : 'text-slate-500' : isHigh ? 'text-rose-500' : isMed ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {hasRisk ? risk.overallRisk : '--'}<span className={`text-base font-sans font-normal ${isLight ? 'text-slate-400' : 'text-slate-500'}`}> / 100</span>
            </div>
            <span className={`text-xs uppercase font-mono tracking-wider font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Threat Score Metric
            </span>
          </div>
        </div>

        {/* Weighted Sub-Score Progress Bars */}
        <div className={`space-y-3.5 mb-6 p-4.5 rounded-2xl border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
        }`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            <Scale className="w-4 h-4 text-accent-500" />
            <span>Weighted Component Breakdown</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>Face Match Similarity (35%)</span>
              <span className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{risk.faceMatchScore || 0}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
              <div className="h-full bg-accent-600 rounded-full" style={{ width: `${risk.faceMatchScore || 0}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>Document Authenticity (20%)</span>
              <span className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{risk.documentAuthenticityScore || 0}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
              <div className="h-full bg-accent-600 rounded-full" style={{ width: `${risk.documentAuthenticityScore || 0}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>Document Validity & Checksums (20%)</span>
              <span className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{risk.documentValidityScore || 0}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
              <div className="h-full bg-accent-600 rounded-full" style={{ width: `${risk.documentValidityScore || 0}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>Biometric Liveness (20%)</span>
              <span className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{risk.faceLivenessScore || 0}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
              <div className="h-full bg-accent-600 rounded-full" style={{ width: `${risk.faceLivenessScore || 0}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Operational Action Box */}
      <div className={`p-4.5 rounded-2xl border flex flex-col justify-between ${
        !hasRisk
          ? isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
          : isHigh
          ? 'bg-rose-950/40 border-rose-900/60 text-rose-200'
          : isMed
          ? 'bg-amber-950/40 border-amber-900/60 text-amber-200'
          : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
      }`}>
        <div className="flex items-center gap-2.5 mb-1.5">
          {!hasRisk ? (
            <Scale className="w-4.5 h-4.5 text-slate-400" />
          ) : isHigh ? (
            <AlertOctagon className="w-4.5 h-4.5 text-rose-400" />
          ) : isMed ? (
            <ShieldAlert className="w-4.5 h-4.5 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          )}
          <span className={`text-sm font-extrabold uppercase tracking-wider ${isLight && !hasRisk ? 'text-slate-800' : 'text-white'}`}>
            {hasRisk ? risk.recommendedActionLabel : 'Awaiting Ingestion'}
          </span>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isLight && !hasRisk ? 'text-slate-600' : 'text-slate-200'}`}>
          {hasRisk ? risk.recommendedActionDetails : 'Upload a document or pick a scenario to generate threat metrics and decision guidance.'}
        </p>
      </div>

    </div>
  );
};
