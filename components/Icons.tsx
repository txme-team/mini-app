
import React from 'react';

// --- UI Icons (Keep simple pixel style for UI consistency or update if needed, keeping pixel for retro feel) ---
const SvgIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    {children}
  </svg>
);

export const GearIcon = () => (
  <SvgIconWrapper>
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="#1e3a8a"/>
  </SvgIconWrapper>
);

export const ShuffleIcon = () => (
  <SvgIconWrapper>
    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" fill="#f8fafc"/>
  </SvgIconWrapper>
);

export const StarIcon = () => (
  <SvgIconWrapper>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5"/>
    <circle cx="9" cy="9" r="2" fill="white" opacity="0.5"/>
  </SvgIconWrapper>
);

export const ClockIcon = () => (
  <SvgIconWrapper>
    <circle cx="12" cy="12" r="9" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1" fill="#1e3a8a"/>
  </SvgIconWrapper>
);

export const VideoIcon = () => (
  <SvgIconWrapper>
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="1.5"/>
  </SvgIconWrapper>
);

export const SoundOnIcon = () => (
  <SvgIconWrapper>
    <path d="M3 9v6h4l5 5V4L7 9H3z" fill="#f8fafc"/>
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="#f8fafc"/>
  </SvgIconWrapper>
);

export const SoundOffIcon = () => (
  <SvgIconWrapper>
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="#ef4444"/>
  </SvgIconWrapper>
);

export const HintIcon = () => (
  <SvgIconWrapper>
    {/* Changed fill from #fbbf24 to white */}
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" fill="white"/>
  </SvgIconWrapper>
);

export const TrophyIcon = () => (
  <SvgIconWrapper>
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#fbbf24" stroke="#b45309" strokeWidth="2"/>
  </SvgIconWrapper>
);

export const SadDogIcon = () => (
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#9ca3af" stroke="#374151" strokeWidth="3"/>
    <circle cx="35" cy="40" r="5" fill="#111827"/>
    <circle cx="65" cy="40" r="5" fill="#111827"/>
    <path d="M35 70 Q50 60 65 70" stroke="#111827" strokeWidth="3" fill="none"/>
    <path d="M30 30 L40 35" stroke="#111827" strokeWidth="2"/>
    <path d="M70 30 L60 35" stroke="#111827" strokeWidth="2"/>
  </svg>
);

export const PartyIcon = () => (
  <svg viewBox="0 0 100 100">
     <circle cx="50" cy="50" r="45" fill="#fbbf24" stroke="#b45309" strokeWidth="3"/>
     <circle cx="35" cy="40" r="5" fill="#111827"/>
     <circle cx="65" cy="40" r="5" fill="#111827"/>
     <path d="M35 60 Q50 80 65 60" fill="#ef4444" stroke="#991b1b" strokeWidth="2"/>
     <path d="M10 10 L30 30 M90 10 L70 30" stroke="#3b82f6" strokeWidth="4"/>
  </svg>
);

// --- GLOSSY DOG ICONS (Vector SVG) ---
interface GlossyFaceProps {
  baseColor: string;
  children?: React.ReactNode;
}

const GlossyFace: React.FC<GlossyFaceProps> = ({ baseColor, children }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
    <circle cx="50" cy="50" r="42" fill={baseColor} stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    {children}
  </svg>
);

const DogShiba = () => (
  <GlossyFace baseColor="#fbbf24"> 
    <path d="M10 35 L25 5 L45 25 Z" fill="#fbbf24" stroke="#333" strokeWidth="3"/>
    <path d="M90 35 L75 5 L55 25 Z" fill="#fbbf24" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#fbbf24" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <path d="M25 60 Q50 85 75 60 Q65 45 50 55 Q35 45 25 60" fill="#fffbeb"/>
    <circle cx="50" cy="62" r="5" fill="#111827"/>
    <circle cx="38" cy="45" r="4" fill="#111827"/>
    <circle cx="62" cy="45" r="4" fill="#111827"/>
    <ellipse cx="38" cy="35" rx="3" ry="2" fill="#fffbeb"/>
    <ellipse cx="62" cy="35" rx="3" ry="2" fill="#fffbeb"/>
  </GlossyFace>
);

const DogPug = () => (
  <GlossyFace baseColor="#fef3c7"> 
    <path d="M5 25 L30 35 L15 55 Z" fill="#374151" stroke="#333" strokeWidth="3"/>
    <path d="M95 25 L70 35 L85 55 Z" fill="#374151" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#fef3c7" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <ellipse cx="50" cy="60" rx="25" ry="15" fill="#374151"/>
    <circle cx="35" cy="50" r="6" fill="#111827"/>
    <circle cx="65" cy="50" r="6" fill="#111827"/>
    <ellipse cx="50" cy="62" rx="8" ry="5" fill="#000"/>
  </GlossyFace>
);

const DogHusky = () => (
  <GlossyFace baseColor="#9ca3b8"> 
    <path d="M15 35 L25 0 L45 25 Z" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <path d="M85 35 L75 0 L55 25 Z" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <path d="M50 50 Q30 50 20 80 Q50 90 80 80 Q70 50 50 50" fill="white"/>
    <circle cx="35" cy="45" r="8" fill="white"/>
    <circle cx="65" cy="45" r="8" fill="white"/>
    <circle cx="35" cy="45" r="4" fill="#60a5fa"/>
    <circle cx="65" cy="45" r="4" fill="#60a5fa"/>
    <circle cx="50" cy="65" r="5" fill="#111827"/>
  </GlossyFace>
);

const DogBeagle = () => (
  <GlossyFace baseColor="#ffffff">
    <ellipse cx="12" cy="55" rx="12" ry="25" fill="#b45309" stroke="#333" strokeWidth="3"/>
    <ellipse cx="88" cy="55" rx="12" ry="25" fill="#b45309" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <path d="M30 15 Q50 40 70 15" fill="#b45309" />
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="60" r="6" fill="#111827"/>
  </GlossyFace>
);

const DogChocoPoodle = () => (
  <GlossyFace baseColor="#8d6e63">
    <circle cx="12" cy="45" r="16" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    <circle cx="88" cy="45" r="16" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="20" rx="22" ry="15" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.2"/>
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <ellipse cx="50" cy="55" rx="6" ry="4" fill="#111827"/>
  </GlossyFace>
);

const DogDalmatian = () => (
  <GlossyFace baseColor="#ffffff">
    <path d="M10 25 Q-5 50 15 65" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <path d="M90 25 Q105 50 85 65" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <circle cx="30" cy="25" r="4" fill="#111827"/>
    <circle cx="70" cy="30" r="3" fill="#111827"/>
    <circle cx="20" cy="50" r="5" fill="#111827"/>
    <circle cx="80" cy="55" r="4" fill="#111827"/>
    <circle cx="50" cy="80" r="3" fill="#111827"/>
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="60" r="5" fill="#111827"/>
  </GlossyFace>
);

const DogPoodle = () => (
  <GlossyFace baseColor="#d97706">
    <circle cx="12" cy="45" r="16" fill="#d97706" stroke="#333" strokeWidth="3"/>
    <circle cx="88" cy="45" r="16" fill="#d97706" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="20" rx="20" ry="14" fill="#d97706" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#d97706" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.3"/>
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="55" r="5" fill="#111827"/>
  </GlossyFace>
);

const DogSchnauzer = () => (
  <GlossyFace baseColor="#9ca3af">
    <path d="M15 20 L30 45 L45 25" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <path d="M85 20 L70 45 L55 25" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <rect x="25" y="30" width="15" height="8" rx="2" fill="#e5e7eb" transform="rotate(10 32 34)"/>
    <rect x="60" y="30" width="15" height="8" rx="2" fill="#e5e7eb" transform="rotate(-10 68 34)"/>
    <path d="M30 60 Q50 90 70 60 L60 55 L40 55 Z" fill="#e5e7eb" stroke="#333" strokeWidth="1"/>
    <circle cx="35" cy="45" r="3" fill="#111827"/>
    <circle cx="65" cy="45" r="3" fill="#111827"/>
    <ellipse cx="50" cy="55" rx="6" ry="4" fill="#111827"/>
  </GlossyFace>
);

const DogRetriever = () => (
  <GlossyFace baseColor="#facc15">
    <path d="M10 25 Q0 50 20 65" fill="#eab308" stroke="#333" strokeWidth="3"/>
    <path d="M90 25 Q100 50 80 65" fill="#eab308" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#facc15" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <path d="M40 65 Q50 75 60 65" fill="none" stroke="#333" strokeWidth="2"/>
    <ellipse cx="50" cy="60" rx="7" ry="5" fill="#111827"/>
  </GlossyFace>
);

const DogFrenchie = () => (
  <GlossyFace baseColor="#1f2937">
    <path d="M10 40 L10 0 L40 30 Z" fill="#1f2937" stroke="#333" strokeWidth="3"/>
    <path d="M90 40 L90 0 L60 30 Z" fill="#1f2937" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#1f2937" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.2"/>
    <circle cx="35" cy="50" r="5" fill="#111827"/>
    <circle cx="36" cy="49" r="1" fill="white"/>
    <circle cx="65" cy="50" r="5" fill="#111827"/>
    <circle cx="64" cy="49" r="1" fill="white"/>
    <ellipse cx="50" cy="62" rx="8" ry="4" fill="#000"/>
    <path d="M50 66 L50 75" stroke="#000" strokeWidth="2"/>
  </GlossyFace>
);

const DogTerrier = () => (
  <GlossyFace baseColor="#ffffff">
    <path d="M15 25 L20 10 L40 25 Z" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <path d="M85 25 L80 10 L60 25 Z" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <circle cx="35" cy="48" r="4" fill="#111827"/>
    <circle cx="65" cy="48" r="4" fill="#111827"/>
    <circle cx="50" cy="55" r="4" fill="#111827"/>
    <path d="M20 55 L35 58 M20 62 L35 60" stroke="#333" strokeWidth="1"/>
    <path d="M80 55 L65 58 M80 62 L65 60" stroke="#333" strokeWidth="1"/>
  </GlossyFace>
);

const DogBlackShiba = () => (
  <GlossyFace baseColor="#111827"> 
    <path d="M10 35 L25 5 L45 25 Z" fill="#111827" stroke="#333" strokeWidth="3"/>
    <path d="M90 35 L75 5 L55 25 Z" fill="#111827" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#111827" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.2"/>
    <ellipse cx="35" cy="35" rx="4" ry="2" fill="#d97706"/>
    <ellipse cx="65" cy="35" rx="4" ry="2" fill="#d97706"/>
    <circle cx="25" cy="65" r="10" fill="#fffbeb"/>
    <circle cx="75" cy="65" r="10" fill="#fffbeb"/>
    <circle cx="35" cy="50" r="4" fill="white"/>
    <circle cx="65" cy="50" r="4" fill="white"/>
  </GlossyFace>
);

const DogGreyPoodle = () => (
  <GlossyFace baseColor="#94a3b8">
    <circle cx="12" cy="45" r="16" fill="#94a3b8" stroke="#333" strokeWidth="3"/>
    <circle cx="88" cy="45" r="16" fill="#94a3b8" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="20" rx="20" ry="14" fill="#94a3b8" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#94a3b8" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.3"/>
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="55" r="5" fill="#111827"/>
  </GlossyFace>
);

const DogRed = () => (
  <GlossyFace baseColor="#7f1d1d">
    <path d="M10 25 Q0 50 20 65" fill="#7f1d1d" stroke="#333" strokeWidth="3"/>
    <path d="M90 25 Q100 50 80 65" fill="#7f1d1d" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#7f1d1d" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.2"/>
    <circle cx="35" cy="45" r="4" fill="white"/>
    <circle cx="35" cy="45" r="2" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="white"/>
    <circle cx="65" cy="45" r="2" fill="#111827"/>
    <ellipse cx="50" cy="65" rx="10" ry="6" fill="#000"/>
  </GlossyFace>
);

const DogPatch = () => (
  <GlossyFace baseColor="#e5e7eb">
    <path d="M10 35 L25 5 L45 25 Z" fill="#e5e7eb" stroke="#333" strokeWidth="3"/>
    <path d="M90 35 L75 5 L55 25 Z" fill="#e5e7eb" stroke="#333" strokeWidth="3"/>
    <circle cx="50" cy="50" r="42" fill="#e5e7eb" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    <circle cx="35" cy="45" r="12" fill="#374151"/>
    <circle cx="35" cy="45" r="4" fill="#e5e7eb"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="60" r="5" fill="#111827"/>
  </GlossyFace>
);

export const ICONS_MAP: Record<number, React.FC> = {
  1: DogShiba,
  2: DogPug,
  3: DogHusky,
  4: DogBeagle,
  5: DogChocoPoodle,
  6: DogDalmatian,
  7: DogPoodle,
  8: DogSchnauzer,
  9: DogRetriever,
  10: DogFrenchie,
  11: DogTerrier,
  12: DogBlackShiba,
  13: DogGreyPoodle,
  14: DogRed,
  15: DogPatch
};
