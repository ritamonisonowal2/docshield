import React, { useState } from 'react';
import { 
  validateVerhoeff, 
  validatePanCard, 
  verifyPassportMrz 
} from '../utils/algorithms';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Calculator, 
  CreditCard, 
  FileCheck2,
  Sparkles,
  Zap
} from 'lucide-react';

interface RuleEnginePlaygroundModalProps {
  theme?: 'dark' | 'light';
}

export const RuleEnginePlaygroundModal: React.FC<RuleEnginePlaygroundModalProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  // Verhoeff State — start empty
  const [aadhaarInput, setAadhaarInput] = useState<string>('');
  const [verhoeffResult, setVerhoeffResult] = useState<ReturnType<typeof validateVerhoeff> | null>(null);

  // PAN State — start empty
  const [panInput, setPanInput] = useState<string>('');
  const [surnameInput, setSurnameInput] = useState<string>('');
  const [panResult, setPanResult] = useState<ReturnType<typeof validatePanCard> | null>(null);

  // MRZ State — start empty
  const [mrzInput, setMrzInput] = useState<string>('');
  const [mrzResult, setMrzResult] = useState<ReturnType<typeof verifyPassportMrz> | null>(null);

  const handleTestVerhoeff = (val: string) => {
    setAadhaarInput(val);
    setVerhoeffResult(val.trim() ? validateVerhoeff(val) : null);
  };

  const handleTestPan = (pan: string, name: string) => {
    setPanInput(pan);
    setSurnameInput(name);
    setPanResult(pan.trim() || name.trim() ? validatePanCard(pan, name) : null);
  };

  const handleTestMrz = (mrz: string) => {
    setMrzInput(mrz);
    setMrzResult(mrz.trim() ? verifyPassportMrz(mrz) : null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* SECTION HERO HEADER */}
      <div className={`surface-card rounded-3xl p-6 sm:p-8 border shadow-xl ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#0a0d16] border-slate-750 text-accent-400'
            }`}>
              <Cpu className="w-3.5 h-3.5 text-accent-500" />
              <span>DETERMINISTIC MATHEMATICAL VERIFICATION</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Cryptographic Rule Engine Sandbox
            </h1>
            <p className={`text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Interactive mathematical test bench for UIDAI Verhoeff $D_5$ polynomial Dihedral groups, 
              Income Tax PAN syntactic rules, and ICAO Doc 9303 MRZ periodic Mod-10 weights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono font-bold px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-[#0a0d16] border-slate-750 text-slate-200'
            }`}>
              <Zap className="w-4 h-4 text-amber-500" />
              <span>0% AI Hallucination</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Interactive Test Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Card 1: Verhoeff Dihedral D5 Algorithm */}
        <div className={`surface-card rounded-3xl p-7 border flex flex-col justify-between shadow-md ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-base font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  UIDAI Aadhaar Verhoeff
                </h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Dihedral Group $D_5$ Permutations</p>
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                12-Digit Aadhaar Sequence:
              </label>
              <input
                type="text"
                value={aadhaarInput}
                onChange={(e) => handleTestVerhoeff(e.target.value)}
                placeholder="e.g. 8942 5013 7798"
                className={`w-full border rounded-xl p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#0a0d16] border-slate-750 text-white'
                }`}
              />
            </div>

            {/* Quick Test Presets */}
            <div className="flex gap-2 mb-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleTestVerhoeff('8942 5013 7798')}
                className="text-rose-400 hover:text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800 cursor-pointer"
              >
                Invalid Tampered
              </button>
              <button
                type="button"
                onClick={() => handleTestVerhoeff('2345 6789 0123')}
                className="text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800 cursor-pointer"
              >
                Valid Aadhaar
              </button>
            </div>

            {/* Result Box */}
            {verhoeffResult ? (
              <div
                className={`p-4 rounded-2xl border ${
                  verhoeffResult.isValid
                    ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-400'
                    : 'bg-rose-950/30 border-rose-900/60 text-rose-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1.5">
                  {verhoeffResult.isValid ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4.5 h-4.5 text-rose-400" />
                  )}
                  <span>{verhoeffResult.isValid ? 'VERHOEFF CHECKSUM PASS' : 'CHECKSUM FAILURE (TAMPERED)'}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-mono opacity-90">
                  {verhoeffResult.isValid
                    ? 'Permutation equation evaluated to 0. Valid UIDAI sequence.'
                    : `Expected 12th check digit: ${verhoeffResult.calculatedCheckDigit}, Actual: ${verhoeffResult.actualCheckDigit}`}
                </p>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border text-xs font-mono italic ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-800/30 border-slate-700 text-slate-500'
              }`}>
                Enter a 12-digit Aadhaar number above to verify the checksum.
              </div>
            )}
          </div>

          <div className={`mt-4 text-xs font-mono pt-3 border-t ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
            Formula: $c = \sum d(c, p(i \pmod 8, d_i)) = 0$
          </div>
        </div>

        {/* Card 2: Income Tax PAN Card Structure */}
        <div className={`surface-card rounded-3xl p-7 border flex flex-col justify-between shadow-md ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-base font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Income Tax PAN Engine
                </h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Syntax & 5th-Char Initial Matching</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  10-Digit PAN Number:
                </label>
                <input
                  type="text"
                  value={panInput}
                  onChange={(e) => handleTestPan(e.target.value, surnameInput)}
                  placeholder="e.g. ABCPS1234F"
                  className={`w-full border rounded-xl p-3 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#0a0d16] border-slate-750 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Applicant Surname:
                </label>
                <input
                  type="text"
                  value={surnameInput}
                  onChange={(e) => handleTestPan(panInput, e.target.value)}
                  placeholder="e.g. Sample"
                  className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#0a0d16] border-slate-750 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex gap-2 mb-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleTestPan('ABCPS1289K', 'Doe')}
                className="text-rose-400 hover:text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800 cursor-pointer"
              >
                Mismatch (S vs D)
              </button>
              <button
                type="button"
                onClick={() => handleTestPan('ABCPS1289K', 'Sample')}
                className="text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800 cursor-pointer"
              >
                Match (S & Sample)
              </button>
            </div>

            {/* Result Box */}
            {panResult ? (
              <div
                className={`p-4 rounded-2xl border ${
                  panResult.isValid
                    ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-400'
                    : 'bg-rose-950/30 border-rose-900/60 text-rose-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1.5">
                  {panResult.isValid ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4.5 h-4.5 text-rose-400" />
                  )}
                  <span>{panResult.isValid ? 'PAN FORMAT & INITIAL PASS' : 'PAN SYNTAX / INITIAL MISMATCH'}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-mono opacity-90">
                  {panResult.reason} • Entity: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{panResult.entityType}</strong>
                </p>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border text-xs font-mono italic ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-800/30 border-slate-700 text-slate-500'
              }`}>
                Enter a PAN number and surname above to validate the format.
              </div>
            )}
          </div>

          <div className={`mt-4 text-xs font-mono pt-3 border-t ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
            Regex: <code className="text-accent-500">^[A-Z]&#123;3&#125;[P][A-Z][0-9]&#123;4&#125;[A-Z]$</code>
          </div>
        </div>

        {/* Card 3: ICAO Doc 9303 MRZ */}
        <div className={`surface-card rounded-3xl p-7 border flex flex-col justify-between shadow-md ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-base font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ICAO Doc 9303 MRZ Engine
                </h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>TD3 Machine-Readable Zone Mod-10</p>
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                MRZ Line 2 (44 Chars):
              </label>
              <textarea
                rows={2}
                value={mrzInput}
                onChange={(e) => handleTestMrz(e.target.value)}
                placeholder="K4892014<8IND9205128M3108253<<<<<<<<<<<<<<02"
                className={`w-full border rounded-xl p-3 font-mono text-xs uppercase break-all leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#0a0d16] border-slate-750 text-white'
                }`}
              />
            </div>

            {/* Quick Test Presets */}
            <div className="flex gap-2 mb-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleTestMrz('K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8')}
                className="text-rose-400 hover:text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800 cursor-pointer"
              >
                Invalid MRZ
              </button>
              <button
                type="button"
                onClick={() => handleTestMrz('N1938472<4IND9604185M3101037<<<<<<<<<<<<<<4')}
                className="text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800 cursor-pointer"
              >
                Genuine MRZ
              </button>
            </div>

            {/* Result Box */}
            {mrzResult ? (
              <div
                className={`p-4 rounded-2xl border ${
                  mrzResult.isValid
                    ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-400'
                    : 'bg-rose-950/30 border-rose-900/60 text-rose-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1.5">
                  {mrzResult.isValid ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4.5 h-4.5 text-rose-400" />
                  )}
                  <span>{mrzResult.isValid ? 'ALL ICAO CHECKDIGITS PASS' : 'MRZ CHECKDIGIT FAILED'}</span>
                </div>
                <ul className="text-xs sm:text-sm opacity-90 space-y-1 font-mono">
                  {mrzResult.details.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border text-xs font-mono italic ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-800/30 border-slate-700 text-slate-500'
              }`}>
                Paste a 44-character MRZ Line 2 above to verify ICAO check digits.
              </div>
            )}
          </div>

          <div className={`mt-4 text-xs font-mono pt-3 border-t ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
            ICAO Periodic Mod-10 Weights: (7, 3, 1)
          </div>
        </div>

      </div>
    </div>
  );
};
