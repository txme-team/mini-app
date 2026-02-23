import { RankingEntry } from '../types';

export interface SoundService {
  init: () => void;
  resume: () => void;
  toggleMute: () => boolean;
  playSelect: () => void;
  playMatchSuccess: () => void;
  playStoreSuccess: () => void;
  playError: () => void;
  playGameOver: () => void;
  playLevelComplete: () => void;
  playEndingCelebration: () => void;
  playBGM: () => void;
  stopBGM: () => void;
}

export interface UserDataService {
  isConnected: () => boolean;
  getUserProfile: () => Promise<{ id: string; nickname: string; highScore: number }>;
  updateProfile: (nickname: string) => Promise<void>;
  saveScore: (currentScore: number) => Promise<void>;
  getRankings: (currentScore: number) => Promise<RankingEntry[]>;
}

export interface AdsService {
  init: () => void;
  showRewardAd: (onReward: () => void, onDismiss: () => void) => void;
}
