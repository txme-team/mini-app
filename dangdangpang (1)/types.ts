
export type Point = {
  row: number;
  col: number;
};

// Represents the tile type (the animal ID)
export type TileType = number;

export interface TileData {
  id: string; // unique ID for React keys
  type: TileType;
  position: Point;
  isMatched: boolean; // if true, it's removed from board visually
}

export interface LevelConfig {
  level: number;
  rows: number;
  cols: number;
  tileTypesCount: number; // How many distinct animals appear
  timeLimit: number; // Seconds allowed for this level
}

export type Path = Point[];

export interface GameState {
  level: number;
  score: number;
  timeLeft: number; // in seconds
  isPlaying: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
}

export interface FloatingTextData {
  id: number;
  text: string;
  subText?: string;
  type: 'normal' | 'combo';
}

// Auth Types
export interface UserProfile {
  id: string;
  nickname: string;
  highScore: number;
}
