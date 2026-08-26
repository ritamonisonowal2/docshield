// In-memory store for hackathon demo
const auditLogs: any[] = [];

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ logs: auditLogs });
  }

  if (req.method === 'POST') {
    const {
      officerId, applicantName, documentNumber, documentType,
      overallRisk, riskTier, decision, decisionNotes,
      tamperingDetectedCount, faceMatchPercent,
    } = req.body;

    const newId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timestamp = `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;
    const cryptographicHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

    const entry = {
      id: newId,
      timestamp,
      officerId: officerId || 'OFFICER-IND-7492',
      applicantName: applicantName || 'Unnamed Applicant',
      documentNumber: documentNumber || 'DOC-UNKNOWN',
      documentType: documentType || 'passport',
      overallRisk: overallRisk ?? 50,
      riskTier: riskTier || 'MEDIUM',
      decision: decision || 'PENDING',
      decisionNotes: decisionNotes || '',
      tamperingDetectedCount: tamperingDetectedCount || 0,
      faceMatchPercent: faceMatchPercent || 0,
      cryptographicHash,
    };

    auditLogs.unshift(entry);
    return res.status(200).json({ success: true, entry });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
