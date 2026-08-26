import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { analyzeDocumentWithGemini } from './src/server/geminiService';
import { validateVerhoeff, validatePanCard, verifyPassportMrz, generateAuditHash } from './src/utils/algorithms';
import { AuditLogEntry } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Body parser with 50mb limit for high-resolution document images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory Audit Trail store — starts empty, populated by real officer decisions
const auditLogs: AuditLogEntry[] = [];


// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SIH26188 AI Document & Fake ID Screening Server',
    version: '1.0.0',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Document Analysis Endpoint
app.post('/api/analyze-document', async (req, res) => {
  try {
    const { documentImageBase64, documentType, livePersonImageBase64, supportingDocImageBase64 } = req.body;

    if (!documentImageBase64) {
      return res.status(400).json({ error: 'documentImageBase64 is required' });
    }

    const result = await analyzeDocumentWithGemini({
      documentImageBase64,
      documentType: documentType || 'passport',
      livePersonImageBase64,
      supportingDocImageBase64,
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error during forensic analysis',
    });
  }
});

// Verhoeff Algorithm Test Endpoint
app.post('/api/validate-verhoeff', (req, res) => {
  const { aadhaarNumber } = req.body;
  if (!aadhaarNumber) {
    return res.status(400).json({ error: 'aadhaarNumber is required' });
  }
  const result = validateVerhoeff(aadhaarNumber);
  res.json(result);
});

// PAN Validation Test Endpoint
app.post('/api/validate-pan', (req, res) => {
  const { panNumber, applicantName } = req.body;
  if (!panNumber) {
    return res.status(400).json({ error: 'panNumber is required' });
  }
  const result = validatePanCard(panNumber, applicantName);
  res.json(result);
});

// MRZ Validation Test Endpoint
app.post('/api/validate-mrz', (req, res) => {
  const { mrzLine2 } = req.body;
  if (!mrzLine2) {
    return res.status(400).json({ error: 'mrzLine2 is required' });
  }
  const result = verifyPassportMrz(mrzLine2);
  res.json(result);
});

// Audit Trail Endpoints
app.get('/api/audit-logs', (req, res) => {
  res.json({ logs: auditLogs });
});

app.post('/api/audit-logs', (req, res) => {
  const {
    officerId,
    applicantName,
    documentNumber,
    documentType,
    overallRisk,
    riskTier,
    decision,
    decisionNotes,
    tamperingDetectedCount,
    faceMatchPercent,
  } = req.body;

  const newId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timestamp = `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;
  const cryptographicHash = generateAuditHash(newId, officerId || 'OFFICER-7492', overallRisk || 50);

  const entry: AuditLogEntry = {
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
  res.json({ success: true, entry });
});

// ==========================================
// Vite Middleware / Static Serving
// ==========================================
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIH26188 Screening System running at http://0.0.0.0:${PORT}`);
  });
}

start();
