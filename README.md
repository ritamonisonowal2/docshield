# DocShield AI — Autonomous Document Forensics & Biometric Fraud Defense

DocShield AI is an enterprise-grade forensic document intelligence platform designed to eliminate identity theft, synthetic identity fraud, document tampering, and organized identity syndicates during digital customer onboarding (e-KYC).

---

## 📌 Key Capabilities

- **Deep Multimodal Forensic Vision**: Identifies font kerning irregularities, photo splicing boundary halos, copy-move clone stamp artifacts, and digital micro-pattern disruptions.
- **Deterministic Checksum Validation**:
  - **UIDAI Aadhaar Algorithm**: Dihedral group $D_5$ Verhoeff permutation verification for 12-digit UID numbers.
  - **ICAO Doc 9303 MRZ Engine**: Modulo 10 checksum verification with cyclic $7-3-1$ weighting across standard TD1, TD2, and TD3 Machine Readable Zones.
  - **Indian Income Tax PAN Syntax**: Format parsing with entity classification (Individual, Company, Firm, Trust) and surname letter matching.
- **Biometric 1:1 Facial Comparator**: Real-time landmark alignment, inter-pupillary distance verification, passive liveness scoring, and presentation attack detection (PAD).
- **Syndicate & Fraud Ring Graph Analysis**: Real-time BFS graph traversal identifying shared biometric vectors, duplicate IDs, and cluster anchors.
- **Configurable Risk Policy Engine**: Dynamic mathematical risk modeling with adjustable risk thresholds and full officer audit trail logging.
- **Dual-Mode Processing Architecture**: Server-side multimodal reasoning powered by Google Gemini with automatic fallback to local deterministic forensic engines.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    React 18 + Vite Client                   │
│  • Document & Live Biometric Capture (Webcam & File Upload) │
│  • Forensic Zoom & Multi-Spectrum Optical Filter Canvas     │
│  • Interactive Syndicate Graph (SVG D3/Graph Layout)        │
│  • Policy Rules Playground & Officer Audit Dossier Modal    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP POST /api/analyze
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express Node.js Backend                    │
│                     (Port 3000 / ESM)                       │
│  • API Route Gateway & Image Normalizer                     │
│  • Gemini Multimodal Analysis Service (geminiService.ts)    │
│  • Resilient Timeout & High-Availability Fallback Router    │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                ▼ (Primary)                   ▼ (Fallback)
┌──────────────────────────────┐ ┌────────────────────────────┐
│   Gemini Multimodal API      │ │ Local Deterministic Engine │
│ • Neural Tamper Detection    │ │ • UIDAI Verhoeff ($D_5$)   │
│ • OCR & Field Extraction     │ │ • ICAO MRZ Mod-10 (7-3-1)  │
│ • Biometric Similarity       │ │ • PAN Syntax & Entity Code │
│ • Forensic Reasoning Report  │ │ • Risk Scoring Algorithms  │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone <repository-url>
cd docshield-ai
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note: If no API key is provided, the platform automatically utilizes its built-in deterministic mathematical and forensic rules engine.*

### 3. Development Server
Start the local development server:
```bash
npm run dev
```
The application will be accessible at: `http://localhost:3000`

### 4. Production Build & Start
Compile client assets and bundle the server:
```bash
npm run build
npm start
```

---

## 🗂️ Project Directory Structure

```text
├── server.ts                       # Express backend server entrypoint & API routes
├── src/
│   ├── main.tsx                    # React DOM client entrypoint
│   ├── App.tsx                     # Main dashboard container & state coordinator
│   ├── index.css                   # Tailwind CSS global styles
│   ├── types.ts                    # TypeScript data contracts & risk schemas
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar with status and theme toggles
│   │   ├── LandingPage.tsx         # Platform overview and workflow guide
│   │   ├── InputCaptureSection.tsx # Webcam capture, file uploads, sample presets
│   │   ├── DocumentForensicViewer.tsx # High-res lens zoom, optical filters, bounding boxes
│   │   ├── FaceBiometricComparator.tsx# 1:1 facial biometric matching & landmark overlays
│   │   ├── RiskScoreGauge.tsx      # Multi-dimensional risk score meter & radar breakdown
│   │   ├── ValidationRuleTable.tsx # Pass/Fail checksum and security checks table
│   │   ├── OfficerDecisionPanel.tsx# Officer review actions (Approve / Escalate / Reject)
│   │   ├── SyndicateGraphVisualizer.tsx # Graph visualizer for fraud networks
│   │   ├── ScenarioSelector.tsx    # Pre-configured test scenarios
│   │   ├── AuditTrailModal.tsx     # Session activity and decision history
│   │   ├── CaseDossierModal.tsx    # Comprehensive exportable investigation dossier
│   │   └── RuleEnginePlaygroundModal.tsx # Dynamic risk weight tuning modal
│   ├── server/
│   │   └── geminiService.ts        # Gemini integration and prompt engineering
│   ├── utils/
│   │   ├── algorithms.ts           # Verhoeff, MRZ, PAN, and Risk Scoring math
│   │   ├── documentCardGenerator.ts# Synthetic document SVG template generator
│   │   └── humanPlaceholder.ts     # Biometric vector avatars and silhouettes
│   └── data/
│       └── mockScenarios.ts        # Sample fraud scenarios (tampered, clean, syndicates)
├── package.json                    # Scripts and dependencies
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build tooling configuration
```

---

## 🧪 Supported Document Standards & Validation Algorithms

| Document Type | Standard / Authority | Validation Engine |
| :--- | :--- | :--- |
| **Aadhaar Card** | Unique Identification Authority of India (UIDAI) | 12-digit Verhoeff Dihedral $D_5$ permutation group validation |
| **Passport** | International Civil Aviation Organization (ICAO Doc 9303) | TD3 / TD1 MRZ check digits with cyclic $7-3-1$ weighting |
| **PAN Card** | Income Tax Department of India | 10-character syntax check (`[A-Z]{5}[0-9]{4}[A-Z]`), 4th-char entity validation, 5th-char surname alignment |
| **Driving License / National ID** | Regional Transport Offices & National Registries | Format structure parsing, date validity logic, security background checks |

---

## 📡 API Reference

### `POST /api/analyze`
Submits a document and optional live selfie for forensic screening.

#### Request Body
```json
{
  "documentImageBase64": "data:image/jpeg;base64,...",
  "documentType": "aadhaar",
  "livePersonImageBase64": "data:image/jpeg;base64,...",
  "supportingDocumentBase64": "data:image/jpeg;base64,..."
}
```

#### Response Body
```json
{
  "extractedData": {
    "documentType": "aadhaar",
    "documentTypeName": "Indian Aadhaar Card",
    "fullName": "RAHUL SURESH DESHMUKH",
    "documentNumber": "8942 5013 7798",
    "dateOfBirth": "22/11/1992",
    "gender": "MALE"
  },
  "tamperingIssues": [
    {
      "id: "TMP-01",
      "type": "photo_replacement",
      "title": "Photo Splicing & Boundary Artifact",
      "confidence": 94,
      "severity": "high"
    }
  ],
  "faceVerification": {
    "matchStatus": "MATCH",
    "similarityScore": 92,
    "livenessScore": 95,
    "livenessStatus": "PASS"
  },
  "riskBreakdown": {
    "totalRiskScore": 18,
    "riskLevel": "LOW",
    "recommendation": "AUTO_APPROVE"
  }
}
```

---

## 🔒 Security & Privacy

- **No Persistent PII Storage**: Uploaded documents and biometric vectors are processed in-memory and are not stored in any external database without explicit user configuration.
- **Client-Side Image Sanitization**: Uploaded images are sanitized and normalized before transmission to backend endpoints.
- **Isolated Cryptographic Validation**: Mathematical checksums are calculated locally without making external network calls.
