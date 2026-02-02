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
  timeBonus: number; // Extra time given per level (if any)
}

export type Path = Point[];

export interface GameState {
  level: number;
  score: number;
  hearts: number; // For hints
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