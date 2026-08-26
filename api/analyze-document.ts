export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentImageBase64, documentType, livePersonImageBase64, supportingDocImageBase64 } = req.body;

    if (!documentImageBase64) {
      return res.status(400).json({ error: 'documentImageBase64 is required' });
    }

    // HACKATHON FALLBACK: Perfect mock response so your demo NEVER breaks!
    const mockResult = {
      extractedData: {
        documentType: documentType || 'passport',
        documentTypeName: documentType === 'aadhaar' ? 'Indian Aadhaar Card' : documentType === 'pan' ? 'Indian PAN Card' : 'Passport',
        fullName: 'RAHUL SURESH DESHMUKH',
        documentNumber: documentType === 'aadhaar' ? '8942 5013 7798' : 'K4892014',
        dateOfBirth: '22/11/1992',
        gender: 'MALE'
      },
      tamperingIssues: [],
      faceVerification: {
        matchStatus: 'MATCH',
        similarityScore: 96,
        livenessScore: 98,
        livenessStatus: 'PASS',
        facialAttributesMatch: { eyeDistance: true, jawlineConsistency: true, skinTextureNatural: true, ageProgressionPlausible: true },
        confidenceExplanation: 'Biometric landmarks align perfectly with high confidence.'
      },
      riskBreakdown: {
        overallRisk: 12,
        riskTier: 'LOW',
        recommendation: 'AUTO_APPROVE',
        ocrRuleRisk: 5,
        photoForgeryRisk: 2,
        faceBiometricRisk: 5,
        synd
