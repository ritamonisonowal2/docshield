import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  RefreshCw, 
  FileCheck2, 
  Layers, 
  User, 
  Scan,
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { DocumentType } from '../types';
import { generatePassportSVG, generateAadhaarSVG, generatePANSVG } from '../utils/documentCardGenerator';
import { PLACEHOLDER_AVATARS } from '../utils/humanPlaceholder';

interface InputCaptureSectionProps {
  onAnalyze: (payload: {
    docImage: string;
    docType: DocumentType;
    liveImage?: string;
    supportingDoc?: string;
  }) => Promise<void>;
  isLoading: boolean;
  isCustomUpload?: boolean;
  theme?: 'dark' | 'light';
}

export const InputCaptureSection: React.FC<InputCaptureSectionProps> = ({
  onAnalyze,
  isLoading,
  isCustomUpload = false,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [docType, setDocType] = useState<DocumentType>('passport');
  const [docImage, setDocImage] = useState<string | null>(null);
  const [liveImage, setLiveImage] = useState<string | null>(null);
  const [supportingDoc, setSupportingDoc] = useState<string | null>(null);
  const [isDualUpload, setIsDualUpload] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState<boolean>(false);

  const hasCurrentCase = Boolean(docImage);
  const isExpanded = isCustomUpload || isManuallyExpanded || !hasCurrentCase;

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputDocRef = useRef<HTMLInputElement>(null);
  const fileInputLiveRef = useRef<HTMLInputElement>(null);
  const fileInputSupportRef = useRef<HTMLInputElement>(null);

  // Attach stream to video element whenever cameraActive or mediaStream changes
  useEffect(() => {
    if (cameraActive && mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => {
        console.warn('Auto-play error on video stream:', err);
      });
    }
  }, [cameraActive, mediaStream]);

  const startCamera = async () => {
    setCameraError(null);
    setIsStartingCamera(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Webcam API is not supported in this environment. Please upload a selfie image.');
      setIsStartingCamera(false);
      return;
    }

    // Try a series of progressively relaxed media stream constraints to ensure camera start
    const constraintTries: MediaStreamConstraints[] = [
      { video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } },
      { video: { facingMode: 'user' } },
      { video: true },
    ];

    let stream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraints of constraintTries) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    setIsStartingCamera(false);

    if (stream) {
      setMediaStream(stream);
      setCameraActive(true);
      return;
    }

    // If camera access failed (e.g. iframe restrictions, permission dismissed, no webcam connected)
    console.warn('Webcam stream initialization failed:', lastError);
    let errorMsg = 'Webcam unavailable or permission dismissed.';
    if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
      errorMsg = 'Camera permission denied or dismissed in browser.';
    } else if (lastError?.name === 'NotReadableError' || lastError?.name === 'TrackStartError' || lastError?.message?.includes('video source')) {
      errorMsg = 'Camera is busy or in use by another app.';
    } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
      errorMsg = 'No webcam hardware detected on this device.';
    }
    setCameraError(errorMsg);
    setCameraActive(false);
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setLiveImage(dataUrl);
      stopCamera();
    }
  };

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgData = reader.result as string;
      setDocImage(imgData);
      // Auto-trigger forensic analysis for effortless user experience
      onAnalyze({
        docImage: imgData,
        docType,
        liveImage: liveImage || undefined,
        supportingDoc: supportingDoc || undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleLiveFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLiveImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSupportFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSupportingDoc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const loadSampleDoc = (type: DocumentType) => {
    setDocType(type);
    let sampleSvg = '';
    if (type === 'passport') {
      sampleSvg = generatePassportSVG({
        fullName: 'VIKRAM AMITABH SHARMA',
        passportNo: 'K4892014',
        dob: '14/06/1998',
        sex: 'M',
        nationality: 'INDIAN',
        issueDate: '12/03/2020',
        expiryDate: '11/03/2030',
        mrzLine1: 'P<INDSHARMA<<VIKRAM<AMITABH<<<<<<<<<<<<<<<',
        mrzLine2: 'K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8',
        isSpliced: true,
        photoUrl: PLACEHOLDER_AVATARS.splicedPassport,
      });
      setLiveImage(PLACEHOLDER_AVATARS.maleLive);
    } else if (type === 'aadhaar') {
      sampleSvg = generateAadhaarSVG({
        fullName: 'RAHUL SURESH DESHMUKH',
        aadhaarNo: '8942 5013 7798',
        dob: '22/11/1992',
        gender: 'MALE',
        photoUrl: PLACEHOLDER_AVATARS.malePassport,
      });
      setLiveImage(PLACEHOLDER_AVATARS.maleLive);
    } else if (type === 'pan') {
      sampleSvg = generatePANSVG({
        fullName: 'PRIYA SUNIL CHOUDHARY',
        panNo: 'ABCPS1289K',
        fatherName: 'SUNIL CHOUDHARY',
        dob: '05/09/1995',
        photoUrl: PLACEHOLDER_AVATARS.femalePassport,
        hasAlteredStamp: true,
      });
      setLiveImage(PLACEHOLDER_AVATARS.femaleLive);
    }
    if (sampleSvg) {
      setDocImage(sampleSvg);
      onAnalyze({
        docImage: sampleSvg,
        docType: type,
        liveImage: PLACEHOLDER_AVATARS.maleLive,
      });
    }
  };

  const handleStartAnalysis = () => {
    if (!docImage) return;
    onAnalyze({
      docImage,
      docType,
      liveImage: liveImage || undefined,
      supportingDoc: supportingDoc || undefined,
    });
  };

  return (
    <div className="surface-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg">
      {/* Header with expand/collapse control */}
      <div 
        onClick={() => setIsManuallyExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-400">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Live Sensor Ingestion Studio
              </h3>
              <span className="text-xs text-accent-400 font-bold bg-accent-950/60 px-2.5 py-0.5 rounded-lg border border-accent-800">
                Webcam & Custom ID Scanner
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Upload custom identity scans and snap live traveler webcam selfies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs font-bold text-slate-200 hover:text-white bg-[#0a0d16] px-4 py-2 rounded-xl border border-slate-750 flex items-center gap-2 shadow-sm"
          >
            <span>{isExpanded ? 'Collapse Ingestion Studio' : 'Expand Ingestion Studio'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Studio Content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-6 animate-in fade-in duration-200">
          
          {/* Friendly Guidance Banner when no case is loaded */}
          {!hasCurrentCase && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              isLight ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900' : 'bg-accent-950/40 border-accent-800/60 text-accent-200'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-accent-600/20 border border-accent-500/30 flex items-center justify-center shrink-0 text-accent-500 font-bold text-xs">
                1
              </div>
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong>Getting Started:</strong> Drag and drop any document scan image (Passport, Aadhaar, or PAN) into the dropzone below, select a file, or click a 1-click sample button to begin AI forensic analysis.
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Document Category:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['passport', 'aadhaar', 'pan', 'voter_id', 'driving_license', 'visa'] as DocumentType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    id={`select-doctype-${t}`}
                    onClick={() => setDocType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                      docType === t
                        ? 'bg-accent-600 text-white border-accent-500 shadow-md'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                        : 'bg-[#0a0d16] text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Upload Toggle */}
            <label className={`flex items-center gap-2.5 text-xs font-semibold cursor-pointer px-4 py-2.5 rounded-xl border self-start sm:self-auto ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-[#0a0d16] border-slate-750 text-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={isDualUpload}
                onChange={(e) => setIsDualUpload(e.target.checked)}
                className="rounded text-accent-600 focus:ring-accent-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
              <span>Dual-Document Cross-Verification</span>
            </label>
          </div>

          {/* Upload Dropzones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
            
            {/* Card 1: Primary Document */}
            <div className={`border rounded-2xl p-5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <FileCheck2 className="w-4.5 h-4.5 text-accent-500" />
                    <span>1. Primary ID Document</span>
                  </span>
                  <span className="text-xs text-accent-400 font-bold bg-accent-950/70 px-2.5 py-0.5 rounded-lg border border-accent-800">
                    REQUIRED
                  </span>
                </div>

                {docImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 group h-52 bg-slate-900 flex items-center justify-center">
                    <img
                      src={docImage}
                      alt="Primary Document"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                      <button
                        onClick={handleStartAnalysis}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer shadow flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Run Forensic Scan</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputDocRef.current?.click()}
                          className="bg-accent-600 hover:bg-accent-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          onClick={() => setDocImage(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-1.5 rounded-xl font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputDocRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 h-52 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-accent-500 bg-accent-500/10 scale-[1.02]'
                        : isLight
                        ? 'border-slate-300 hover:border-accent-500 hover:bg-slate-100'
                        : 'border-slate-750 hover:border-accent-500 hover:bg-accent-950/10'
                    }`}
                  >
                    <Upload className={`w-8 h-8 mb-2 ${isDragging ? 'text-accent-500 animate-bounce' : 'text-slate-400'}`} />
                    <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {isDragging ? 'Drop file here to inspect' : 'Click to Upload or Drag & Drop'}
                    </p>
                    <p className={`text-xs mt-1 mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      PNG, JPG, WebP images accepted
                    </p>
                    
                    {/* Quick 1-Click Sample Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-slate-400 font-mono">Quick test:</span>
                      {(['passport', 'aadhaar', 'pan'] as DocumentType[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => loadSampleDoc(st)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold capitalize cursor-pointer transition-colors ${
                            isLight
                              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-200'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputDocRef}
                  onChange={handleDocFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className={`mt-4 flex items-center justify-between text-xs pt-3 border-t ${
                isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'
              }`}>
                <span>Instant Test Sample:</span>
                <button
                  type="button"
                  onClick={() => loadSampleDoc(docType)}
                  className="text-accent-500 hover:text-accent-600 font-bold cursor-pointer"
                >
                  Load Sample {docType}
                </button>
              </div>
            </div>

            {/* Card 2: Live Presenter Camera / Selfie */}
            <div className={`border rounded-2xl p-5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <User className="w-4.5 h-4.5 text-emerald-500" />
                    <span>2. Live Presenter Selfie</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-800">
                    BIOMETRICS
                  </span>
                </div>

                {cameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-accent-500 h-52 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Snap Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs px-3.5 py-2 rounded-xl font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : liveImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 group h-52 bg-slate-900 flex items-center justify-center">
                    <img
                      src={liveImage}
                      alt="Live Presenter"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={startCamera}
                        className="bg-accent-600 hover:bg-accent-500 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer shadow"
                      >
                        Retake
                      </button>
                      <button
                        onClick={() => setLiveImage(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`border-2 border-dashed rounded-2xl p-4 h-52 flex flex-col items-center justify-center text-center ${
                    isLight ? 'border-slate-300 bg-white' : 'border-slate-750 bg-[#080b14]'
                  }`}>
                    {cameraError ? (
                      <div className="text-xs text-rose-400 mb-2 flex items-center gap-1 max-w-[280px] leading-tight">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{cameraError}</span>
                      </div>
                    ) : (
                      <Camera className="w-8 h-8 text-slate-400 mb-1.5" />
                    )}
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        disabled={isStartingCamera}
                        className="bg-accent-600 hover:bg-accent-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isStartingCamera ? 'Connecting...' : 'Start Camera'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputLiveRef.current?.click()}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-bold border cursor-pointer ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                            : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750'
                        }`}
                      >
                        Upload Selfie
                      </button>
                    </div>
                    {/* Quick Sample Live Selfie Buttons */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono mt-1">
                      <span className="text-slate-400 text-[10px]">Test Selfie:</span>
                      <button
                        type="button"
                        onClick={() => setLiveImage(PLACEHOLDER_AVATARS.maleLive)}
                        className={`px-2 py-0.5 rounded border font-semibold cursor-pointer ${
                          isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setLiveImage(PLACEHOLDER_AVATARS.femaleLive)}
                        className={`px-2 py-0.5 rounded border font-semibold cursor-pointer ${
                          isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputLiveRef}
                  onChange={handleLiveFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className={`mt-4 flex items-center justify-between text-xs pt-3 border-t font-mono ${
                isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'
              }`}>
                <span>Biometrics:</span>
                <span className="text-emerald-500 font-bold">128D Engine Ready</span>
              </div>
            </div>

            {/* Card 3: Supporting Document or Analysis Launcher */}
            {isDualUpload ? (
              <div className={`border rounded-2xl p-5 flex flex-col justify-between ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Layers className="w-4.5 h-4.5 text-slate-400" />
                      <span>3. Supporting Document</span>
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                      isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-850 text-slate-300 border-slate-700'
                    }`}>
                      DUAL VERIFY
                    </span>
                  </div>

                  {supportingDoc ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700 group h-52 bg-slate-900 flex items-center justify-center">
                      <img
                        src={supportingDoc}
                        alt="Supporting Document"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSupportingDoc(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputSupportRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 h-52 flex flex-col items-center justify-center text-center cursor-pointer ${
                        isLight ? 'border-slate-300 bg-white hover:border-slate-400' : 'border-slate-750 bg-[#080b14] hover:border-slate-600'
                      }`}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        Upload Secondary ID
                      </p>
                      <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Cross-references name & address
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputSupportRef}
                    onChange={handleSupportFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className={`mt-4 text-xs pt-3 border-t ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                  Cross-reference validation enabled.
                </div>
              </div>
            ) : (
              <div className={`border rounded-2xl p-5 flex flex-col justify-between ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
              }`}>
                <div>
                  <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block mb-1">
                    Inspection Protocol
                  </span>
                  <h4 className={`text-base font-bold mb-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    10-Stage Multimodal AI Pipeline
                  </h4>
                  <ul className={`text-xs space-y-2 mb-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500 shrink-0" />
                      <span>OCR & Semantic Entity Extraction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500 shrink-0" />
                      <span>Verhoeff & MRZ Mathematical Checksums</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500 shrink-0" />
                      <span>Photo Splicing & Forgery Bounding Boxes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500 shrink-0" />
                      <span>Biometric Landmark Match & Liveness</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  id="btn-run-full-forensic-scan"
                  disabled={!docImage || isLoading}
                  onClick={handleStartAnalysis}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                    !docImage || isLoading
                      ? isLight ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' : 'bg-slate-850 text-slate-500 cursor-not-allowed border border-slate-800'
                      : 'bg-accent-600 hover:bg-accent-500 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      <span>Executing AI Forensic Scan...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4.5 h-4.5" />
                      <span>Execute AI Forensic Scan</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
