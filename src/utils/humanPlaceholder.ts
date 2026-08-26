/**
 * Generates vector-based human silhouette & biometric schematic placeholders.
 * Completely replaces all external real human photographs.
 */

export function generateHumanPlaceholder(options: {
  gender?: 'male' | 'female' | 'neutral';
  variant?: 'passport' | 'live_sensor' | 'spliced';
  label?: string;
  bgColor?: string;
}): string {
  const {
    gender = 'neutral',
    variant = 'passport',
    label,
    bgColor = '#1e293b',
  } = options;

  const isFemale = gender === 'female';
  const isLive = variant === 'live_sensor';
  const isSpliced = variant === 'spliced';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${isLive ? '#0d1527' : '#1e293b'}"/>
      <stop offset="100%" stop-color="${isLive ? '#070b14' : '#0f172a'}"/>
    </linearGradient>
    <linearGradient id="avatarGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="300" height="360" rx="16" fill="url(#bgGrad)"/>
  
  <!-- Subtle Grid for Biometric Sensor View -->
  ${isLive ? `
  <pattern id="bioGrid" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" stroke-width="0.5" opacity="0.15"/>
  </pattern>
  <rect width="300" height="360" rx="16" fill="url(#bioGrid)"/>
  ` : ''}

  <!-- Human Silhouette Head & Body -->
  <g transform="translate(150, 160)" fill="url(#avatarGrad)">
    ${isFemale ? `
    <!-- Female Hair Contour -->
    <path d="M -50 -30 C -55 -90, 55 -90, 50 -30 C 58 10, 48 60, 42 75 C 38 80, -38 80, -42 75 C -48 60, -58 10, -50 -30 Z" fill="#334155"/>
    ` : ''}

    <!-- Head -->
    <ellipse cx="0" cy="-30" rx="42" ry="52" fill="#64748b"/>
    
    <!-- Face Inner Shape -->
    <ellipse cx="0" cy="-26" rx="36" ry="46" fill="#94a3b8"/>

    <!-- Shoulders & Torso -->
    <path d="M -90 140 C -90 65, -50 45, 0 45 C 50 45, 90 65, 90 140 Z" fill="#475569"/>
    <!-- Collar / Shirt Neck -->
    <path d="M -30 45 L 0 75 L 30 45 Z" fill="#1e293b"/>
  </g>

  <!-- Biometric Landmark Overlay Points -->
  <g stroke="#38bdf8" stroke-width="1.5" fill="#38bdf8">
    <!-- Left Eye Landmark -->
    <circle cx="128" cy="126" r="3" fill="#38bdf8"/>
    <!-- Right Eye Landmark -->
    <circle cx="172" cy="126" r="3" fill="#38bdf8"/>
    <!-- Nose Landmark -->
    <circle cx="150" cy="142" r="2.5" fill="#38bdf8"/>
    <!-- Mouth Landmarks -->
    <circle cx="136" cy="162" r="2" fill="#38bdf8"/>
    <circle cx="164" cy="162" r="2" fill="#38bdf8"/>
    <line x1="136" y1="162" x2="164" y2="162" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 1"/>
    <!-- Inter-ocular measurement line -->
    <line x1="128" y1="126" x2="172" y2="126" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3 1.5" opacity="0.8"/>
  </g>

  <!-- Face Oval Frame -->
  <ellipse cx="150" cy="134" rx="56" ry="72" fill="none" stroke="${isSpliced ? '#f43f5e' : isLive ? '#3b82f6' : '#64748b'}" stroke-width="${isSpliced ? '2.5' : '1.5'}" stroke-dasharray="${isLive ? '4 3' : 'none'}"/>

  <!-- Splicing Indicator Box if applicable -->
  ${isSpliced ? `
  <rect x="20" y="20" width="260" height="320" rx="12" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6 3"/>
  <rect x="80" y="325" width="140" height="22" rx="4" fill="#881337"/>
  <text x="150" y="340" fill="#fecdd3" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">SPLICED PHOTO EDGE</text>
  ` : ''}

  <!-- Label at bottom -->
  <text x="150" y="${isSpliced ? 305 : 330}" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle" letter-spacing="1">
    ${label || (isLive ? 'LIVE BIOMETRIC SENSOR' : 'BIOMETRIC ID PHOTO')}
  </text>
</svg>
`.trim();

  try {
    const base64 = btoa(
      encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}

export const PLACEHOLDER_AVATARS = {
  malePassport: generateHumanPlaceholder({ gender: 'male', variant: 'passport', label: 'PASSPORT HOLDER (M)' }),
  femalePassport: generateHumanPlaceholder({ gender: 'female', variant: 'passport', label: 'PASSPORT HOLDER (F)' }),
  splicedPassport: generateHumanPlaceholder({ gender: 'male', variant: 'spliced', label: 'TAMPERED / SPLICED' }),
  maleLive: generateHumanPlaceholder({ gender: 'male', variant: 'live_sensor', label: 'LIVE TRAVELER CAPTURE' }),
  femaleLive: generateHumanPlaceholder({ gender: 'female', variant: 'live_sensor', label: 'LIVE TRAVELER CAPTURE' }),
  neutralLive: generateHumanPlaceholder({ gender: 'neutral', variant: 'live_sensor', label: 'LIVE SENSOR FEED' }),
};
