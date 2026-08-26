import React, { useState, useEffect, useMemo } from 'react';
import { 
  TamperingIssue, 
  ExtractedDocData 
} from '../types';
import { 
  Eye, 
  EyeOff,
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2,
  FileSearch, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ChevronRight,
  Scan
} from 'lucide-react';
import { 
  getPassportRawSVG, 
  getAadhaarRawSVG, 
  getPANRawSVG 
} from '../utils/documentCardGenerator';
import { PLACEHOLDER_AVATARS } from '../utils/humanPlaceholder';

interface DocumentForensicViewerProps {
  documentImageUrl: string;
  tamperingIssues: TamperingIssue[];
  tamperingScore: number;
  extractedData?: ExtractedDocData;
  isPiiMasked?: boolean;
  onTogglePiiMask?: () => void;
  theme?: 'dark' | 'light';
}

type LayerMode = 'tamper_boxes' | 'ela_heatmap' | 'ocr_boxes' | 'raw';

export const DocumentForensicViewer: React.FC<DocumentForensicViewerProps> = ({
  documentImageUrl,
  tamperingIssues,
  tamperingScore,
  extractedData,
  isPiiMasked: externalPiiMasked,
  onTogglePiiMask,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [activeLayer, setActiveLayer] = useState<LayerMode>('tamper_boxes');
  const [selectedIssue, setSelectedIssue] = useState<TamperingIssue | null>(
    tamperingIssues.length > 0 ? tamperingIssues[0] : null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLaserScan, setShowLaserScan] = useState<boolean>(true);
  const [internalPiiMasked, setInternalPiiMasked] = useState<boolean>(false);

  const isPiiMasked = externalPiiMasked !== undefined ? externalPiiMasked : internalPiiMasked;
  const handleTogglePii = () => {
    if (onTogglePiiMask) {
      onTogglePiiMask();
    } else {
      setInternalPiiMasked(!internalPiiMasked);
    }
  };

  const docType = extractedData?.documentType || 'passport';
  const isPassport = docType === 'passport';

  const rawSvg = useMemo(() => {
    if (docType === 'aadhaar') {
      return getAadhaarRawSVG({
        fullName: extractedData?.fullName || 'SUBJECT BETA',
        aadhaarNo: extractedData?.documentNumber || '8942 5013 7798',
        dob: extractedData?.dateOfBirth || '22/11/1992',
        gender: extractedData?.gender || 'MALE',
      });
    } else if (docType === 'pan') {
      return getPANRawSVG({
        fullName: extractedData?.fullName || 'SUBJECT GAMMA',
        panNo: extractedData?.documentNumber || 'ABCPS1289K',
        fatherName: extractedData?.fatherName || 'FATHER PLACEHOLDER',
        dob: extractedData?.dateOfBirth || '05/09/1995',
        hasAlteredStamp: tamperingScore > 40,
      });
    }
    return getPassportRawSVG({
      fullName: extractedData?.fullName || 'SUBJECT ALPHA',
      passportNo: extractedData?.documentNumber || 'K4892014',
      dob: extractedData?.dateOfBirth || '14/06/1998',
      sex: extractedData?.gender === 'FEMALE' ? 'F' : 'M',
      nationality: extractedData?.nationality || 'INDIAN',
      issueDate: extractedData?.issueDate || '12/03/2020',
      expiryDate: extractedData?.expiryDate || '11/03/2030',
      mrzLine1: extractedData?.mrzLine1 || 'P<INDSUBJECT<<ALPHA<<<<<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: extractedData?.mrzLine2 || 'K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8',
      isSpliced: tamperingScore > 40,
    });
  }, [docType, extractedData, tamperingScore]);

  const isCustomRaster = useMemo(() => {
    if (!documentImageUrl) return false;
    if (documentImageUrl.startsWith('data:image/svg') || documentImageUrl.startsWith('<svg')) return false;
    return (
      documentImageUrl.startsWith('data:image/jpeg') ||
      documentImageUrl.startsWith('data:image/png') ||
      documentImageUrl.startsWith('data:image/webp') ||
      documentImageUrl.startsWith('blob:') ||
      documentImageUrl.startsWith('http')
    );
  }, [documentImageUrl]);

  useEffect(() => {
    if (tamperingIssues.length > 0) {
      setSelectedIssue(tamperingIssues[0]);
    } else {
      setSelectedIssue(null);
    }
  }, [tamperingIssues]);

  const hasHighTampering = tamperingScore >= 60;
  const hasMedTampering = tamperingScore >= 30 && tamperingScore < 60;

  const getShortBadgeLabel = (issue: TamperingIssue) => {
    if (issue.type === 'photo_replacement') return 'Photo Splicing';
    if (issue.type === 'font_anomaly' || issue.title.toLowerCase().includes('kerning')) return 'Font Kerning';
    if (issue.type === 'mrz_mismatch' || issue.title.toLowerCase().includes('mrz')) return 'MRZ Checksum Failure';
    if (issue.type === 'date_alteration') return 'Date Alteration';
    if (issue.type === 'stamp_forgery') return 'Stamp Anomaly';
    return issue.title.split(' ')[0] + ' ' + (issue.title.split(' ')[1] || 'Anomaly');
  };

  return (
    <div className="surface-card rounded-3xl overflow-hidden flex flex-col h-full border border-slate-800 shadow-xl">
      
      {/* Header Toolbar */}
      <div className="p-5 bg-[#121826] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-400">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-wide">
                Forensic Document Inspector
              </h3>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                  hasHighTampering || hasMedTampering
                    ? 'bg-rose-950/70 text-rose-200 border-rose-800'
                    : 'bg-emerald-950/70 text-emerald-200 border-emerald-800'
                }`}
              >
                {tamperingIssues.length} Anomaly Flag{tamperingIssues.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Multi-spectral forensic overlay, glyph analysis & compression variance
            </p>
          </div>
        </div>

        {/* Action Controls & Layer Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0a0d16] p-1.5 rounded-xl border border-slate-800">
          {/* PII Toggle */}
          <button
            type="button"
            id="toggle-pii-redaction"
            onClick={handleTogglePii}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              isPiiMasked
                ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title="Toggle Privacy Data Redaction"
          >
            {isPiiMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPiiMasked ? 'PII Masked' : 'Mask PII'}</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1 hidden sm:block" />

          {/* Tamper Boxes Layer */}
          <button
            type="button"
            id="layer-tamper-boxes"
            onClick={() => setActiveLayer('tamper_boxes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLayer === 'tamper_boxes'
                ? 'bg-accent-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Tamper Boxes</span>
          </button>

          {/* ELA Heatmap Layer */}
          <button
            type="button"
            id="layer-ela-heatmap"
            onClick={() => setActiveLayer('ela_heatmap')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLayer === 'ela_heatmap'
                ? 'bg-accent-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>ELA Heatmap</span>
          </button>

          {/* OCR Box Layer */}
          <button
            type="button"
            id="layer-ocr-boxes"
            onClick={() => setActiveLayer('ocr_boxes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLayer === 'ocr_boxes'
                ? 'bg-accent-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>OCR</span>
          </button>

          {/* Laser Scan Toggle */}
          <button
            type="button"
            onClick={() => setShowLaserScan(!showLaserScan)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              showLaserScan
                ? 'bg-slate-800 text-accent-400 border-slate-700'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
            title="Toggle Laser Scan Beam"
          >
            <Scan className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Forensic Canvas Area */}
      <div className={`relative flex-1 min-h-[440px] sm:min-h-[500px] flex items-center justify-center p-6 sm:p-8 overflow-hidden select-none ${
        isLight ? 'bg-slate-100' : 'bg-[#080a12]'
      }`}>
        
        {!documentImageUrl ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md space-y-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
              isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}>
              <Scan className="w-8 h-8" />
            </div>
            <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              No Document Loaded
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Upload a custom document scan or select one of the sample test scenarios above to trigger multi-spectral forensic inspection.
            </p>
          </div>
        ) : (
          <>
            {/* Laser Scanner Beam */}
            {showLaserScan && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent-400 to-transparent shadow-[0_0_12px_#e5a52e] animate-laser pointer-events-none z-30 opacity-75" />
            )}

            {/* Scaling Document Container */}
            <div 
              className="relative w-full max-w-[660px] transition-transform duration-200 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Custom Raster Upload Render */}
              {isCustomRaster ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 max-h-[440px] w-auto">
                  <img
                    src={documentImageUrl}
                alt="Document Forensic Target"
                className={`max-h-[420px] w-auto object-contain transition-all ${
                  isPiiMasked ? 'blur-md grayscale brightness-75' : ''
                }`}
              />

              {/* Dynamic Bounding Box Overlay */}
              {activeLayer === 'tamper_boxes' && tamperingIssues.map((issue) => {
                const isSelected = selectedIssue?.id === issue.id;
                return (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`absolute border-2 transition-all cursor-pointer rounded-lg ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/25 ring-2 ring-rose-400 z-20'
                        : 'border-rose-500/80 bg-rose-500/15 hover:border-rose-400 z-10'
                    }`}
                    style={{
                      left: `${issue.box.x}%`,
                      top: `${issue.box.y}%`,
                      width: `${issue.box.width}%`,
                      height: `${issue.box.height}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-rose-950 text-rose-200 border border-rose-800 text-[10.5px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      {issue.confidence}% | {getShortBadgeLabel(issue)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : isPassport ? (
            /* Structured Indian Passport Card */
            <div className="relative w-full bg-[#0b1326] border-2 border-slate-700 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl text-slate-200">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-700/80 pb-3 text-slate-200 font-bold text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏛️</span>
                  <span className="tracking-wide text-white font-extrabold">REPUBLIC OF INDIA / RÉPUBLIQUE D'INDE</span>
                </div>
                <div className="font-mono text-white font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-750">
                  P / IND
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-12 gap-4 items-start">
                {/* Photo Column */}
                <div className="col-span-4 relative border-2 border-rose-500 bg-rose-950/20 rounded-xl p-2.5 flex flex-col items-center justify-center min-h-[160px]">
                  <div className="absolute -top-4 left-2 z-20 bg-rose-950 text-rose-200 border border-rose-800 text-xs font-mono font-bold px-2 py-0.5 rounded shadow">
                    94% Splicing
                  </div>
                  <div className="w-24 h-32 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-400 p-1 shadow-inner relative overflow-hidden border border-slate-700">
                    <img
                      src={PLACEHOLDER_AVATARS.splicedPassport}
                      alt="Passport Portrait"
                      className={`w-full h-full object-cover object-top rounded-lg ${
                        isPiiMasked ? 'blur-md grayscale brightness-50' : ''
                      }`}
                    />
                    {isPiiMasked && (
                      <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center">
                        <span className="text-xs font-mono text-slate-200 font-bold px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
                          REDACTED
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Column */}
                <div className="col-span-8 relative border-2 border-slate-600 bg-slate-900/80 rounded-xl p-4">
                  <div className="absolute -top-4 left-2 z-20 bg-slate-900 text-slate-200 border border-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded shadow">
                    89% Font Kerning
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3.5 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">PASSPORT NO</div>
                      <div className={`font-bold text-sm ${isPiiMasked ? 'text-slate-600 select-none' : 'text-white'}`}>
                        {isPiiMasked ? 'K••••••4' : (extractedData?.documentNumber || 'K4892014')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">NATIONALITY</div>
                      <div className="font-bold text-sm text-white">INDIAN</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">SURNAME / GIVEN NAME</div>
                      <div className={`font-bold text-sm ${isPiiMasked ? 'text-slate-600 select-none' : 'text-white'}`}>
                        {isPiiMasked ? 'SUBJ•CT A•••••' : (extractedData?.fullName || 'SUBJECT ALPHA')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">DATE OF BIRTH</div>
                      <div className={`font-bold text-sm ${isPiiMasked ? 'text-slate-600 select-none' : 'text-white'}`}>
                        {isPiiMasked ? '••/••/1998' : (extractedData?.dateOfBirth || '14/06/1998')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">SEX / EXPIRY</div>
                      <div className="font-bold text-sm text-white">M / 11/03/2030</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MRZ Strip */}
              <div className="relative border-2 border-rose-500 bg-rose-950/20 rounded-xl p-3.5 font-mono text-xs text-slate-200 tracking-widest break-all shadow-inner">
                <div className="absolute -top-4 left-2 z-20 bg-rose-950 text-rose-200 border border-rose-800 text-xs font-mono font-bold px-2 py-0.5 rounded shadow">
                  99% MRZ Checksum Failure
                </div>
                <div className="text-slate-400 select-none truncate">
                  P&lt;IND{isPiiMasked ? 'SHARMA<<V••••••<A••••••<<<<<<<<<<<<<' : 'SHARMA<<VIKRAM<AMITABH<<<<<<<<<<<<<<<'}
                </div>
                <div className="text-rose-400 font-bold select-none truncate mt-1">
                  {isPiiMasked ? 'K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8' : (extractedData?.mrzLine2 || 'K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8')}
                </div>
              </div>

              {/* ELA Heatmap Layer */}
              {activeLayer === 'ela_heatmap' && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-slate-900/40 via-transparent to-rose-900/30 rounded-2xl overflow-hidden z-20">
                  <div 
                    className="absolute top-[22%] left-[4%] w-[150px] h-[170px] rounded-full blur-xl opacity-80"
                    style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.85) 0%, transparent 70%)' }}
                  />
                  <div 
                    className="absolute bottom-[3%] left-[3%] w-[94%] h-[55px] rounded-full blur-xl opacity-80"
                    style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.85) 0%, transparent 70%)' }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Fallback SVG for Aadhaar & PAN */
            <div 
              className="w-full max-w-[640px] rounded-2xl shadow-2xl border-2 border-slate-700 bg-slate-900 overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
              dangerouslySetInnerHTML={{ __html: rawSvg }}
            />
          )}
        </div>

        {/* Floating Zoom Toolbar */}
        <div className="absolute bottom-4 right-4 bg-[#121826]/95 backdrop-blur-md border border-slate-750 rounded-xl p-1.5 flex items-center gap-1.5 shadow-xl z-30">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4.5 h-4.5" />
          </button>
          <span className="text-xs font-mono text-white px-2 font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
        </>
        )}
      </div>

      {/* Detection Breakdown Drawer */}
      <div className="bg-[#121826] border-t border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
              Forensic Anomaly Trigger List
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Click anomaly card to focus area
          </span>
        </div>

        {tamperingIssues.length === 0 ? (
          <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-4 flex items-center gap-3.5 text-emerald-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">0 Forgery Anomalies Detected</div>
              <div className="text-xs text-emerald-300/90 mt-0.5">
                Laminate border gradients, glyph baselines, and ICAO 9303 checksums passed verification.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tamperingIssues.map((issue) => {
              const isSelected = selectedIssue?.id === issue.id;
              const isHigh = issue.severity === 'high';
              const shortLabel = getShortBadgeLabel(issue);

              return (
                <div
                  key={`breakdown-${issue.id}`}
                  onClick={() => setSelectedIssue(issue)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#131e36] border-accent-500 ring-2 ring-accent-500/50 shadow-md'
                      : 'bg-[#0a0d16] border-slate-800 hover:border-slate-700 hover:bg-[#111827]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950/70 text-rose-200 border border-rose-800">
                        {issue.confidence}% Anomaly
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        [{Math.round(issue.box.x)}%, {Math.round(issue.box.y)}%]
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5 flex items-center justify-between">
                      <span>{shortLabel}</span>
                      {isSelected && <ChevronRight className="w-4 h-4 text-accent-400 shrink-0" />}
                    </h4>

                    <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 mb-3">
                      {issue.description}
                    </p>
                  </div>

                  {issue.suspectedMethod && (
                    <div className="text-xs font-mono bg-[#0a0d15] px-2.5 py-1.5 rounded border border-slate-800 text-slate-300 truncate">
                      <span>Method: </span>
                      <span className="text-white font-bold">{issue.suspectedMethod}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
