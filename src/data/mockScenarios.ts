import { ScreeningCase } from '../types';
import { generatePassportSVG, generateAadhaarSVG, generatePANSVG } from '../utils/documentCardGenerator';
import { PLACEHOLDER_AVATARS } from '../utils/humanPlaceholder';

const PASSPORT_FORGED_SVG = generatePassportSVG({
  fullName: 'SUBJECT ALPHA',
  passportNo: 'K4892014',
  dob: '14/06/1998',
  sex: 'M',
  nationality: 'INDIAN',
  issueDate: '12/03/2020',
  expiryDate: '11/03/2030',
  mrzLine1: 'P<INDSUBJECT<<ALPHA<<<<<<<<<<<<<<<<<<<<<<<<<',
  mrzLine2: 'K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8',
  isSpliced: true,
  photoUrl: PLACEHOLDER_AVATARS.splicedPassport,
});

const AADHAAR_FORGED_SVG = generateAadhaarSVG({
  fullName: 'SUBJECT BETA',
  aadhaarNo: '8942 5013 7798',
  dob: '22/11/1992',
  gender: 'MALE',
  photoUrl: PLACEHOLDER_AVATARS.malePassport,
});

const PAN_FORGED_SVG = generatePANSVG({
  fullName: 'SUBJECT GAMMA',
  panNo: 'ABCPS1289K',
  fatherName: 'FATHER PLACEHOLDER',
  dob: '05/09/1995',
  photoUrl: PLACEHOLDER_AVATARS.femalePassport,
  hasAlteredStamp: true,
});

const PASSPORT_CLEAN_SVG = generatePassportSVG({
  fullName: 'SUBJECT DELTA',
  passportNo: 'N1938472',
  dob: '18/04/1996',
  sex: 'M',
  nationality: 'INDIAN',
  issueDate: '04/01/2021',
  expiryDate: '03/01/2031',
  mrzLine1: 'P<INDSUBJECT<<DELTA<<<<<<<<<<<<<<<<<<<<<<<<',
  mrzLine2: 'N1938472<4IND9604185M3101037<<<<<<<<<<<<<<4',
  isSpliced: false,
  photoUrl: PLACEHOLDER_AVATARS.malePassport,
});

export const PRESET_SCENARIOS: ScreeningCase[] = [
  {
    id: 'CASE-2026-IND-8821',
    title: 'Photo Splicing & MRZ Checksum Failure',
    description: 'High-risk passport with digitally manipulated portrait photo, altered date of birth (1988 -> 1998), and invalid ICAO Doc 9303 check digit.',
    documentType: 'passport',
    documentImageUrl: PASSPORT_FORGED_SVG,
    livePersonImageUrl: PLACEHOLDER_AVATARS.maleLive,
    extractedData: {
      documentType: 'passport',
      documentTypeName: 'Republic of India Passport (TD3)',
      fullName: 'SUBJECT ALPHA',
      documentNumber: 'K4892014',
      dateOfBirth: '14/06/1998',
      age: 28,
      gender: 'MALE',
      nationality: 'INDIAN',
      issueDate: '12/03/2020',
      expiryDate: '11/03/2030',
      isExpired: false,
      address: 'Address Placeholder, Region A',
      fatherName: 'FATHER PLACEHOLDER',
      mrzLine1: 'P<INDSUBJECT<<ALPHA<<<<<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'K4892014<8IND9806144M3003118<<<<<<<<<<<<<<8',
      rawOcrText: 'REPUBLIC OF INDIA / PASSPORT\nType: P | Country Code: IND | Passport No: K4892014\nSurname: SUBJECT\nGiven Name: ALPHA\nNationality: INDIAN | Sex: M\nDate of Birth: 14/06/1998\nPlace of Birth: [REDACTED]\nDate of Issue: 12/03/2020 | Date of Expiry: 11/03/2030'
    },
    validationChecks: [
      {
        id: 'CHK-01',
        title: 'ICAO Doc 9303 MRZ Checksum',
        category: 'checksum',
        status: 'fail',
        valueTested: 'K4892014<8IND9806144',
        expectedPattern: 'Check digit 8 (calculated: 3)',
        reason: 'MRZ Passport Number check digit failed (expected 3, found 8)',
        details: 'The machine-readable zone check-digit calculation indicates manual character substitution in the visual zone.'
      },
      {
        id: 'CHK-02',
        title: 'DOB vs Age Chronology Check',
        category: 'date',
        status: 'warning',
        valueTested: '14/06/1998 (Altered from 1988)',
        expectedPattern: 'Chronological issue date alignment',
        reason: 'Font baseline offset detected on the third digit of the birth year (9 vs 8)',
        details: 'Micro-print spacing around 1998 displays irregular pixel variance and artifact halos.'
      },
      {
        id: 'CHK-03',
        title: 'Passport Number Format Check',
        category: 'format',
        status: 'pass',
        valueTested: 'K4892014',
        expectedPattern: '^[A-Z][0-9]{7}$',
        reason: 'Matches Indian Passport 8-character format standard',
      },
      {
        id: 'CHK-04',
        title: 'National Watchlist & Interpol DB Scan',
        category: 'watchlist',
        status: 'pass',
        valueTested: 'SUBJECT ALPHA',
        reason: 'No match in international active red notices',
      }
    ],
    tamperingIssues: [
      {
        id: 'TMP-01',
        type: 'photo_replacement',
        title: 'Photo Splicing & Boundary Artifacts',
        description: 'Discontinuous border gradient and cloning artifacts around photo perimeter. The original stamped laminate edge has been digitally spliced.',
        confidence: 94,
        severity: 'high',
        suspectedMethod: 'Copy-Move & Edge Blending (Photoshop / Inpainting)',
        box: { x: 8, y: 20, width: 25, height: 48 }
      },
      {
        id: 'TMP-02',
        type: 'font_anomaly',
        title: 'Font Kerning & Name Typography Anomaly',
        description: 'Glyph kerning and font baseline inconsistency detected across Name & Surname fields ("SUBJECT ALPHA"). ELA compression variance indicates manual vector type overlay.',
        confidence: 89,
        severity: 'high',
        suspectedMethod: 'Font Overlay & Type Inpainting',
        box: { x: 36, y: 26, width: 32, height: 12 }
      },
      {
        id: 'TMP-03',
        type: 'mrz_mismatch',
        title: 'MRZ Checksum Failure',
        description: 'ICAO Doc 9303 TD3 composite check digit does not match visual inspection zone date calculations (Passport check digit failed: expected 3, found 8).',
        confidence: 99,
        severity: 'high',
        suspectedMethod: 'Unsynchronized Visual Zone Editing',
        box: { x: 5, y: 80, width: 90, height: 15 }
      }
    ],
    tamperingScore: 88,
    faceVerification: {
      matchStatus: 'MISMATCH',
      similarityScore: 34,
      livenessScore: 88,
      livenessStatus: 'PASS',
      docFaceUrl: PLACEHOLDER_AVATARS.splicedPassport,
      liveFaceUrl: PLACEHOLDER_AVATARS.maleLive,
      confidenceExplanation: 'Document portrait does not match live traveler biometrics (Cosine similarity: 0.34, below 0.75 threshold). Facial landmark jawline and inter-ocular distance variance exceed security tolerance.',
      facialAttributesMatch: {
        eyeDistance: false,
        jawlineConsistency: false,
        ageProgressionPlausible: false,
        skinTextureNatural: true
      }
    },
    riskBreakdown: {
      overallRisk: 84,
      riskTier: 'HIGH',
      faceMatchScore: 34,
      faceLivenessScore: 88,
      documentAuthenticityScore: 12,
      documentValidityScore: 25,
      ocrConsistencyScore: 70,
      keyReasons: [
        '🚨 Severe photo replacement splicing detected on document laminate',
        '❌ Biometric Face Mismatch: Live traveler does not match document photo (34% similarity)',
        '⚠️ Altered Date of Birth with font kerning mismatch',
        '⚠️ ICAO 9303 MRZ Check digit verification failed'
      ],
      recommendedAction: 'SECONDARY_INSPECTION',
      recommendedActionLabel: 'Escalate to Secondary Inspection',
      recommendedActionDetails: 'Immediate physical document inspection required. Hold traveler at immigration gate for forensic examination.'
    },
    syndicateGraph: {
      fraudRingDetected: false,
      duplicateCount: 1,
      bfsTraversalPaths: [],
      explanation: 'Isolated fraudulent document alteration. No shared syndicate clusters found in central database.',
      nodes: [
        { id: 'app_1', label: 'Subject Alpha', subLabel: 'Applicant (Current)', type: 'applicant', status: 'active_target', x: 250, y: 150 },
        { id: 'doc_1', label: 'Passport K4892014', subLabel: 'Forged ID', type: 'doc_id', status: 'suspicious', x: 100, y: 240 },
        { id: 'phone_1', label: '+91 XXXXX XXXXX', subLabel: 'Mobile', type: 'phone', status: 'clean', x: 400, y: 240 }
      ],
      links: [
        { source: 'app_1', target: 'doc_1', label: 'Presents' },
        { source: 'app_1', target: 'phone_1', label: 'Registered' }
      ]
    }
  },
  {
    id: 'CASE-2026-AAD-9042',
    title: 'Verhoeff Checksum Failure & Fraud Ring',
    description: 'Aadhaar card with invalid Verhoeff checksum algorithm digit. BFS graph traversal exposes an organized identity recycling syndicate across 4 other fraudulent applications.',
    documentType: 'aadhaar',
    documentImageUrl: AADHAAR_FORGED_SVG,
    livePersonImageUrl: PLACEHOLDER_AVATARS.maleLive,
    extractedData: {
      documentType: 'aadhaar',
      documentTypeName: 'UIDAI Aadhaar Card',
      fullName: 'SUBJECT BETA',
      documentNumber: '8942 5013 7798',
      dateOfBirth: '22/11/1992',
      age: 33,
      gender: 'MALE',
      nationality: 'INDIAN',
      address: 'Sample Address Line, Sector 4, Region - 000000',
      fatherName: 'FATHER PLACEHOLDER',
      rawOcrText: 'GOVERNMENT OF INDIA / UNIQUE IDENTIFICATION AUTHORITY OF INDIA\nName: SUBJECT BETA\nDOB: 22/11/1992\nGender: MALE\nAadhaar No: 8942 5013 7798\nAddress: [ADDRESS REDACTED / PLACEHOLDER]'
    },
    validationChecks: [
      {
        id: 'CHK-01',
        title: 'UIDAI Verhoeff Checksum Algorithm',
        category: 'checksum',
        status: 'fail',
        valueTested: '8942 5013 7798',
        expectedPattern: 'Verhoeff Check digit = 2 (Found: 8)',
        reason: 'Verhoeff multiplication & permutation table evaluation returned non-zero (Failed)',
        details: 'The 12th digit 8 fails the mathematical Dihedral Group D5 polynomial equation. Genuine UIDAI check digit for this sequence is 2.'
      },
      {
        id: 'CHK-02',
        title: 'Aadhaar 12-Digit Format',
        category: 'format',
        status: 'pass',
        valueTested: '894250137798',
        expectedPattern: '^[2-9]{1}[0-9]{11}$',
        reason: 'Valid 12-digit numeric length and standard partition',
      },
      {
        id: 'CHK-03',
        title: 'QR Code Signature Verification',
        category: 'security',
        status: 'fail',
        valueTested: 'UIDAI Secure V2 QR Code',
        reason: 'Public key signature verification failed for offline secure XML stream',
      },
      {
        id: 'CHK-04',
        title: 'Syndicate Entity Deduplication',
        category: 'watchlist',
        status: 'fail',
        valueTested: 'Phone + Photo Hash Ring',
        reason: 'Perceptual photo hash matches 3 existing active fraud investigations',
      }
    ],
    tamperingIssues: [
      {
        id: 'TMP-01',
        type: 'text_manipulation',
        title: 'Aadhaar Number Alteration',
        description: 'Digit "7798" overlaid onto existing background guilloche pattern with mismatched stroke weight and micro-font erosion.',
        confidence: 96,
        severity: 'high',
        suspectedMethod: 'Vector Text Modification',
        box: { x: 22, y: 78, width: 56, height: 18 }
      },
      {
        id: 'TMP-02',
        type: 'stamp_forgery',
        title: 'Ashoka Emblem Watermark Artifact',
        description: 'National Emblem logo lacks official UIDAI latent holographic relief; pixel boundaries show anti-aliasing blur.',
        confidence: 88,
        severity: 'medium',
        suspectedMethod: 'Low-Res Stamp Ingestion',
        box: { x: 6, y: 8, width: 22, height: 18 }
      }
    ],
    tamperingScore: 82,
    faceVerification: {
      matchStatus: 'MATCH',
      similarityScore: 91,
      livenessScore: 94,
      livenessStatus: 'PASS',
      docFaceUrl: PLACEHOLDER_AVATARS.malePassport,
      liveFaceUrl: PLACEHOLDER_AVATARS.maleLive,
      confidenceExplanation: 'Live presenter matches the face on the forged document (91% biometric match). This confirms identity synthesis: real person attempting entry with an illicitly forged Aadhaar ID.',
      facialAttributesMatch: {
        eyeDistance: true,
        jawlineConsistency: true,
        ageProgressionPlausible: true,
        skinTextureNatural: true
      }
    },
    riskBreakdown: {
      overallRisk: 82,
      riskTier: 'HIGH',
      faceMatchScore: 91,
      faceLivenessScore: 94,
      documentAuthenticityScore: 18,
      documentValidityScore: 10,
      ocrConsistencyScore: 85,
      keyReasons: [
        '🚨 UIDAI Aadhaar Verhoeff Checksum Algorithm mathematically FAILED',
        '🕸️ BFS Graph Network revealed active Identity Recycling Syndicate (4 connected cases)',
        '⚠️ Aadhaar number digits modified over security micro-print pattern',
        '⚠️ QR Code digital cryptographic signature invalid'
      ],
      recommendedAction: 'DENY_ENTRY_DETAIN',
      recommendedActionLabel: 'Deny Entry & Escalate to Cyber Cell',
      recommendedActionDetails: 'Syndicate-level identity fabrication detected. Freeze applicant record and dispatch alert to Border Cyber Intelligence Unit.'
    },
    syndicateGraph: {
      fraudRingDetected: true,
      syndicateName: 'Sector-4 Multi-Identity Cloning Ring',
      duplicateCount: 5,
      bfsTraversalPaths: [
        ['app_target', 'phone_shared', 'app_case2', 'addr_hub', 'app_case3'],
        ['app_target', 'photo_hash_node', 'app_case4']
      ],
      explanation: 'BFS traversal confirmed applicant shares identical phone (+91 XXXXX XXXXX) and perceptual facial hash (pHash 0xfa39b7) with 3 active fraud cases flagged in Sector Alpha and Sector Beta.',
      nodes: [
        { id: 'app_target', label: 'Subject Beta', subLabel: 'Current Target', type: 'applicant', status: 'active_target', x: 260, y: 180 },
        { id: 'phone_shared', label: '+91 XXXXX XXXXX', subLabel: 'Shared SIM', type: 'phone', status: 'fraud_ring', x: 120, y: 100 },
        { id: 'addr_hub', label: 'Drop Address Hub', subLabel: 'Drop Address', type: 'address', status: 'fraud_ring', x: 420, y: 100 },
        { id: 'photo_hash_node', label: 'pHash #9F82A1', subLabel: 'Biometric Duplicate', type: 'photo_hash', status: 'fraud_ring', x: 260, y: 300 },
        { id: 'app_case2', label: 'Subject X-1', subLabel: 'Flagged Applicant #2', type: 'applicant', status: 'fraud_ring', x: 60, y: 220 },
        { id: 'app_case3', label: 'Subject X-2', subLabel: 'Flagged Applicant #3', type: 'applicant', status: 'fraud_ring', x: 460, y: 220 },
        { id: 'app_case4', label: 'Subject X-3', subLabel: 'Flagged Applicant #4', type: 'applicant', status: 'fraud_ring', x: 160, y: 380 }
      ],
      links: [
        { source: 'app_target', target: 'phone_shared', label: 'Linked Phone', isFraudLink: true },
        { source: 'app_target', target: 'addr_hub', label: 'Linked Address', isFraudLink: true },
        { source: 'app_target', target: 'photo_hash_node', label: 'Exact Face Match', isFraudLink: true },
        { source: 'app_case2', target: 'phone_shared', label: 'Shared SIM', isFraudLink: true },
        { source: 'app_case3', target: 'addr_hub', label: 'Shared Drop', isFraudLink: true },
        { source: 'app_case4', target: 'photo_hash_node', label: 'Duplicate Bio', isFraudLink: true }
      ]
    }
  },
  {
    id: 'CASE-2026-PAN-4190',
    title: 'PAN 5th-Char Anomaly & Digital Stamp',
    description: 'Income Tax PAN Card with altered surname initial (5th char mismatch with applicant surname) and copy-pasted QR code stamp.',
    documentType: 'pan',
    documentImageUrl: PAN_FORGED_SVG,
    livePersonImageUrl: PLACEHOLDER_AVATARS.femaleLive,
    extractedData: {
      documentType: 'pan',
      documentTypeName: 'Income Tax Department PAN Card',
      fullName: 'SUBJECT GAMMA',
      documentNumber: 'ABCPS1289K',
      dateOfBirth: '05/09/1995',
      age: 30,
      gender: 'FEMALE',
      nationality: 'INDIAN',
      fatherName: 'FATHER PLACEHOLDER',
      rawOcrText: 'INCOME TAX DEPARTMENT / GOVT. OF INDIA\nPermanent Account Number: ABCPS1289K\nName: SUBJECT GAMMA\nFather\'s Name: FATHER PLACEHOLDER\nDate of Birth: 05/09/1995'
    },
    validationChecks: [
      {
        id: 'CHK-01',
        title: 'PAN 5th Character Surname Consistency',
        category: 'format',
        status: 'fail',
        valueTested: 'ABCPS1289K (5th char = S)',
        expectedPattern: '5th char should match surname initial (G)',
        reason: '5th character "S" indicates surname starting with S, but applicant surname starts with "G" (mismatch)',
        details: 'Income Tax rules mandate that 5th character of an individual PAN must be the first letter of the individual\'s surname/last name.'
      },
      {
        id: 'CHK-02',
        title: 'PAN 4th Character Status Code',
        category: 'format',
        status: 'pass',
        valueTested: 'P',
        expectedPattern: 'P = Individual Person',
        reason: 'Correctly identifies Individual Person entity type',
      },
      {
        id: 'CHK-03',
        title: 'Standard PAN Regex Format',
        category: 'format',
        status: 'pass',
        valueTested: 'ABCPS1289K',
        expectedPattern: '^[A-Z]{5}[0-9]{4}[A-Z]$',
        reason: 'Conforms to basic 10-character alphanumeric structure',
      }
    ],
    tamperingIssues: [
      {
        id: 'TMP-01',
        type: 'font_anomaly',
        title: 'Font & Kerning Inconsistency',
        description: 'Letter "S" in the PAN number uses standard Arial typeface instead of the specialized security OCR-B font utilized by NSDL/UTIITSL.',
        confidence: 91,
        severity: 'high',
        suspectedMethod: 'Glyph Replacement',
        box: { x: 38, y: 74, width: 44, height: 18 }
      },
      {
        id: 'TMP-02',
        type: 'stamp_forgery',
        title: 'Digital Emblem Halo',
        description: 'Income Tax seal has square compression boundary artifacts suggesting digital insertion over an existing card template.',
        confidence: 76,
        severity: 'medium',
        suspectedMethod: 'Image Splicing',
        box: { x: 74, y: 28, width: 22, height: 32 }
      }
    ],
    tamperingScore: 68,
    faceVerification: {
      matchStatus: 'MATCH',
      similarityScore: 88,
      livenessScore: 92,
      livenessStatus: 'PASS',
      docFaceUrl: PLACEHOLDER_AVATARS.femalePassport,
      liveFaceUrl: PLACEHOLDER_AVATARS.femaleLive,
      confidenceExplanation: 'Live presenter matches document portrait (88% similarity). However, document exhibits syntactical structure tampering.',
      facialAttributesMatch: {
        eyeDistance: true,
        jawlineConsistency: true,
        ageProgressionPlausible: true,
        skinTextureNatural: true
      }
    },
    riskBreakdown: {
      overallRisk: 64,
      riskTier: 'MEDIUM',
      faceMatchScore: 88,
      faceLivenessScore: 92,
      documentAuthenticityScore: 32,
      documentValidityScore: 40,
      ocrConsistencyScore: 80,
      keyReasons: [
        '⚠️ PAN 5th character syntax violation (Surname initial mismatch: "S" vs G)',
        '⚠️ Security OCR-B font mismatch on document number',
        '⚠️ Digital stamp copy-paste artifacts detected'
      ],
      recommendedAction: 'MANUAL_VERIFICATION',
      recommendedActionLabel: 'Manual Verification Required',
      recommendedActionDetails: 'Request secondary supporting identification (Aadhaar or Passport) to reconcile PAN record with Income Tax database.'
    },
    syndicateGraph: {
      fraudRingDetected: false,
      duplicateCount: 0,
      bfsTraversalPaths: [],
      explanation: 'No syndicate links detected for this record.',
      nodes: [
        { id: 'app_1', label: 'Subject Gamma', subLabel: 'Applicant', type: 'applicant', status: 'active_target', x: 250, y: 150 },
        { id: 'doc_1', label: 'PAN ABCPS1289K', subLabel: 'Altered PAN', type: 'doc_id', status: 'suspicious', x: 120, y: 250 },
        { id: 'phone_1', label: '+91 XXXXX XXXXX', subLabel: 'Mobile', type: 'phone', status: 'clean', x: 380, y: 250 }
      ],
      links: [
        { source: 'app_1', target: 'doc_1', label: 'Presents' },
        { source: 'app_1', target: 'phone_1', label: 'Registered' }
      ]
    }
  },
  {
    id: 'CASE-2026-GEN-1004',
    title: 'Authentic Verified Clearance Baseline',
    description: 'Fully genuine Indian Passport with 100% cryptographic MRZ match, authentic micro-text, 0 tampering indicators, and 98% live biometric match.',
    documentType: 'passport',
    documentImageUrl: PASSPORT_CLEAN_SVG,
    livePersonImageUrl: PLACEHOLDER_AVATARS.maleLive,
    extractedData: {
      documentType: 'passport',
      documentTypeName: 'Republic of India Passport (TD3 Genuine)',
      fullName: 'SUBJECT DELTA',
      documentNumber: 'N1938472',
      dateOfBirth: '18/04/1996',
      age: 30,
      gender: 'MALE',
      nationality: 'INDIAN',
      issueDate: '04/01/2021',
      expiryDate: '03/01/2031',
      isExpired: false,
      address: 'Sample Address Line, Sector 9, Region - 000000',
      fatherName: 'FATHER PLACEHOLDER',
      mrzLine1: 'P<INDSUBJECT<<DELTA<<<<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'N1938472<4IND9604185M3101037<<<<<<<<<<<<<<4',
      rawOcrText: 'REPUBLIC OF INDIA / PASSPORT\nType: P | Country Code: IND | Passport No: N1938472\nSurname: SUBJECT\nGiven Name: DELTA\nNationality: INDIAN | Sex: M\nDate of Birth: 18/04/1996\nDate of Issue: 04/01/2021 | Date of Expiry: 03/01/2031'
    },
    validationChecks: [
      {
        id: 'CHK-01',
        title: 'ICAO Doc 9303 MRZ Checksum',
        category: 'checksum',
        status: 'pass',
        valueTested: 'N1938472<4IND9604185M3101037<<<<<<<<<<<<<<4',
        reason: 'All 4 ICAO 9303 check digits pass (Passport, DOB, Expiry, Composite)',
      },
      {
        id: 'CHK-02',
        title: 'Document Validity & Expiry',
        category: 'date',
        status: 'pass',
        valueTested: 'Valid until 03/01/2031',
        reason: 'Document is active with 4+ years remaining validity',
      },
      {
        id: 'CHK-03',
        title: 'Micro-print Hologram & UV Features',
        category: 'security',
        status: 'pass',
        valueTested: 'Latent UV Guilloche Patterns',
        reason: 'Holographic diffraction pattern conforms to India Security Press standard',
      },
      {
        id: 'CHK-04',
        title: 'Watchlist / Sanctions Check',
        category: 'watchlist',
        status: 'pass',
        valueTested: 'SUBJECT DELTA',
        reason: 'Clean record across all international immigration databases',
      }
    ],
    tamperingIssues: [],
    tamperingScore: 4,
    faceVerification: {
      matchStatus: 'MATCH',
      similarityScore: 98,
      livenessScore: 99,
      livenessStatus: 'PASS',
      docFaceUrl: PLACEHOLDER_AVATARS.malePassport,
      liveFaceUrl: PLACEHOLDER_AVATARS.maleLive,
      confidenceExplanation: 'High-confidence biometric match (98% similarity). 3D facial depth and natural skin texture confirmed live presenter authenticity.',
      facialAttributesMatch: {
        eyeDistance: true,
        jawlineConsistency: true,
        ageProgressionPlausible: true,
        skinTextureNatural: true
      }
    },
    riskBreakdown: {
      overallRisk: 8,
      riskTier: 'LOW',
      faceMatchScore: 98,
      faceLivenessScore: 99,
      documentAuthenticityScore: 96,
      documentValidityScore: 100,
      ocrConsistencyScore: 98,
      keyReasons: [
        '✅ 100% Cryptographic ICAO MRZ verification passed',
        '✅ High-fidelity biometric face match (98%) & liveness confirmed',
        '✅ Zero physical or digital tampering detected',
        '✅ Clean immigration and security record'
      ],
      recommendedAction: 'CLEAR_ENTRY',
      recommendedActionLabel: 'Clear & Fast-Track Entry',
      recommendedActionDetails: 'All biometric, forensic, and database security checks verified. Approve immigration clearance.'
    },
    syndicateGraph: {
      fraudRingDetected: false,
      duplicateCount: 0,
      bfsTraversalPaths: [],
      explanation: 'Clean single applicant node. No flagged links.',
      nodes: [
        { id: 'app_1', label: 'Subject Delta', subLabel: 'Verified Traveler', type: 'applicant', status: 'clean', x: 250, y: 150 },
        { id: 'doc_1', label: 'Passport N1938472', subLabel: 'Genuine Passport', type: 'doc_id', status: 'clean', x: 120, y: 250 },
        { id: 'phone_1', label: '+91 XXXXX XXXXX', subLabel: 'Primary Mobile', type: 'phone', status: 'clean', x: 380, y: 250 }
      ],
      links: [
        { source: 'app_1', target: 'doc_1', label: 'Presents' },
        { source: 'app_1', target: 'phone_1', label: 'Registered' }
      ]
    }
  }
];
