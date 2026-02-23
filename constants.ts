
import { LevelConfig } from './types';
import { CHARACTER_COUNT } from './constants/characters';

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
  // Early levels are color-curated to reduce similar-looking tiles.
  1: { level: 1, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 6, tileTypePool: [1, 3, 4, 6, 7, 12], timeLimit: 90 },
  2: { level: 2, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 8, tileTypePool: [1, 3, 4, 5, 6, 7, 11, 12], timeLimit: 85 },
  3: { level: 3, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: 10, tileTypePool: [1, 2, 3, 4, 5, 6, 7, 9, 11, 12], timeLimit: 80 },
  4: { level: 4, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: CHARACTER_COUNT, timeLimit: 75 },
  5: { level: 5, rows: BOARD_ROWS, cols: BOARD_COLS, tileTypesCount: CHARACTER_COUNT, timeLimit: 60 }, // HARD: Max types, Low time
};

export const MAX_LEVEL = 5;
