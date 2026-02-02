import { LevelConfig } from './types';

// Board size including invisible border for pathfinding
// Playable area request: 7 columns x 10 rows
// Total size with padding: (7+2) columns x (10+2) rows
export const BOARD_ROWS = 12;
export const BOARD_COLS = 9;

export const TOTAL_TIME_SECONDS = 100; // Reduced time since fewer tiles
export const TIME_PENALTY_SECONDS = 10;
export const SCORE_PER_MATCH = 100;
export const INITIAL_HEARTS = 3;

// Defines difficulty progression
export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: { level: 1, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 5, timeBonus: 0 },
  2: { level: 2, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 6, timeBonus: 0 },
  3: { level: 3, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 7, timeBonus: 0 },
  4: { level: 4, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 8, timeBonus: 0 },
  5: { level: 5, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 9, timeBonus: 0 },
};

export const MAX_LEVEL = 5;