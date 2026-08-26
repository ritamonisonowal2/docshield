/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ScenarioSelector } from './components/ScenarioSelector';
import { InputCaptureSection } from './components/InputCaptureSection';
import { DocumentForensicViewer } from './components/DocumentForensicViewer';
import { FaceBiometricComparator } from './components/FaceBiometricComparator';
import { ValidationRuleTable } from './components/ValidationRuleTable';
import { RiskScoreGauge } from './components/RiskScoreGauge';
import { SyndicateGraphVisualizer } from './components/SyndicateGraphVisualizer';
import { OfficerDecisionPanel } from './components/OfficerDecisionPanel';
import { AuditTrailModal } from './components/AuditTrailModal';
import { RuleEnginePlaygroundModal } from './components/RuleEnginePlaygroundModal';
import { CaseDossierModal } from './components/CaseDossierModal';
import { PRESET_SCENARIOS } from './data/mockScenarios';
import { ScreeningCase, AuditLogEntry, ActionDecision, DocumentType } from './types';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { PLACEHOLDER_AVATARS } from './utils/humanPlaceholder';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'screening' | 'syndicate' | 'rules' | 'audit'>('home');
  const [currentCase, setCurrentCase] = useState<ScreeningCase | null>(null);
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [officerId] = useState<string>('OFFICER-7492');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPiiMasked, setIsPiiMasked] = useState<boolean>(true);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try { return (localStorage.getItem('docshield_theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });

  useEffect(() => {
    try { localStorage.setItem('docshield_theme', theme); } catch {}
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) setAuditLogs(data.logs);
      })
      .catch(() => {});
  }, []);

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById('forensic-results-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectScenario = (scenario: ScreeningCase) => {
    setIsCustomUpload(false);
    setCurrentCase(scenario);
    scrollToResults();
  };

  const handleSelectCustomMode = () => setIsCustomUpload(true);

  const handleAnalyzeUpload = async (payload: {
    docImage: string;
    docType: DocumentType;
    liveImage?: string;
    supportingDoc?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentImageBase64: payload.docImage,
          documentType: payload.docType,
          livePersonImageBase64: payload.liveImage,
          supportingDocImageBase64: payload.supportingDoc,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        const analyzedCase: ScreeningCase = {
          id: `CASE-LIVE-${Date.now().toString().slice(-4)}`,
          title: `Live ${payload.docType.toUpperCase()} Screening`,
          documentType: payload.docType,
          documentImageUrl: payload.docImage,
          livePersonImageUrl: payload.liveImage || PLACEHOLDER_AVATARS.neutralLive,
          supportingDocImageUrl: payload.supportingDoc,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          extractedData: data.data.extractedData,
          validationChecks: data.data.validationChecks,
          tamperingIssues: data.data.tamperingIssues,
          tamperingScore: data.data.tamperingScore,
          faceVerification: data.data.faceVerification,
          riskBreakdown: data.data.riskBreakdown,
          syndicateGraph: data.data.syndicateGraph,
        };
        setCurrentCase(analyzedCase);
        setIsCustomUpload(false);
        scrollToResults();
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordDecision = async (decision: ActionDecision, notes: string) => {
    if (!currentCase) return;

    const updatedCase = {
      ...currentCase,
      decisionState: {
        decision,
        officerNotes: notes,
        officerId,
        decidedAt: new Date().toISOString(),
        isCommitted: true,
      },
    };
    setCurrentCase(updatedCase);

    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officerId,
      applicantName: currentCase.extractedData?.fullName || 'Applicant',
      documentNumber: currentCase.extractedData?.documentNumber || 'N/A',
      documentType: currentCase.documentType,
      overallRisk: currentCase.riskBreakdown?.overallRisk || 0,
      riskTier: currentCase.riskBreakdown?.riskTier || 'LOW',
      decision,
      decisionNotes: notes,
      tamperingDetectedCount: currentCase.tamperingIssues?.length || 0,
      faceMatchPercent: currentCase.faceVerification?.similarityScore || 0,
      cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
    } catch {}
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0f1117] text-slate-100 bg-mesh-pattern'
      }`}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        officerId={officerId}
        onOpenReport={() => setIsReportModalOpen(true)}
        totalScreenedCount={auditLogs.length}
        flaggedCount={auditLogs.filter((l) => l.riskTier === 'HIGH').length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-10 space-y-10">

        {activeTab === 'home' && (
          <LandingPage onLaunchConsole={() => setActiveTab('screening')} onNavigateTab={(tab) => setActiveTab(tab)} theme={theme} />
        )}

        {activeTab === 'screening' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            <ScenarioSelector
              currentCaseId={currentCase?.id || null}
              onSelectScenario={handleSelectScenario}
              isCustomUpload={isCustomUpload}
              onSelectCustomMode={handleSelectCustomMode}
              theme={theme}
            />
            <InputCaptureSection onAnalyze={handleAnalyzeUpload} isLoading={isLoading} isCustomUpload={isCustomUpload} theme={theme} />
            <div id="forensic-results-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <DocumentForensicViewer
                  documentImageUrl={currentCase?.documentImageUrl || ''}
                  tamperingIssues={currentCase?.tamperingIssues || []}
                  tamperingScore={currentCase?.tamperingScore || 0}
                  extractedData={currentCase?.extractedData}
                  isPiiMasked={isPiiMasked}
                  onTogglePiiMask={() => setIsPiiMasked(!isPiiMasked)}
                  theme={theme}
                />
              </div>
              <div className="lg:col-span-5">
                <FaceBiometricComparator
                  documentImageUrl={currentCase?.documentImageUrl || ''}
                  livePersonImageUrl={currentCase?.livePersonImageUrl || ''}
                  faceVerification={currentCase?.faceVerification || {
                    similarityScore: 0,
                    livenessScore: 0,
                    matchStatus: 'MISMATCH',
                    livenessStatus: 'FAIL',
                    facialAttributesMatch: { eyeDistance: false, jawlineConsistency: false, skinTextureNatural: false, ageProgressionPlausible: false },
                    confidenceExplanation: 'No document loaded. Upload a document scan to run facial comparison.',
                  }}
                  applicantName={currentCase?.extractedData?.fullName || 'Subject'}
                  isPiiMasked={isPiiMasked}
                  theme={theme}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <ValidationRuleTable
                  checks={currentCase?.validationChecks || []}
                  extractedData={currentCase?.extractedData}
                  onOpenVerhoeffModal={() => setActiveTab('rules')}
                  isPiiMasked={isPiiMasked}
                  theme={theme}
                />
              </div>
              <div className="lg:col-span-5">
                <RiskScoreGauge risk={currentCase?.riskBreakdown || { overallRisk: 0, riskTier: 'LOW', ocrRuleRisk: 0, photoForgeryRisk: 0, faceBiometricRisk: 0, syndicateRisk: 0, riskFactors: [] }} applicantName={currentCase?.extractedData?.fullName || 'Subject'} theme={theme} />
              </div>
            </div>

            {currentCase?.syndicateGraph?.fraudRingDetected && (
              <div className={`rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border ${
                isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-950/20 border-rose-900/50'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-rose-100' : 'bg-rose-950 border border-rose-800'
                  }`}>
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h4 className={`text-base font-bold ${isLight ? 'text-rose-700' : 'text-rose-300'}`}>
                      Syndicate Alert: {currentCase.syndicateGraph.syndicateName}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-rose-600' : 'text-slate-300'}`}>
                      {currentCase.syndicateGraph.duplicateCount} duplicate identity connections found.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-view-syndicate-graph-details"
                  onClick={() => setActiveTab('syndicate')}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <span>View BFS Graph</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <OfficerDecisionPanel currentCase={currentCase} officerId={officerId} onRecordDecision={handleRecordDecision} theme={theme} />
          </div>
        )}

        {activeTab === 'syndicate' && (
          <div className="animate-in fade-in duration-200">
            <SyndicateGraphVisualizer graphData={currentCase?.syndicateGraph || { fraudRingDetected: false, syndicateName: 'No Active Syndicate', duplicateCount: 0, nodes: [], edges: [] }} applicantName={currentCase?.extractedData?.fullName || 'Subject'} theme={theme} />
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="animate-in fade-in duration-200">
            <RuleEnginePlaygroundModal theme={theme} />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="animate-in fade-in duration-200">
            <AuditTrailModal logs={auditLogs} theme={theme} />
          </div>
        )}
      </main>

      <CaseDossierModal
        currentCase={currentCase}
        officerId={officerId}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        theme={theme}
      />

      <footer className={`mt-auto border-t py-5 text-xs transition-colors ${
        isLight ? 'border-slate-200 bg-white text-slate-400' : 'border-slate-800 bg-[#0a0d16] text-slate-500'
      }`}>
        <div className="mx-auto flex max-w-[1560px] flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent-500" />
            <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>DocShield AI</span>
            <span className={isLight ? 'text-slate-300' : 'text-slate-700'}>—</span>
            <span>Document Forensics &amp; Biometric Clearance</span>
          </div>
          <div className="font-mono text-xs">
            ICAO Doc 9303 • UIDAI Verhoeff D5 • ISO/IEC 19794-5
          </div>
        </div>
      </footer>
    </div>
  );
}
