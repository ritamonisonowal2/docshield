import React from 'react';
import { FaceVerificationResult } from '../types';
import { 
  UserCheck, 
  UserX, 
  ScanFace, 
  Check, 
  X, 
  Radar, 
  Activity 
} from 'lucide-react';
import { PLACEHOLDER_AVATARS } from '../utils/humanPlaceholder';

interface FaceBiometricComparatorProps {
  documentImageUrl: string;
  livePersonImageUrl: string;
  faceVerification: FaceVerificationResult;
  applicantName: string;
  isPiiMasked?: boolean;
  theme?: 'dark' | 'light';
}

export const FaceBiometricComparator: React.FC<FaceBiometricComparatorProps> = ({
  documentImageUrl,
  livePersonImageUrl,
  faceVerification,
  applicantName,
  isPiiMasked = false,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const hasImages = Boolean(documentImageUrl || livePersonImageUrl);
  const isMatch = hasImages && faceVerification.matchStatus === 'MATCH';

  return (
    <div className={`surface-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full border shadow-xl ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
    }`}>
      
      <div>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-600/15 border border-accent-500/30 flex items-center justify-center text-accent-500">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Biometric Face Verification
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                128D facial landmark embeddings & anti-spoofing
              </p>
            </div>
          </div>

          {/* Match Badge */}
          <div
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
              !hasImages
                ? isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
                : isMatch
                ? 'bg-emerald-950/70 text-emerald-200 border-emerald-800'
                : 'bg-rose-950/70 text-rose-200 border-rose-800'
            }`}
          >
            {!hasImages ? (
              <span>AWAITING INPUT</span>
            ) : isMatch ? (
              <><UserCheck className="w-4 h-4 text-emerald-400" /><span>BIOMETRIC MATCH</span></>
            ) : (
              <><UserX className="w-4 h-4 text-rose-400" /><span>MISMATCH DETECTED</span></>
            )}
          </div>
        </div>

        {/* Side-by-side Face Comparison Showcase */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          {/* Document Portrait */}
          <div className={`border rounded-2xl p-4 flex flex-col items-center text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Document Photo
            </span>
            <div className={`relative w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden border-2 flex items-center justify-center shadow-md ${
              isLight ? 'border-slate-300 bg-slate-200' : 'border-slate-700 bg-slate-900'
            }`}>
              {faceVerification.docFaceUrl || documentImageUrl ? (
                <img
                  src={faceVerification.docFaceUrl || documentImageUrl}
                  alt="Document Crop"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_AVATARS.malePassport;
                  }}
                  className={`w-full h-full object-cover object-top transition-all ${
                    isPiiMasked ? 'blur-md grayscale brightness-50' : ''
                  }`}
                />
              ) : (
                <div className={`flex flex-col items-center gap-1.5 p-2 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                  <ScanFace className="w-8 h-8 opacity-60" />
                  <span className="text-[10px] font-mono">No Image</span>
                </div>
              )}

              {isPiiMasked && (faceVerification.docFaceUrl || documentImageUrl) && (
                <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-2 z-10">
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    REDACTED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Live Traveler Camera Feed */}
          <div className={`border rounded-2xl p-4 flex flex-col items-center text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Live Sensor Feed
            </span>
            <div className={`relative w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden border-2 flex items-center justify-center shadow-md ${
              isLight ? 'border-slate-300 bg-slate-200' : 'border-slate-700 bg-slate-900'
            }`}>
              {livePersonImageUrl ? (
                <img
                  src={livePersonImageUrl}
                  alt="Live Camera Snapshot"
                  className={`w-full h-full object-cover object-top transition-all ${
                    isPiiMasked ? 'blur-md grayscale brightness-50' : ''
                  }`}
                />
              ) : (
                <div className={`flex flex-col items-center gap-1.5 p-2 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                  <ScanFace className="w-8 h-8 opacity-60" />
                  <span className="text-[10px] font-mono">No Live Selfie</span>
                </div>
              )}

              {/* Facial Landmark Radar Dots */}
              {livePersonImageUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[35%] left-[30%] w-2 h-2 rounded-full bg-accent-400" />
                  <div className="absolute top-[35%] right-[30%] w-2 h-2 rounded-full bg-accent-400" />
                  <div className="absolute top-[52%] left-[48%] w-2 h-2 rounded-full bg-accent-400" />
                  <div className="absolute bottom-[28%] left-[45%] w-2.5 h-1.5 rounded-full bg-accent-400" />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Biometric Scores & Gauges */}
        <div className="space-y-4 mb-6">
          
          {/* Facial Landmark Similarity Bar */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
              <span className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                <Radar className="w-4 h-4 text-accent-500" />
                <span>Landmark Similarity Ratio:</span>
              </span>
              <span className={`font-mono text-sm font-extrabold ${!hasImages ? isLight ? 'text-slate-400' : 'text-slate-500' : isMatch ? 'text-emerald-500' : 'text-rose-500'}`}>
                {hasImages ? `${faceVerification.similarityScore}%` : '-- %'} (Threshold: 75%)
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
              isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <div
                className={`h-full rounded-full transition-all ${
                  !hasImages ? 'bg-slate-400' : isMatch ? 'bg-accent-600' : 'bg-rose-600'
                }`}
                style={{ width: `${hasImages ? faceVerification.similarityScore : 0}%` }}
              />
            </div>
          </div>

          {/* 3D Liveness & Anti-Spoofing Bar */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
              <span className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                <Activity className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <span>Passive 3D Liveness Confidence:</span>
              </span>
              <span className={`font-mono text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {hasImages ? `${faceVerification.livenessScore}%` : '-- %'}
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
              isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <div
                className="h-full rounded-full bg-slate-500 transition-all"
                style={{ width: `${hasImages ? faceVerification.livenessScore : 0}%` }}
              />
            </div>
          </div>

        </div>

        {/* Granular Attribute Match Indicators */}
        <div className={`border rounded-xl p-4 mb-5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
        }`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Morphological Landmark Consistency
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              {faceVerification.facialAttributesMatch.eyeDistance ? (
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Inter-pupillary Ratio</span>
            </div>

            <div className="flex items-center gap-2">
              {faceVerification.facialAttributesMatch.jawlineConsistency ? (
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Jaw Contour Alignment</span>
            </div>

            <div className="flex items-center gap-2">
              {faceVerification.facialAttributesMatch.skinTextureNatural ? (
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Skin Texture Anti-Spoof</span>
            </div>

            <div className="flex items-center gap-2">
              {faceVerification.facialAttributesMatch.ageProgressionPlausible ? (
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Age Progression</span>
            </div>
          </div>
        </div>

      </div>

      {/* Explanation Banner */}
      <div className={`border rounded-xl p-4 text-xs leading-relaxed shadow-inner ${
        isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#0a0d16] border-slate-800 text-slate-300'
      }`}>
        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>AI Biometric Summary: </span>
        <span>{faceVerification.confidenceExplanation}</span>
      </div>

    </div>
  );
};
