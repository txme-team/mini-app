import React from 'react';

type PixelIconProps = {
  children: React.ReactNode;
};

const PixelIcon: React.FC<PixelIconProps> = ({ children }) => (
  <svg
    viewBox="0 0 16 16"
    className="w-full h-full"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PixelPngIcon: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-full h-full object-contain pointer-events-none select-none"
    style={{ imageRendering: 'pixelated' }}
    draggable={false}
  />
);

export const GearIcon = () => (
  <PixelIcon>
    <rect x="6" y="0" width="4" height="2" fill="#3b435f" />
    <rect x="6" y="14" width="4" height="2" fill="#3b435f" />
    <rect x="0" y="6" width="2" height="4" fill="#3b435f" />
    <rect x="14" y="6" width="2" height="4" fill="#3b435f" />
    <rect x="2" y="2" width="2" height="2" fill="#3b435f" />
    <rect x="12" y="2" width="2" height="2" fill="#3b435f" />
    <rect x="2" y="12" width="2" height="2" fill="#3b435f" />
    <rect x="12" y="12" width="2" height="2" fill="#3b435f" />

    <rect x="3" y="3" width="10" height="10" fill="#2a3149" />
    <rect x="4" y="4" width="8" height="8" fill="#7f8cae" />
    <rect x="5" y="5" width="6" height="6" fill="#9aa7c7" />
    <rect x="6" y="6" width="4" height="4" fill="#d8e0ef" />
    <rect x="7" y="7" width="2" height="2" fill="#56617e" />
  </PixelIcon>
);

export const ShuffleIcon = () => (
  <PixelPngIcon src="/icons/flask.png?v=20260224-6" alt="Shuffle" />
);

export const StarIcon = () => (
  <PixelPngIcon src="/icons/level.png?v=20260224-6" alt="Level" />
);

export const ClockIcon = () => (
  <PixelPngIcon src="/icons/timer.png?v=20260224-6" alt="Timer" />
);

export const VideoIcon = () => (
  <PixelIcon>
    <rect x="1" y="3" width="10" height="10" fill="#1f2a55" />
    <rect x="2" y="4" width="8" height="8" fill="#d6e6ff" />
    <rect x="10" y="6" width="3" height="4" fill="#1f2a55" />
    <rect x="13" y="7" width="2" height="2" fill="#1f2a55" />
  </PixelIcon>
);

export const PauseIcon = () => (
  <PixelPngIcon src="/icons/pause.png?v=20260224-6" alt="Pause" />
);

export const PlayIcon = () => (
  <PixelPngIcon src="/icons/play.png?v=20260224-6" alt="Play" />
);

export const SoundOnIcon = () => (
  <PixelPngIcon src="/icons/sound-on.png?v=20260224-6" alt="Sound on" />
);

export const SoundOffIcon = () => (
  <PixelPngIcon src="/icons/sound-off.png?v=20260224-6" alt="Sound off" />
);

export const RetryIcon = () => (
  <PixelIcon>
    <rect x="6" y="1" width="4" height="2" fill="#1f4e7e" />
    <rect x="4" y="2" width="2" height="2" fill="#1f4e7e" />
    <rect x="10" y="2" width="2" height="2" fill="#1f4e7e" />
    <rect x="12" y="4" width="2" height="2" fill="#1f4e7e" />
    <rect x="13" y="6" width="2" height="4" fill="#1f4e7e" />
    <rect x="12" y="10" width="2" height="2" fill="#1f4e7e" />
    <rect x="10" y="12" width="2" height="2" fill="#1f4e7e" />
    <rect x="6" y="13" width="4" height="2" fill="#1f4e7e" />
    <rect x="4" y="12" width="2" height="2" fill="#1f4e7e" />
    <rect x="2" y="10" width="2" height="2" fill="#1f4e7e" />
    <rect x="1" y="8" width="2" height="2" fill="#1f4e7e" />
    <rect x="2" y="6" width="2" height="2" fill="#59a5d4" />
    <rect x="4" y="4" width="2" height="2" fill="#59a5d4" />
    <rect x="2" y="4" width="2" height="2" fill="#59a5d4" />
    <rect x="1" y="5" width="1" height="3" fill="#59a5d4" />
  </PixelIcon>
);

export const HintIcon = () => (
  <PixelPngIcon src="/icons/hint.png?v=20260224-6" alt="Hint" />
);

export const TrophyIcon = () => (
  <PixelIcon>
    <rect x="4" y="2" width="8" height="2" fill="#ffde74" />
    <rect x="3" y="4" width="10" height="4" fill="#f4ba2a" />
    <rect x="2" y="5" width="1" height="2" fill="#c58515" />
    <rect x="13" y="5" width="1" height="2" fill="#c58515" />
    <rect x="6" y="8" width="4" height="3" fill="#f4ba2a" />
    <rect x="4" y="11" width="8" height="2" fill="#2e3d75" />
    <rect x="3" y="13" width="10" height="2" fill="#1f2a55" />
  </PixelIcon>
);

export const CoinIcon = () => (
  <PixelPngIcon src="/icons/coin.png?v=20260224-6" alt="Coin" />
);

const PixelDogFace: React.FC<{ mood: 'sad' | 'happy' }> = ({ mood }) => (
  <PixelIcon>
    <rect x="3" y="2" width="2" height="2" fill="#2d354d" />
    <rect x="11" y="2" width="2" height="2" fill="#2d354d" />
    <rect x="2" y="4" width="12" height="8" fill="#e8edf4" />
    <rect x="3" y="5" width="10" height="6" fill="#f7f9fd" />
    <rect x="5" y="7" width="2" height="2" fill="#1a1a1a" />
    <rect x="9" y="7" width="2" height="2" fill="#1a1a1a" />
    <rect x="7" y="9" width="2" height="2" fill="#1a1a1a" />
    {mood === 'happy' ? (
      <>
        <rect x="6" y="11" width="4" height="1" fill="#ff7c92" />
        <rect x="7" y="12" width="2" height="1" fill="#ff7c92" />
      </>
    ) : (
      <>
        <rect x="6" y="12" width="4" height="1" fill="#1a1a1a" />
        <rect x="7" y="11" width="2" height="1" fill="#1a1a1a" />
      </>
    )}
  </PixelIcon>
);

export const SadDogIcon = () => <PixelDogFace mood="sad" />;
export const PartyIcon = () => <PixelDogFace mood="happy" />;
