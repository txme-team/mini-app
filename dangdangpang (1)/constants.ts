
import { LevelConfig } from './types';

// Board size including invisible border for pathfinding
// Playable area request: 7 columns x 10 rows
// Total size with padding: (7+2) columns x (10+2) rows
export const BOARD_ROWS = 12;
export const BOARD_COLS = 9;

export const TOTAL_TIME_SECONDS = 90; // Fallback default
export const TIME_PENALTY_SECONDS = 5; // Reduced penalty slightly as difficulty is higher
export const SCORE_PER_MATCH = 100;

// Defines difficulty progression
// Strategy: More tile types = harder to find matches (less clustering). Less time = more pressure.
export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: { level: 1, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 8, timeLimit: 90 },  // Started harder (was 5)
  2: { level: 2, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 10, timeLimit: 85 },
  3: { level: 3, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 12, timeLimit: 80 },
  4: { level: 4, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 14, timeLimit: 75 },
  5: { level: 5, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 15, timeLimit: 60 }, // HARD: Max types, Low time
};

export const MAX_LEVEL = 5;
