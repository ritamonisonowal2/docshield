export type DocumentType = 
  | 'passport' 
  | 'aadhaar' 
  | 'pan' 
  | 'voter_id' 
  | 'driving_license' 
  | 'visa';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export type ActionDecision = 
  | 'CLEAR_ENTRY' 
  | 'MANUAL_VERIFICATION' 
  | 'SECONDARY_INSPECTION' 
  | 'DENY_ENTRY_DETAIN';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface TamperingIssue {
  id: string;
  type: 
    | 'photo_replacement' 
    | 'text_manipulation' 
    | 'date_alteration' 
    | 'stamp_forgery' 
    | 'splicing_detected' 
    | 'font_anomaly' 
    | 'mrz_mismatch'
    | 'metadata_defect';
  title: string;
  description: string;
  confidence: number; // 0 - 100
  box: BoundingBox;
  severity: 'high' | 'medium' | 'low';
  suspectedMethod?: string;
}

export interface ExtractedDocData {
  documentType: DocumentType;
  documentTypeName: string;
  fullName: string;
  documentNumber: string;
  dateOfBirth: string;
  age?: number;
  gender: string;
  nationality: string;
  issueDate?: string;
  expiryDate?: string;
  isExpired?: boolean;
  address?: string;
  fatherName?: string;
  mrzLine1?: string;
  mrzLine2?: string;
  barcodeData?: string;
  rawOcrText?: string;
}

export interface ValidationCheck {
  id: string;
  title: string;
  category: 'checksum' | 'format' | 'date' | 'security' | 'watchlist';
  status: 'pass' | 'warning' | 'fail';
  valueTested: string;
  expectedPattern?: string;
  reason: string;
  details?: string;
}

export interface FaceVerificationResult {
  matchStatus: 'MATCH' | 'MISMATCH' | 'SUSPICIOUS';
  similarityScore: number; // 0 - 100
  livenessScore: number; // 0 - 100
  livenessStatus: 'PASS' | 'SUSPECTED_SPOOF' | 'UNVERIFIED';
  docFaceUrl?: string;
  liveFaceUrl?: string;
  confidenceExplanation: string;
  facialAttributesMatch: {
    eyeDistance: boolean;
    jawlineConsistency: boolean;
    ageProgressionPlausible: boolean;
    skinTextureNatural: boolean;
  };
}

export interface RiskScoreBreakdown {
  overallRisk: number; // 0 - 100
  riskTier: RiskTier;
  faceMatchScore: number; // weight 35%
  faceLivenessScore: number; // weight 20%
  documentAuthenticityScore: number; // weight 20%
  documentValidityScore: number; // weight 20%
  ocrConsistencyScore: number; // weight 5%
  keyReasons: string[];
  recommendedAction: ActionDecision;
  recommendedActionLabel: string;
  recommendedActionDetails: string;
}

export interface GraphNode {
  id: string;
  label: string;
  subLabel?: string;
  type: 'applicant' | 'doc_id' | 'phone' | 'address' | 'photo_hash' | 'syndicate_hub';
  status: 'clean' | 'suspicious' | 'fraud_ring' | 'active_target';
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  isFraudLink?: boolean;
}

export interface SyndicateGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  fraudRingDetected: boolean;
  syndicateName?: string;
  duplicateCount: number;
  bfsTraversalPaths: string[][];
  explanation: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerId: string;
  documentNumber: string;
  applicantName: string;
  documentType: DocumentType;
  overallRisk: number;
  riskTier: RiskTier;
  decision: ActionDecision | 'PENDING';
  decisionNotes?: string;
  tamperingDetectedCount: number;
  faceMatchPercent: number;
  cryptographicHash: string;
}

export interface ScreeningCase {
  id: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  documentImageUrl: string;
  livePersonImageUrl: string;
  supportingDocImageUrl?: string;
  timestamp?: string;
  extractedData: ExtractedDocData;
  validationChecks: ValidationCheck[];
  tamperingIssues: TamperingIssue[];
  tamperingScore: number; // 0 - 100
  faceVerification: FaceVerificationResult;
  riskBreakdown: RiskScoreBreakdown;
  syndicateGraph: SyndicateGraphData;
  decisionState?: {
    decision: ActionDecision;
    timestamp?: string;
    decidedAt?: string;
    officerNotes: string;
    officerId: string;
    isCommitted?: boolean;
  };
}
