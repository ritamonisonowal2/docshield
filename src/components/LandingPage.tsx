import React from 'react';
import {
  ShieldCheck, Search, Cpu, Network, History, ArrowRight,
  Check, ScanFace, Layers, Scale, AlertTriangle,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onNavigateTab: (tab: 'screening' | 'syndicate' | 'rules' | 'audit') => void;
  theme?: 'dark' | 'light';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchConsole, onNavigateTab, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-300">

      {/* HERO */}
      <section className={`surface-card rounded-3xl p-8 sm:p-12 border ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-xl' : 'bg-[#161b27] border-slate-800 text-white'
      }`}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-mono ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-accent-950/60 border-accent-800/50 text-accent-400'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>DOCSHIELD AI · v2.6 · Document Forensics Platform</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            AI-Powered Document<br />Forensics & ID Screening
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Multi-layer document verification using vision AI, mathematical checksums,
            128-dimension biometric face comparison, and graph-based fraud detection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onLaunchConsole}
              id="hero-launch-console-btn"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <span>Open Screening Workstation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigateTab('rules')}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 text-accent-500" />
              <span>Try Rule Engine Sandbox</span>
            </button>
          </div>

          {/* Key metrics */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t text-left ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            {[
              { value: '99.8%', label: 'Tampering Detection', color: isLight ? 'text-slate-900' : 'text-white' },
              { value: '< 1.2s', label: 'Analysis Latency', color: 'text-accent-500' },
              { value: '100%', label: 'Deterministic Rules', color: 'text-emerald-500' },
              { value: '0-Trust', label: 'Cryptographic Audit', color: isLight ? 'text-slate-900' : 'text-white' },
            ].map((m) => (
              <div key={m.label} className={`p-4 rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f1117] border-slate-800'
              }`}>
                <div className={`text-2xl font-extrabold font-mono ${m.color}`}>{m.value}</div>
                <div className={`text-xs font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE — beginner-friendly quick-start */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-mono font-bold text-accent-500 uppercase tracking-widest">Quick Start</p>
          <h2 className={`text-2xl sm:text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>How It Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Pick a Test Case',
              desc: 'Choose one of the preloaded forgery scenarios — forged passport, invalid Aadhaar, or altered PAN card — or upload your own document image.',
              action: 'Go to Screening',
              tab: 'screening' as const,
            },
            {
              step: '02',
              title: 'AI Analyses the Document',
              desc: 'The system checks for photo splicing, MRZ checksum errors, biometric face match, and links to known fraud syndicates automatically.',
              action: null,
              tab: null,
            },
            {
              step: '03',
              title: 'Review & Record Decision',
              desc: 'See the risk score and detailed findings. Record your officer decision (Clear, Review, Inspect, or Detain) which is logged to the immutable audit trail.',
              action: 'View Audit Trail',
              tab: 'audit' as const,
            },
          ].map((s) => (
            <div key={s.step} className={`surface-card rounded-3xl p-6 border space-y-4 flex flex-col ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold text-accent-500 px-2.5 py-1 rounded-lg border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-accent-950/50 border-accent-800/40'
                }`}>
                  {s.step}
                </span>
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.title}</h3>
              </div>
              <p className={`text-sm leading-relaxed flex-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{s.desc}</p>
              {s.action && s.tab && (
                <button
                  onClick={() => onNavigateTab(s.tab!)}
                  className="text-xs font-semibold text-accent-500 hover:text-accent-600 flex items-center gap-1.5 transition-colors mt-auto cursor-pointer"
                >
                  {s.action} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5-PILLAR ARCHITECTURE */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-mono font-bold text-accent-500 uppercase tracking-widest">System Architecture</p>
          <h2 className={`text-2xl sm:text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>5 Verification Layers</h2>
          <p className={`text-sm max-w-xl mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            From physical document security features to graph-based syndicate intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Layers className="w-5 h-5" />,
              num: '1',
              title: 'Multi-Spectral Forensic Viewer',
              desc: 'Detects pixel cloning, ELA compression variance, font kerning misalignments, and laminate border splicing with interactive bounding box overlays.',
              bullets: ['Copy-move & edge boundary blending', 'Security guilloche background continuity'],
            },
            {
              icon: <ScanFace className="w-5 h-5" />,
              num: '2',
              title: '128D Biometric Face Verification',
              desc: 'Computes cosine similarity between document portrait and live camera capture. Includes passive liveness detection and facial landmark verification.',
              bullets: ['Inter-pupillary distance & jawline contour', 'Anti-spoofing photo & screen rejection'],
            },
            {
              icon: <Cpu className="w-5 h-5" />,
              num: '3',
              title: 'Mathematical Rule Engine',
              desc: 'Zero-hallucination verification using UIDAI Aadhaar Verhoeff D5, ICAO Doc 9303 MRZ weights, and ITD PAN syntax parsing.',
              bullets: ['UIDAI Verhoeff Checksum Dihedral Group D5', 'ICAO 9303 MRZ 7-3-1 Mod-10 Check'],
            },
            {
              icon: <Network className="w-5 h-5" />,
              num: '4',
              title: 'Identity Syndicate Graph (BFS)',
              desc: 'Traverses entity graphs via Breadth-First Search to expose identity recycling syndicates sharing phone numbers, addresses, and facial hashes.',
              bullets: ['Cluster detection across history', 'Interactive node inspector & path tracer'],
            },
            {
              icon: <History className="w-5 h-5" />,
              num: '5',
              title: 'Cryptographic Audit Trail',
              desc: 'Immutable record-keeping with SHA256-ECDSA hashes for every officer decision, risk metric, and biometric result.',
              bullets: ['SHA-256 digital signature ledger', 'One-click printable clearance dossier'],
            },
            {
              icon: <Scale className="w-5 h-5" />,
              num: '6',
              title: 'Multi-Factor Risk Assessment',
              desc: 'Synthesizes face match (35%), document authenticity (20%), checksum validity (20%), and liveness (20%) into a composite 0–100 threat score.',
              bullets: ['4-tier protocol: Clear, Review, Inspect, Detain', 'Explainable threat reasons in plain language'],
            },
          ].map((p) => (
            <div key={p.num} className={`surface-card rounded-3xl p-6 border flex flex-col gap-4 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
                    {p.icon}
                  </div>
                  <h3 className={`text-sm font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{p.title}</h3>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{p.desc}</p>
              </div>
              <ul className={`text-xs space-y-1.5 pt-3 border-t ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
              }`}>
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* NAVIGATION SHORTCUTS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Search className="w-5 h-5" />, label: 'Screening Workstation', desc: 'Analyse document images, run forensic checks, compare biometrics.', tab: 'screening' as const },
          { icon: <AlertTriangle className="w-5 h-5" />, label: 'Syndicate Network', desc: 'Visualise fraud ring graph connections with BFS traversal.', tab: 'syndicate' as const },
          { icon: <Cpu className="w-5 h-5" />, label: 'Rule Engine Sandbox', desc: 'Test Verhoeff, MRZ, and PAN algorithms with custom inputs.', tab: 'rules' as const },
          { icon: <History className="w-5 h-5" />, label: 'Audit Trail', desc: 'Review all logged decisions with cryptographic hash records.', tab: 'audit' as const },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => onNavigateTab(item.tab)}
            className={`surface-card rounded-3xl p-6 border text-left transition-all cursor-pointer group ${
              isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-[#161b27] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500 mb-4">
              {item.icon}
            </div>
            <div className={`text-sm font-bold mb-1 group-hover:text-accent-500 transition-colors ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>{item.label}</div>
            <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</div>
          </button>
        ))}
      </section>

      {/* CTA banner */}
      <section className={`surface-card rounded-3xl p-8 sm:p-12 border text-center space-y-4 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-lg' : 'bg-[#161b27] border-slate-800 text-white'
      }`}>
        <ShieldCheck className="w-12 h-12 text-accent-500 mx-auto" />
        <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>Ready to Screen?</h2>
        <p className={`text-sm max-w-lg mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Launch the screening console to inspect documents, run forensic checks, and record officer decisions.
        </p>
        <button
          onClick={onLaunchConsole}
          className="px-8 py-3.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2.5"
        >
          <span>Open Screening Workstation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
