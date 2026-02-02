import React from 'react';

// --- UI Icons (Keep simple pixel style for UI consistency or update if needed, keeping pixel for retro feel) ---
const SvgIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    {children}
  </svg>
);

export const HeartIcon = () => (
  <SvgIconWrapper>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5"/>
    <path d="M16.5 4.5c1.2 0 2.5.8 2.5 2.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
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

export const PauseIcon = () => (
  <SvgIconWrapper>
    <rect x="6" y="4" width="4" height="16" rx="1" fill="#f8fafc"/>
    <rect x="14" y="4" width="4" height="16" rx="1" fill="#f8fafc"/>
  </SvgIconWrapper>
);

export const PlayIcon = () => (
  <SvgIconWrapper>
    <path d="M5 3l14 9-14 9V3z" fill="#f8fafc"/>
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
// Style: Round, thick stroke, glossy highlight on forehead, cute eyes

interface GlossyFaceProps {
  baseColor: string;
  children?: React.ReactNode;
}

const GlossyFace: React.FC<GlossyFaceProps> = ({ baseColor, children }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
    {/* Base Head */}
    <circle cx="50" cy="50" r="42" fill={baseColor} stroke="#333" strokeWidth="3"/>
    
    {/* Forehead Gloss */}
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {children}
  </svg>
);

// 1. Shiba Inu (Yellow with white cheeks)
const DogShiba = () => (
  <GlossyFace baseColor="#fbbf24"> {/* amber-400 */}
    {/* Ears - Bigger/Taller */}
    <path d="M10 35 L25 5 L45 25 Z" fill="#fbbf24" stroke="#333" strokeWidth="3"/>
    <path d="M90 35 L75 5 L55 25 Z" fill="#fbbf24" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#fbbf24" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {/* White Snout Area */}
    <path d="M25 60 Q50 85 75 60 Q65 45 50 55 Q35 45 25 60" fill="#fffbeb"/>
    <circle cx="50" cy="62" r="5" fill="#111827"/>
    <circle cx="38" cy="45" r="4" fill="#111827"/>
    <circle cx="62" cy="45" r="4" fill="#111827"/>
    <ellipse cx="38" cy="35" rx="3" ry="2" fill="#fffbeb"/>
    <ellipse cx="62" cy="35" rx="3" ry="2" fill="#fffbeb"/>
  </GlossyFace>
);

// 2. Pug (Beige with mask)
const DogPug = () => (
  <GlossyFace baseColor="#fef3c7"> {/* amber-100 */}
    {/* Folded Ears - Bigger/Wider */}
    <path d="M5 25 L30 35 L15 55 Z" fill="#374151" stroke="#333" strokeWidth="3"/>
    <path d="M95 25 L70 35 L85 55 Z" fill="#374151" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#fef3c7" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {/* Mask */}
    <ellipse cx="50" cy="60" rx="25" ry="15" fill="#374151"/>
    
    {/* Eyes */}
    <circle cx="35" cy="50" r="6" fill="#111827"/>
    <circle cx="65" cy="50" r="6" fill="#111827"/>
    
    {/* Nose */}
    <ellipse cx="50" cy="62" rx="8" ry="5" fill="#000"/>
  </GlossyFace>
);

// 3. Husky (Grey/White with Blue eyes)
const DogHusky = () => (
  <GlossyFace baseColor="#9ca3af"> {/* gray-400 */}
    {/* Ears - Very Tall */}
    <path d="M15 35 L25 0 L45 25 Z" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <path d="M85 35 L75 0 L55 25 Z" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {/* Face Mask */}
    <path d="M50 50 Q30 50 20 80 Q50 90 80 80 Q70 50 50 50" fill="white"/>
    <circle cx="35" cy="45" r="8" fill="white"/>
    <circle cx="65" cy="45" r="8" fill="white"/>
    
    {/* Blue Eyes */}
    <circle cx="35" cy="45" r="4" fill="#60a5fa"/>
    <circle cx="65" cy="45" r="4" fill="#60a5fa"/>
    <circle cx="50" cy="65" r="5" fill="#111827"/>
  </GlossyFace>
);

// 4. Beagle (Tri-color)
const DogBeagle = () => (
  <GlossyFace baseColor="#ffffff">
    {/* Floppy Ears - Longer/Wider */}
    <ellipse cx="12" cy="55" rx="12" ry="25" fill="#b45309" stroke="#333" strokeWidth="3"/>
    <ellipse cx="88" cy="55" rx="12" ry="25" fill="#b45309" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    {/* Brown Patch */}
    <path d="M30 15 Q50 40 70 15" fill="#b45309" />
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="60" r="6" fill="#111827"/>
  </GlossyFace>
);

// 5. Choco Curly Poodle (Replaced Pink Poodle, now Lighter Milk Chocolate)
const DogChocoPoodle = () => (
  <GlossyFace baseColor="#8d6e63"> {/* Milk Chocolate Brown */}
    {/* Big Puffy Ears */}
    <circle cx="12" cy="45" r="16" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    <circle cx="88" cy="45" r="16" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    {/* Puffy Top - Bigger */}
    <ellipse cx="50" cy="20" rx="22" ry="15" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#8d6e63" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.2"/>
    
    {/* Face */}
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <ellipse cx="50" cy="55" rx="6" ry="4" fill="#111827"/>
  </GlossyFace>
);

// 6. Dalmatian (Spots)
const DogDalmatian = () => (
  <GlossyFace baseColor="#ffffff">
    {/* Floppy Ears - Bigger */}
    <path d="M10 25 Q-5 50 15 65" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <path d="M90 25 Q105 50 85 65" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {/* Spots */}
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

// 7. Brown Poodle (Amber/Orange Brown)
const DogPoodle = () => (
  <GlossyFace baseColor="#d97706"> {/* amber-600 */}
    {/* Puffy Ears - Bigger */}
    <circle cx="12" cy="45" r="16" fill="#d97706" stroke="#333" strokeWidth="3"/>
    <circle cx="88" cy="45" r="16" fill="#d97706" stroke="#333" strokeWidth="3"/>
    {/* Puffy Top - Bigger */}
    <ellipse cx="50" cy="20" rx="20" ry="14" fill="#d97706" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#d97706" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.3"/>
    
    <circle cx="35" cy="45" r="4" fill="#111827"/>
    <circle cx="65" cy="45" r="4" fill="#111827"/>
    <circle cx="50" cy="55" r="5" fill="#111827"/>
  </GlossyFace>
);

// 8. Schnauzer (Grey with beard)
const DogSchnauzer = () => (
  <GlossyFace baseColor="#9ca3af">
    {/* Folded ears - Taller/Bigger */}
    <path d="M15 20 L30 45 L45 25" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <path d="M85 20 L70 45 L55 25" fill="#9ca3af" stroke="#333" strokeWidth="3"/>

    <circle cx="50" cy="50" r="42" fill="#9ca3af" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.4"/>
    
    {/* Eyebrows */}
    <rect x="25" y="30" width="15" height="8" rx="2" fill="#e5e7eb" transform="rotate(10 32 34)"/>
    <rect x="60" y="30" width="15" height="8" rx="2" fill="#e5e7eb" transform="rotate(-10 68 34)"/>
    
    {/* Beard */}
    <path d="M30 60 Q50 90 70 60 L60 55 L40 55 Z" fill="#e5e7eb" stroke="#333" strokeWidth="1"/>
    
    <circle cx="35" cy="45" r="3" fill="#111827"/>
    <circle cx="65" cy="45" r="3" fill="#111827"/>
    <ellipse cx="50" cy="55" rx="6" ry="4" fill="#111827"/>
  </GlossyFace>
);

// 9. Golden Retriever
const DogRetriever = () => (
  <GlossyFace baseColor="#facc15"> {/* yellow-400 */}
    {/* Floppy Ears - Bigger */}
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

// 10. French Bulldog
const DogFrenchie = () => (
  <GlossyFace baseColor="#1f2937"> {/* gray-800 */}
    {/* Bat Ears - Bigger/Taller */}
    <path d="M10 40 L10 0 L40 30 Z" fill="#1f2937" stroke="#333" strokeWidth="3"/>
    <path d="M90 40 L90 0 L60 30 Z" fill="#1f2937" stroke="#333" strokeWidth="3"/>
    
    <circle cx="50" cy="50" r="42" fill="#1f2937" stroke="#333" strokeWidth="3"/>
    <ellipse cx="50" cy="25" rx="20" ry="10" fill="white" opacity="0.2"/>
    
    {/* Face details */}
    <circle cx="35" cy="50" r="5" fill="#111827"/>
    <circle cx="36" cy="49" r="1" fill="white"/>
    <circle cx="65" cy="50" r="5" fill="#111827"/>
    <circle cx="64" cy="49" r="1" fill="white"/>
    
    <ellipse cx="50" cy="62" rx="8" ry="4" fill="#000"/>
    <path d="M50 66 L50 75" stroke="#000" strokeWidth="2"/>
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
  10: DogFrenchie
};