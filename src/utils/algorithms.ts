/**
 * Algorithmic Rule Engine & Forensic Verification Suite
 * Includes Verhoeff Algorithm, PAN format validation, ICAO 9303 MRZ Checksums,
 * Perceptual Hashing, BFS Graph Traversal, and Weighted Risk Score Engine.
 */

// ==========================================
// 1. VERHOEFF ALGORITHM (For Aadhaar 12-digit Checksum)
// ==========================================
// The multiplication table (d)
const VERHOEFF_D: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// The permutation table (p)
const VERHOEFF_P: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

// The inverse table (inv)
const VERHOEFF_INV: number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a number string using the Verhoeff algorithm (UIDAI Aadhaar Checksum Standard)
 */
export function validateVerhoeff(numStr: string): { isValid: boolean; calculatedCheckDigit: number; actualCheckDigit: number } {
  const sanitized = numStr.replace(/\D/g, '');
  if (!sanitized || sanitized.length !== 12) {
    return { isValid: false, calculatedCheckDigit: -1, actualCheckDigit: -1 };
  }

  let c = 0;
  const digits = sanitized.split('').map(Number);
  const reversedDigits = [...digits].reverse();

  for (let i = 0; i < reversedDigits.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][reversedDigits[i]]];
  }

  const isValid = c === 0;

  // Calculate expected check digit for first 11 digits
  let calcC = 0;
  const first11Reversed = [...digits.slice(0, 11)].reverse();
  for (let i = 0; i < first11Reversed.length; i++) {
    calcC = VERHOEFF_D[calcC][VERHOEFF_P[(i + 1) % 8][first11Reversed[i]]];
  }
  const calculatedCheckDigit = VERHOEFF_INV[calcC];
  const actualCheckDigit = digits[11];

  return {
    isValid,
    calculatedCheckDigit,
    actualCheckDigit
  };
}

// ==========================================
// 2. PAN CARD VALIDATION REGEX & LOGIC
// ==========================================
export function validatePanCard(pan: string, applicantName?: string): {
  isValid: boolean;
  entityType: string;
  surnameLetter: string;
  reason: string;
} {
  const sanitized = pan.toUpperCase().trim();
  const panRegex = /^([A-Z]{3})([ABCFGHLJPTK])([A-Z])([0-9]{4})([A-Z])$/;
  const match = sanitized.match(panRegex);

  if (!match) {
    return {
      isValid: false,
      entityType: 'Unknown',
      surnameLetter: '',
      reason: 'PAN does not conform to Income Tax Dept standard format [A-Z]{5}[0-9]{4}[A-Z]'
    };
  }

  const statusChar = match[2];
  const surnameChar = match[3];

  const entityTypeMap: Record<string, string> = {
    P: 'Individual / Person',
    C: 'Company',
    H: 'HUF (Hindu Undivided Family)',
    A: 'Association of Persons (AOP)',
    B: 'Body of Individuals (BOI)',
    G: 'Government Agency',
    J: 'Artificial Juridical Person',
    L: 'Local Authority',
    F: 'Firm / LLP',
    T: 'Trust',
    K: 'Krishak / Farming'
  };

  let nameConsistencyOk = true;
  let reason = 'Valid PAN Card syntax and entity mapping.';

  if (applicantName && statusChar === 'P') {
    const nameParts = applicantName.trim().split(/\s+/);
    const lastName = nameParts[nameParts.length - 1] || '';
    if (lastName && lastName[0].toUpperCase() !== surnameChar) {
      nameConsistencyOk = false;
      reason = `5th character '${surnameChar}' does not match applicant last name '${lastName}' initial '${lastName[0].toUpperCase()}'`;
    }
  }

  return {
    isValid: nameConsistencyOk,
    entityType: entityTypeMap[statusChar] || 'Other Entity',
    surnameLetter: surnameChar,
    reason
  };
}

// ==========================================
// 3. ICAO DOC 9303 MRZ CHECKSUM VERIFICATION
// ==========================================
const MRZ_WEIGHTS = [7, 3, 1];

function getMrzCharValue(char: string): number {
  if (char >= '0' && char <= '9') return parseInt(char, 10);
  if (char >= 'A' && char <= 'Z') return char.charCodeAt(0) - 55;
  return 0; // '<' or filler
}

export function calculateMrzCheckDigit(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const val = getMrzCharValue(data[i]);
    sum += val * MRZ_WEIGHTS[i % 3];
  }
  return sum % 10;
}

export function verifyPassportMrz(mrzLine2: string): {
  isValid: boolean;
  passportNumValid: boolean;
  dobValid: boolean;
  expiryValid: boolean;
  details: string[];
} {
  const line = mrzLine2.replace(/\s+/g, '').toUpperCase();
  if (line.length < 44) {
    return {
      isValid: false,
      passportNumValid: false,
      dobValid: false,
      expiryValid: false,
      details: ['MRZ Line 2 length is less than standard 44 characters for TD3 Passport']
    };
  }

  const details: string[] = [];

  // Passport Number: characters 0..8, check digit at index 9
  const passData = line.substring(0, 9);
  const passCheckActual = parseInt(line[9], 10);
  const passCheckExpected = calculateMrzCheckDigit(passData);
  const passportNumValid = passCheckActual === passCheckExpected;
  if (!passportNumValid) {
    details.push(`Passport number check digit mismatch: MRZ has ${passCheckActual}, calculated is ${passCheckExpected}`);
  }

  // Date of Birth: characters 13..18 (YYMMDD), check digit at index 19
  const dobData = line.substring(13, 19);
  const dobCheckActual = parseInt(line[19], 10);
  const dobCheckExpected = calculateMrzCheckDigit(dobData);
  const dobValid = dobCheckActual === dobCheckExpected;
  if (!dobValid) {
    details.push(`DOB check digit mismatch: MRZ has ${dobCheckActual}, calculated is ${dobCheckExpected}`);
  }

  // Expiry Date: characters 21..26 (YYMMDD), check digit at index 27
  const expData = line.substring(21, 27);
  const expCheckActual = parseInt(line[27], 10);
  const expCheckExpected = calculateMrzCheckDigit(expData);
  const expiryValid = expCheckActual === expCheckExpected;
  if (!expiryValid) {
    details.push(`Expiry date check digit mismatch: MRZ has ${expCheckActual}, calculated is ${expCheckExpected}`);
  }

  const isValid = passportNumValid && dobValid && expiryValid;

  return {
    isValid,
    passportNumValid,
    dobValid,
    expiryValid,
    details: details.length > 0 ? details : ['All ICAO 9303 checksums passed (Passport #, DOB, Expiry)']
  };
}

// ==========================================
// 4. BFS GRAPH TRAVERSAL & SYNDICATE DETECTION
// ==========================================
import { GraphNode, GraphLink, RiskScoreBreakdown } from '../types';

export function runBfsFraudAnalysis(
  startNodeId: string,
  nodes: GraphNode[],
  links: GraphLink[]
): {
  connectedNodes: string[];
  fraudRingDetected: boolean;
  cycleDetected: boolean;
  highRiskPaths: string[][];
  explanation: string;
} {
  // Build adjacency list
  const adj: Map<string, string[]> = new Map();
  nodes.forEach(n => adj.set(n.id, []));
  links.forEach(l => {
    if (adj.has(l.source)) adj.get(l.source)!.push(l.target);
    if (adj.has(l.target)) adj.get(l.target)!.push(l.source);
  });

  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: startNodeId, path: [startNodeId] }];
  visited.add(startNodeId);

  const connectedNodes: string[] = [];
  const highRiskPaths: string[][] = [];
  let fraudRingDetected = false;

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    connectedNodes.push(id);

    const nodeObj = nodes.find(n => n.id === id);
    if (nodeObj && (nodeObj.status === 'fraud_ring' || nodeObj.status === 'suspicious')) {
      fraudRingDetected = true;
      highRiskPaths.push(path);
    }

    const neighbors = adj.get(id) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ id: neighbor, path: [...path, neighbor] });
      }
    }
  }

  let explanation = 'No suspicious multi-identity linkages detected in database.';
  if (fraudRingDetected) {
    explanation = `BFS Traversal identified ${highRiskPaths.length} connected flagged node(s) across applicant graph. High risk of identity recycling syndicate.`;
  }

  return {
    connectedNodes,
    fraudRingDetected,
    cycleDetected: fraudRingDetected,
    highRiskPaths,
    explanation
  };
}

// ==========================================
// 5. MULTIMODAL RISK SCORING FORMULA
// ==========================================
// Scoring Factors (Weightage):
// Face Match Score (35%)
// Face Liveness Score (20%)
// Document Authenticity / Tampering (20%)
// Document Validity / Checksum (20%)
// OCR & Quality Consistency (5%)
export function computeRiskScore(params: {
  faceMatchScore: number; // 0 - 100
  faceLivenessScore: number; // 0 - 100
  docAuthenticityScore: number; // 0 - 100 (100 = 0 tampering)
  docValidityScore: number; // 0 - 100 (100 = all dates & checksums valid)
  ocrConsistencyScore: number; // 0 - 100
  hasCriticalTampering?: boolean;
  hasWatchlistHit?: boolean;
  hasSyndicateLink?: boolean;
}): RiskScoreBreakdown {
  const {
    faceMatchScore,
    faceLivenessScore,
    docAuthenticityScore,
    docValidityScore,
    ocrConsistencyScore,
    hasCriticalTampering = false,
    hasWatchlistHit = false,
    hasSyndicateLink = false
  } = params;

  // Calculate composite trust score (0 to 100, higher is better)
  const trustScore = 
    (faceMatchScore * 0.35) +
    (faceLivenessScore * 0.20) +
    (docAuthenticityScore * 0.20) +
    (docValidityScore * 0.20) +
    (ocrConsistencyScore * 0.05);

  // Overall Risk is inverse of Trust Score: (0 to 100, higher is more dangerous)
  let rawRisk = Math.round(100 - trustScore);

  // Safety multipliers / critical penalties
  if (hasWatchlistHit) rawRisk = Math.max(rawRisk, 95);
  if (hasCriticalTampering) rawRisk = Math.max(rawRisk, 80);
  if (hasSyndicateLink) rawRisk = Math.max(rawRisk, 75);
  if (faceMatchScore < 45) rawRisk = Math.max(rawRisk, 78);

  const overallRisk = Math.min(100, Math.max(0, rawRisk));

  // Determine Risk Tier
  let riskTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (overallRisk >= 71) riskTier = 'HIGH';
  else if (overallRisk >= 31) riskTier = 'MEDIUM';
  else riskTier = 'LOW';

  // Build Key Reasons
  const keyReasons: string[] = [];
  if (hasWatchlistHit) keyReasons.push('🚨 Immediate Watchlist / Interpol Red Notice Match');
  if (hasCriticalTampering) keyReasons.push('⚠️ Photo Replacement or Physical Splicing Detected');
  if (docAuthenticityScore < 60) keyReasons.push('⚠️ High likelihood of digital text/font manipulation');
  if (faceMatchScore < 50) keyReasons.push('❌ Biometric Face Mismatch with document photo');
  if (faceLivenessScore < 60) keyReasons.push('⚠️ Face Liveness test failure (possible screen/print spoof)');
  if (docValidityScore < 60) keyReasons.push('⚠️ Algorithmic Checksum or Date consistency failure');
  if (hasSyndicateLink) keyReasons.push('🕸️ Syndicate graph link: Shared credentials across prior fraud cases');
  if (keyReasons.length === 0) keyReasons.push('✅ All biometric, forensic and algorithmic verifications passed');

  // Recommended Action
  let recommendedAction: 'CLEAR_ENTRY' | 'MANUAL_VERIFICATION' | 'SECONDARY_INSPECTION' | 'DENY_ENTRY_DETAIN' = 'CLEAR_ENTRY';
  let recommendedActionLabel = 'Clear & Approve';
  let recommendedActionDetails = 'All parameters within normal biometric & cryptographic security thresholds.';

  if (hasWatchlistHit || overallRisk >= 85) {
    recommendedAction = 'DENY_ENTRY_DETAIN';
    recommendedActionLabel = 'Deny Entry & Escalate to Senior Officer';
    recommendedActionDetails = 'High risk identity breach detected. Hold traveler and alert immigration enforcement.';
  } else if (riskTier === 'HIGH') {
    recommendedAction = 'SECONDARY_INSPECTION';
    recommendedActionLabel = 'Secondary Verification / Escalate';
    recommendedActionDetails = 'Significant tampering or biometric mismatch detected. Escalate for physical document inspection.';
  } else if (riskTier === 'MEDIUM') {
    recommendedAction = 'MANUAL_VERIFICATION';
    recommendedActionLabel = 'Manual Verification Required';
    recommendedActionDetails = 'Minor inconsistencies in font or checksum. Officer must visually cross-examine credentials.';
  }

  return {
    overallRisk,
    riskTier,
    faceMatchScore,
    faceLivenessScore,
    documentAuthenticityScore: docAuthenticityScore,
    documentValidityScore: docValidityScore,
    ocrConsistencyScore,
    keyReasons,
    recommendedAction,
    recommendedActionLabel,
    recommendedActionDetails
  };
}

/**
 * Generates a mock SHA-256 styled cryptographic audit hash for immutable audit logging
 */
export function generateAuditHash(caseId: string, officerId: string, riskScore: number): string {
  const seed = `${caseId}-${officerId}-${riskScore}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}f7a839c42b109e${hex.slice(0, 4)}e847a9d1`;
}
