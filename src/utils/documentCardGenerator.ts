/**
 * Generates realistic SVG vectors and data URIs for government ID documents.
 * Conforms to ICAO Doc 9303 Passports, UIDAI Aadhaar, and ITD PAN Card formats.
 */

export function svgToDataUri(svgString: string): string {
  try {
    const cleanSvg = svgString.trim();
    const base64 = btoa(
      encodeURIComponent(cleanSvg).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
  }
}

export function getPassportRawSVG(options: {
  fullName: string;
  passportNo: string;
  dob: string;
  sex: string;
  nationality: string;
  issueDate: string;
  expiryDate: string;
  mrzLine1: string;
  mrzLine2: string;
  isSpliced?: boolean;
  photoUrl?: string;
}): string {
  const {
    fullName,
    passportNo,
    dob,
    sex,
    nationality,
    issueDate,
    expiryDate,
    mrzLine1,
    mrzLine2,
    isSpliced = false,
    photoUrl,
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="background:#f4ece1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <defs>
      <!-- Guilloche Security Pattern Background -->
      <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 0 20 Q 10 0 20 20 T 40 20" fill="none" stroke="#d5c8b2" stroke-width="0.8" opacity="0.6"/>
        <path d="M 0 20 Q 10 40 20 20 T 40 20" fill="none" stroke="#d5c8b2" stroke-width="0.8" opacity="0.6"/>
        <circle cx="20" cy="20" r="12" fill="none" stroke="#e0d5c1" stroke-width="0.6"/>
      </pattern>
      
      <!-- Splicing Tamper Artifacts if applicable -->
      <filter id="spliceGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ef4444" flood-opacity="0.8"/>
      </filter>
      <clipPath id="photoClip">
        <rect x="50" y="160" width="200" height="260" rx="8"/>
      </clipPath>
    </defs>

    <!-- Document Paper Background with Security Texture -->
    <rect width="900" height="600" fill="#fcf9f2"/>
    <rect width="900" height="600" fill="url(#guilloche)"/>

    <!-- Subtle Outer Passport Page Border -->
    <rect x="15" y="15" width="870" height="570" rx="12" fill="none" stroke="#8a7356" stroke-width="2" opacity="0.4"/>
    <rect x="22" y="22" width="856" height="556" rx="8" fill="none" stroke="#cbb89d" stroke-width="1" stroke-dasharray="6,4"/>

    <!-- Header / Country Title -->
    <g transform="translate(50, 40)">
      <text x="0" y="22" font-size="14" font-weight="bold" fill="#6d583b" letter-spacing="3">REPUBLIC OF INDIA / RÉPUBLIQUE D'INDE</text>
      <text x="0" y="48" font-size="24" font-weight="900" fill="#2c2218" letter-spacing="4">PASSPORT / PASSEPORT</text>
    </g>

    <!-- National Emblem Seal Graphic (Right Header) -->
    <g transform="translate(740, 30)">
      <circle cx="45" cy="45" r="40" fill="#f5ede0" stroke="#8a7356" stroke-width="1.5"/>
      <circle cx="45" cy="45" r="32" fill="none" stroke="#8a7356" stroke-width="1" stroke-dasharray="4,2"/>
      <text x="45" y="38" font-size="9" font-weight="bold" fill="#8a7356" text-anchor="middle">GOVT OF INDIA</text>
      <text x="45" y="52" font-size="11" font-weight="900" fill="#2c2218" text-anchor="middle">OFFICIAL</text>
      <text x="45" y="65" font-size="8" font-weight="bold" fill="#8a7356" text-anchor="middle">PASSPORT</text>
    </g>

    <!-- Document Meta Grid (Type, Code, Passport No) -->
    <g transform="translate(50, 115)" font-size="11" fill="#6d583b">
      <text x="0" y="0">TYPE / TYPE</text>
      <text x="0" y="18" font-size="15" font-weight="bold" fill="#2c2218">P</text>

      <text x="120" y="0">CODE / CODE</text>
      <text x="120" y="18" font-size="15" font-weight="bold" fill="#2c2218">IND</text>

      <text x="260" y="0">PASSPORT NO. / NO. DU PASSEPORT</text>
      <text x="260" y="18" font-size="18" font-weight="900" font-family="'Courier New', monospace" fill="#b91c1c" letter-spacing="2">${passportNo}</text>
    </g>

    <line x1="50" y1="135" x2="850" y2="135" stroke="#bda88c" stroke-width="1.5"/>

    <!-- Photo ID Section (Vector Biometric Portrait) -->
    <g id="photo-section">
      <rect x="46" y="156" width="208" height="268" rx="10" fill="#e2d6c3" stroke="${isSpliced ? '#ef4444' : '#8c775a'}" stroke-width="${isSpliced ? '3' : '1.5'}" ${isSpliced ? 'filter="url(#spliceGlow)"' : ''}/>
      
      <!-- Vector Passport Headshot -->
      <g clip-path="url(#photoClip)">
        <rect x="50" y="160" width="200" height="260" fill="#cbd5e1"/>
        <!-- Background Studio Light -->
        <circle cx="150" cy="250" r="90" fill="#e2e8f0"/>
        <!-- Torso / Suit -->
        <path d="M70 410 C70 330 110 320 150 320 C190 320 230 330 230 410 Z" fill="#1e293b"/>
        <path d="M125 320 L150 360 L175 320 Z" fill="#ffffff"/>
        <path d="M142 335 L150 400 L158 335 Z" fill="#dc2626"/>
        <!-- Neck -->
        <rect x="135" y="270" width="30" height="40" fill="#d4a373" rx="4"/>
        <!-- Head & Face -->
        <ellipse cx="150" cy="240" rx="42" ry="52" fill="#e0a96d"/>
        <!-- Hair -->
        <path d="M106 230 C106 185 130 180 150 180 C170 180 194 185 194 230 C180 205 120 205 106 230 Z" fill="#1c1917"/>
        <!-- Ears -->
        <circle cx="106" cy="242" r="8" fill="#d4a373"/>
        <circle cx="194" cy="242" r="8" fill="#d4a373"/>
        <!-- Eyes -->
        <circle cx="134" cy="235" r="4" fill="#1c1917"/>
        <circle cx="166" cy="235" r="4" fill="#1c1917"/>
        <path d="M128 226 Q134 222 140 226" stroke="#1c1917" stroke-width="2" fill="none"/>
        <path d="M160 226 Q166 222 172 226" stroke="#1c1917" stroke-width="2" fill="none"/>
        <!-- Nose -->
        <path d="M150 236 L147 252 L154 252" stroke="#b07d4b" stroke-width="2" fill="none"/>
        <!-- Mouth -->
        <path d="M138 266 Q150 274 162 266" stroke="#8c4a2f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Security Grid Overlay on Photo -->
        <path d="M50 200 L250 200 M50 260 L250 260 M50 320 L250 320 M50 380 L250 380" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4"/>
      </g>

      ${isSpliced ? `
        <!-- Spliced Tamper Boundary Line Overlay -->
        <rect x="48" y="158" width="204" height="264" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="150" y="445" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">PHOTO-SUBSTITUTION DETECTED</text>
      ` : ''}
    </g>

    <!-- Ghost Hologram Watermark Portrait -->
    <g transform="translate(730, 200)" opacity="0.25">
      <circle cx="45" cy="45" r="40" fill="none" stroke="#6d583b" stroke-width="1"/>
      <ellipse cx="45" cy="40" rx="20" ry="24" fill="#6d583b"/>
      <path d="M25 80 C25 65 35 60 45 60 C55 60 65 65 65 80 Z" fill="#6d583b"/>
    </g>

    <!-- Biographical Text Data Fields -->
    <g transform="translate(280, 165)" font-size="11" fill="#4a3b2c">
      <!-- Surname -->
      <text x="0" y="0" font-size="10" font-weight="600" fill="#7d6a52">SURNAME / NOM</text>
      <text x="0" y="20" font-size="16" font-weight="800" fill="#1e1810" letter-spacing="1">${fullName.split(' ').slice(-1)[0] || 'ALPHA'}</text>

      <!-- Given Names -->
      <text x="0" y="48" font-size="10" font-weight="600" fill="#7d6a52">GIVEN NAME(S) / PRÉNOMS</text>
      <text x="0" y="68" font-size="15" font-weight="800" fill="#1e1810">${fullName.split(' ').slice(0, -1).join(' ') || fullName}</text>

      <!-- Nationality & Sex -->
      <text x="0" y="98" font-size="10" font-weight="600" fill="#7d6a52">NATIONALITY</text>
      <text x="0" y="118" font-size="14" font-weight="700" fill="#1e1810">${nationality}</text>

      <text x="260" y="98" font-size="10" font-weight="600" fill="#7d6a52">SEX / SEXE</text>
      <text x="260" y="118" font-size="14" font-weight="700" fill="#1e1810">${sex}</text>

      <!-- DOB & Place of Birth -->
      <text x="0" y="148" font-size="10" font-weight="600" fill="#7d6a52">DATE OF BIRTH / DATE DE NAISSANCE</text>
      <text x="0" y="168" font-size="14" font-weight="700" fill="#1e1810">${dob}</text>

      <text x="260" y="148" font-size="10" font-weight="600" fill="#7d6a52">PLACE OF BIRTH</text>
      <text x="260" y="168" font-size="14" font-weight="700" fill="#1e1810">SAMPLE_CITY, IND</text>

      <!-- Issue & Expiry Date -->
      <text x="0" y="198" font-size="10" font-weight="600" fill="#7d6a52">DATE OF ISSUE</text>
      <text x="0" y="218" font-size="14" font-weight="700" fill="#1e1810">${issueDate}</text>

      <text x="260" y="198" font-size="10" font-weight="600" fill="#7d6a52">DATE OF EXPIRY</text>
      <text x="260" y="218" font-size="14" font-weight="700" fill="#1e1810">${expiryDate}</text>
    </g>

    <!-- Official Stamp / Seal -->
    <g transform="translate(710, 330)" opacity="0.7">
      <circle cx="50" cy="50" r="42" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="8,4"/>
      <text x="50" y="38" font-size="8" font-weight="bold" fill="#2563eb" text-anchor="middle">REGIONAL PASSPORT OFFICE</text>
      <text x="50" y="55" font-size="11" font-weight="900" fill="#2563eb" text-anchor="middle">VERIFIED</text>
      <text x="50" y="70" font-size="8" font-weight="bold" fill="#2563eb" text-anchor="middle">GOVT OF INDIA</text>
    </g>

    <!-- MRZ (Machine Readable Zone) Section at Bottom -->
    <rect x="35" y="470" width="830" height="105" rx="6" fill="#f1e7d4" stroke="#8a7356" stroke-width="1.2"/>
    <g transform="translate(55, 510)" font-family="'OCR-B', 'Courier New', Courier, monospace" font-size="21" font-weight="bold" fill="#111827" letter-spacing="6">
      <text x="0" y="0">${mrzLine1}</text>
      <text x="0" y="42">${mrzLine2}</text>
    </g>
  </svg>`;
}

export function generatePassportSVG(options: {
  fullName: string;
  passportNo: string;
  dob: string;
  sex: string;
  nationality: string;
  issueDate: string;
  expiryDate: string;
  mrzLine1: string;
  mrzLine2: string;
  isSpliced?: boolean;
  photoUrl?: string;
}): string {
  const rawSvg = getPassportRawSVG(options);
  return svgToDataUri(rawSvg);
}

export function getAadhaarRawSVG(options: {
  fullName: string;
  aadhaarNo: string;
  dob: string;
  gender: string;
  photoUrl?: string;
}): string {
  const {
    fullName,
    aadhaarNo,
    dob,
    gender,
    photoUrl,
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="background:#ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <defs>
      <pattern id="aadhaarPattern" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="8" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <clipPath id="aadhaarPhotoClip">
        <rect x="55" y="165" width="180" height="230" rx="8"/>
      </clipPath>
    </defs>

    <!-- Card Background -->
    <rect width="900" height="560" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect width="900" height="560" rx="16" fill="url(#aadhaarPattern)"/>

    <!-- Top Tri-color Bar -->
    <rect x="0" y="0" width="900" height="8" fill="#f97316"/>
    <rect x="0" y="8" width="900" height="8" fill="#ffffff"/>
    <rect x="0" y="16" width="900" height="8" fill="#16a34a"/>

    <!-- Government Header -->
    <g transform="translate(60, 45)">
      <!-- Ashoka Emblem Representation -->
      <g transform="translate(0, 10)">
        <circle cx="20" cy="20" r="18" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
        <text x="20" y="24" font-size="8" font-weight="bold" fill="#334155" text-anchor="middle">GOVT</text>
      </g>
      <g transform="translate(55, 10)">
        <text x="0" y="16" font-size="18" font-weight="bold" fill="#0f172a">भारत सरकार</text>
        <text x="0" y="36" font-size="14" font-weight="600" fill="#334155">Government of India</text>
      </g>
    </g>

    <!-- UIDAI Official Sun Logo (Right Header) -->
    <g transform="translate(730, 40)">
      <circle cx="45" cy="40" r="30" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
      <path d="M45 15 L45 25 M45 55 L45 65 M20 40 L30 40 M60 40 L70 40" stroke="#dc2626" stroke-width="2"/>
      <text x="45" y="44" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">UIDAI</text>
    </g>

    <line x1="50" y1="140" x2="850" y2="140" stroke="#e2e8f0" stroke-width="2"/>

    <!-- Left Photo Section (Vector Biometric Portrait) -->
    <g id="aadhaar-photo">
      <rect x="52" y="162" width="186" height="236" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
      <g clip-path="url(#aadhaarPhotoClip)">
        <rect x="55" y="165" width="180" height="230" fill="#e2e8f0"/>
        <circle cx="145" cy="245" r="80" fill="#f8fafc"/>
        <path d="M75 390 C75 320 110 310 145 310 C180 310 215 320 215 390 Z" fill="#334155"/>
        <path d="M125 310 L145 350 L165 310 Z" fill="#ffffff"/>
        <rect x="133" y="270" width="24" height="35" fill="#d4a373" rx="3"/>
        <ellipse cx="145" cy="240" rx="36" ry="46" fill="#e0a96d"/>
        <path d="M109 230 C109 190 128 185 145 185 C162 185 181 190 181 230 C170 210 120 210 109 230 Z" fill="#1c1917"/>
        <circle cx="131" cy="235" r="3.5" fill="#1c1917"/>
        <circle cx="159" cy="235" r="3.5" fill="#1c1917"/>
        <path d="M145 238 L142 250 L148 250" stroke="#b07d4b" stroke-width="2" fill="none"/>
        <path d="M135 264 Q145 270 155 264" stroke="#8c4a2f" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Middle Personal Details -->
    <g transform="translate(265, 185)">
      <text x="0" y="0" font-size="13" font-weight="600" fill="#475569">नाम / Name:</text>
      <text x="140" y="0" font-size="18" font-weight="bold" fill="#0f172a">${fullName}</text>

      <text x="0" y="40" font-size="13" font-weight="600" fill="#475569">Name (Local):</text>
      <text x="140" y="40" font-size="16" font-weight="bold" fill="#0f172a">सब्जेक्ट बीटा</text>

      <text x="0" y="78" font-size="13" font-weight="600" fill="#475569">जन्म तिथि / DOB:</text>
      <text x="140" y="78" font-size="16" font-weight="700" fill="#1e293b">${dob}</text>

      <text x="0" y="115" font-size="13" font-weight="600" fill="#475569">लिंग / Gender:</text>
      <text x="140" y="115" font-size="16" font-weight="700" fill="#1e293b">${gender}</text>

      <text x="0" y="155" font-size="11" font-weight="500" fill="#64748b">Address: Sample Address Line, Sector 4, Region - 000000</text>
    </g>

    <!-- Right Side QR Code Representation -->
    <g transform="translate(680, 165)">
      <rect width="150" height="150" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" rx="8"/>
      <!-- QR Blocks Representation -->
      <rect x="15" y="15" width="35" height="35" fill="#0f172a"/>
      <rect x="22" y="22" width="21" height="21" fill="#ffffff"/>
      <rect x="26" y="26" width="13" height="13" fill="#0f172a"/>

      <rect x="100" y="15" width="35" height="35" fill="#0f172a"/>
      <rect x="107" y="22" width="21" height="21" fill="#ffffff"/>
      <rect x="111" y="26" width="13" height="13" fill="#0f172a"/>

      <rect x="15" y="100" width="35" height="35" fill="#0f172a"/>
      <rect x="22" y="107" width="21" height="21" fill="#ffffff"/>
      <rect x="26" y="111" width="13" height="13" fill="#0f172a"/>

      <!-- Random Data Matrix Pixels -->
      <circle cx="65" cy="30" r="4" fill="#0f172a"/>
      <circle cx="80" cy="50" r="5" fill="#0f172a"/>
      <circle cx="60" cy="75" r="6" fill="#0f172a"/>
      <circle cx="110" cy="80" r="5" fill="#0f172a"/>
      <circle cx="75" cy="115" r="5" fill="#0f172a"/>

      <text x="75" y="175" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">SECURE QR CODE</text>
    </g>

    <!-- Bottom Red Banner with 12 Digit UID -->
    <rect x="0" y="440" width="900" height="120" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <g transform="translate(450, 485)" text-anchor="middle">
      <text x="0" y="0" font-size="28" font-weight="900" font-family="'Courier New', Courier, monospace" fill="#b91c1c" letter-spacing="6">
        ${aadhaarNo.replace(/(\d{4})/g, '$1 ').trim()}
      </text>
      <text x="0" y="32" font-size="14" font-weight="700" fill="#0f172a">
        मेरा आधार, मेरी पहचान (Aadhaar - Proof of Identity)
      </text>
    </g>
  </svg>`;
}

export function generateAadhaarSVG(options: {
  fullName: string;
  aadhaarNo: string;
  dob: string;
  gender: string;
  photoUrl?: string;
}): string {
  const rawSvg = getAadhaarRawSVG(options);
  return svgToDataUri(rawSvg);
}

export function getPANRawSVG(options: {
  fullName: string;
  panNo: string;
  fatherName: string;
  dob: string;
  hasAlteredStamp?: boolean;
  photoUrl?: string;
}): string {
  const {
    fullName,
    panNo,
    fatherName,
    dob,
    hasAlteredStamp = false,
    photoUrl,
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="background:#e0f2fe; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <defs>
      <linearGradient id="panBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0f2fe" />
        <stop offset="50%" stop-color="#f0f9ff" />
        <stop offset="100%" stop-color="#e0f2fe" />
      </linearGradient>
      <clipPath id="panPhotoClip">
        <rect x="55" y="160" width="180" height="230" rx="8"/>
      </clipPath>
    </defs>

    <!-- Card Base Background -->
    <rect width="900" height="560" rx="16" fill="url(#panBg)" stroke="#38bdf8" stroke-width="2"/>

    <!-- Header / Income Tax Department -->
    <g transform="translate(50, 40)">
      <text x="0" y="24" font-size="19" font-weight="900" fill="#0369a1" letter-spacing="1">आयकर विभाग</text>
      <text x="0" y="48" font-size="22" font-weight="900" fill="#0c4a6e" letter-spacing="2">INCOME TAX DEPARTMENT</text>
    </g>

    <!-- Center Emblem -->
    <g transform="translate(450, 40)">
      <circle cx="0" cy="25" r="22" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
      <text x="0" y="28" font-size="9" font-weight="bold" fill="#0284c7" text-anchor="middle">GOVT</text>
    </g>

    <!-- Right Header -->
    <g transform="translate(850, 40)" text-anchor="end">
      <text x="0" y="24" font-size="17" font-weight="bold" fill="#0369a1">भारत सरकार</text>
      <text x="0" y="48" font-size="16" font-weight="bold" fill="#0c4a6e">GOVT. OF INDIA</text>
    </g>

    <line x1="40" y1="120" x2="860" y2="120" stroke="#0284c7" stroke-width="1.5"/>

    <!-- Photo ID (Vector Biometric Portrait) -->
    <g id="pan-photo">
      <rect x="52" y="157" width="186" height="236" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
      <g clip-path="url(#panPhotoClip)">
        <rect x="55" y="160" width="180" height="230" fill="#e0f2fe"/>
        <circle cx="145" cy="240" r="75" fill="#f0f9ff"/>
        <path d="M75 385 C75 315 110 305 145 305 C180 305 215 315 215 385 Z" fill="#0f172a"/>
        <path d="M120 305 L145 345 L170 305 Z" fill="#38bdf8"/>
        <rect x="133" y="265" width="24" height="35" fill="#e0a96d" rx="3"/>
        <ellipse cx="145" cy="235" rx="36" ry="44" fill="#f5c292"/>
        <path d="M109 230 C109 180 128 175 145 175 C162 175 181 180 181 230 C185 270 175 290 170 290 C165 290 162 250 162 230 C162 205 128 205 128 230 C128 250 125 290 120 290 C115 290 105 270 109 230 Z" fill="#292524"/>
        <circle cx="132" cy="232" r="3.5" fill="#1c1917"/>
        <circle cx="158" cy="232" r="3.5" fill="#1c1917"/>
        <path d="M145 235 L142 247 L148 247" stroke="#b07d4b" stroke-width="1.8" fill="none"/>
        <path d="M135 258 Q145 264 155 258" stroke="#be123c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Personal Demographic Details -->
    <g transform="translate(265, 160)">
      <!-- Name -->
      <text x="0" y="10" font-size="11" font-weight="bold" fill="#0369a1">नाम / NAME</text>
      <text x="0" y="34" font-size="19" font-weight="900" fill="#0f172a">${fullName}</text>

      <!-- Father's Name -->
      <text x="0" y="75" font-size="11" font-weight="bold" fill="#0369a1">पिता का नाम / FATHER'S NAME</text>
      <text x="0" y="99" font-size="17" font-weight="800" fill="#0f172a">${fatherName}</text>

      <!-- Date of Birth -->
      <text x="0" y="140" font-size="11" font-weight="bold" fill="#0369a1">जन्म की तारीख / DATE OF BIRTH</text>
      <text x="0" y="164" font-size="17" font-weight="800" fill="#0f172a">${dob}</text>
    </g>

    <!-- Digital QR Stamp Box (Right) -->
    <g transform="translate(680, 160)">
      <rect width="160" height="160" fill="#ffffff" stroke="#0284c7" stroke-width="1.5" rx="8"/>
      <rect x="15" y="15" width="40" height="40" fill="#0f172a"/>
      <rect x="105" y="15" width="40" height="40" fill="#0f172a"/>
      <rect x="15" y="105" width="40" height="40" fill="#0f172a"/>
      <circle cx="80" cy="80" r="14" fill="#0284c7"/>
      ${hasAlteredStamp ? `
        <!-- Tamper Box Anomaly Overlay -->
        <rect x="-5" y="-5" width="170" height="170" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6,3"/>
        <text x="80" y="195" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">DIGITAL OVERLAY STAMP</text>
      ` : ''}
    </g>

    <!-- Signature Strip Box -->
    <g transform="translate(55, 415)">
      <rect width="280" height="60" fill="#ffffff" stroke="#94a3b8" stroke-width="1" rx="4"/>
      <path d="M70 450 Q 110 430 160 455 T 220 440 T 300 450" fill="none" stroke="#0f172a" stroke-width="2"/>
      <text x="140" y="490" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">हस्ताक्षर / SIGNATURE</text>
    </g>

    <!-- Bottom Permanent Account Number (PAN) -->
    <g transform="translate(560, 430)" text-anchor="middle">
      <text x="0" y="0" font-size="12" font-weight="bold" fill="#0369a1">स्थायी खाता संख्या / PERMANENT ACCOUNT NUMBER</text>
      <text x="0" y="38" font-size="28" font-weight="900" font-family="'Courier New', Courier, monospace" fill="#0f172a" letter-spacing="4">
        ${panNo}
      </text>
    </g>
  </svg>`;
}

export function generatePANSVG(options: {
  fullName: string;
  panNo: string;
  fatherName: string;
  dob: string;
  hasAlteredStamp?: boolean;
  photoUrl?: string;
}): string {
  const rawSvg = getPANRawSVG(options);
  return svgToDataUri(rawSvg);
}
