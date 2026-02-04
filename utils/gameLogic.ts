
import { Point, TileData, TileType } from '../types';

// Check if a point is within grid bounds
export const isValidPoint = (p: Point, rows: number, cols: number): boolean => {
  return p.row >= 0 && p.row < rows && p.col >= 0 && p.col < cols;
};

// Check if point is empty (no tile or matched tile)
const isEmpty = (p: Point, board: (TileData | null)[][]): boolean => {
  if (!isValidPoint(p, board.length, board[0].length)) return false;
  const tile = board[p.row][p.col];
  return tile === null || tile.isMatched;
};

// Directions: Up, Down, Left, Right
const DIRECTIONS = [
  { dr: -1, dc: 0 }, // Up
  { dr: 1, dc: 0 },  // Down
  { dr: 0, dc: -1 }, // Left
  { dr: 0, dc: 1 },  // Right
];

// BFS to find path with max 2 turns (3 segments)
export const findPath = (
  start: Point,
  end: Point,
  board: (TileData | null)[][]
): Point[] | null => {
  const rows = board.length;
  const cols = board[0].length;

  // Queue stores: [currentPoint, pathSoFar, lastDirectionIndex, turnCount]
  // directionIndex: 0-3, -1 for start
  const queue: Array<{
    point: Point;
    path: Point[];
    dirIdx: number;
    turns: number;
  }> = [];

  queue.push({ point: start, path: [start], dirIdx: -1, turns: 0 });

  // Optimization: track minTurns to reach a cell.
  const minTurns = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Infinity)
  );
  minTurns[start.row][start.col] = 0;

  while (queue.length > 0) {
    const { point, path, dirIdx, turns } = queue.shift()!;

    if (point.row === end.row && point.col === end.col) {
      return path;
    }

    for (let i = 0; i < DIRECTIONS.length; i++) {
      const { dr, dc } = DIRECTIONS[i];
      const next: Point = { row: point.row + dr, col: point.col + dc };

      // Boundary check
      if (!isValidPoint(next, rows, cols)) continue;

      // Obstacle check: Must be empty OR be the destination
      const isDestination = next.row === end.row && next.col === end.col;
      if (!isEmpty(next, board) && !isDestination) continue;

      // Turn logic
      const newTurns = (dirIdx !== -1 && dirIdx !== i) ? turns + 1 : turns;

      // Constraint: Max 2 turns
      if (newTurns > 2) continue;

      if (newTurns <= minTurns[next.row][next.col] || (isDestination && newTurns <= 2)) {
         if (newTurns < minTurns[next.row][next.col]) {
            minTurns[next.row][next.col] = newTurns;
         }
         
         queue.push({
          point: next,
          path: [...path, next],
          dirIdx: i,
          turns: newTurns,
        });
      }
    }
  }

  return null;
};

// Find a valid match for Hint system
export const findAvailableMatch = (board: (TileData | null)[][]): { tile1: TileData, tile2: TileData, path: Point[] } | null => {
  const rows = board.length;
  const cols = board[0].length;
  const activeTiles: TileData[] = [];

  // Gather all active tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = board[r][c];
      if (t && !t.isMatched) {
        activeTiles.push(t);
      }
    }
  }

  // Group by type
  const byType: Record<number, TileData[]> = {};
  for (const t of activeTiles) {
    if (!byType[t.type]) byType[t.type] = [];
    byType[t.type].push(t);
  }

  // Check pairs
  for (const type in byType) {
    const group = byType[type];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const path = findPath(group[i].position, group[j].position, board);
        if (path) {
          return { tile1: group[i], tile2: group[j], path };
        }
      }
    }
  }

  return null;
};

// Initialize Board with 1-tile padding
export const createBoard = (rows: number, cols: number, tileTypesCount: number): (TileData | null)[][] => {
  // We assume rows/cols includes the padding. 
  // Playable area is (rows-2) x (cols-2).
  const playRows = rows - 2;
  const playCols = cols - 2;
  
  if (playRows <= 0 || playCols <= 0) throw new Error("Board too small");

  const totalTiles = playRows * playCols;
  if (totalTiles % 2 !== 0) {
    throw new Error("Playable board size must be even");
  }

  const pairsNeeded = totalTiles / 2;
  const tiles: TileType[] = [];

  for (let i = 0; i < pairsNeeded; i++) {
    // Generate types 1..tileTypesCount, looping if needed
    const type = (i % tileTypesCount) + 1;
    tiles.push(type, type);
  }

  // Initial Fisher-Yates Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // --- HARD MODE ADJUSTMENT: De-clumping ---
  // Try to prevent adjacent identical tiles to reduce "easy" matches.
  // This loop swaps a tile if it matches its left neighbor.
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i] === tiles[i-1]) {
      // Find a random candidate to swap with that isn't the same type
      let swapIdx = Math.floor(Math.random() * tiles.length);
      let attempts = 0;
      while (tiles[swapIdx] === tiles[i] && attempts < 10) {
        swapIdx = Math.floor(Math.random() * tiles.length);
        attempts++;
      }
      // Swap
      const temp = tiles[i];
      tiles[i] = tiles[swapIdx];
      tiles[swapIdx] = temp;
    }
  }

  // Place on board (with padding)
  const board: (TileData | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  
  let idx = 0;
  for (let r = 1; r <= playRows; r++) {
    for (let c = 1; c <= playCols; c++) {
      board[r][c] = {
        id: `tile-${r}-${c}-${idx}`,
        type: tiles[idx],
        position: { row: r, col: c },
        isMatched: false,
      };
      idx++;
    }
  }

  return board;
};

// Check if any move is possible (for shuffle logic)
export const hasPossibleMoves = (board: (TileData | null)[][]): boolean => {
  return findAvailableMatch(board) !== null;
};

// Improved Shuffle: Scatters tiles to completely random new positions
export const shuffleBoard = (board: (TileData | null)[][]): (TileData | null)[][] => {
    const rows = board.length;
    const cols = board[0].length;
    const playRows = rows - 2;
    const playCols = cols - 2;
    
    // 1. Collect all active tile types (ignoring current position)
    const activeTypes: TileType[] = [];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = board[r][c];
            if (tile && !tile.isMatched) {
                activeTypes.push(tile.type);
            }
        }
    }

    if (activeTypes.length === 0) return board;

    // 2. Generate ALL valid playable positions (excluding border)
    // This allows tiles to move to spaces that were previously empty
    const allValidPositions: Point[] = [];
    for (let r = 1; r <= playRows; r++) {
        for (let c = 1; c <= playCols; c++) {
            allValidPositions.push({ row: r, col: c });
        }
    }

    // Try shuffling until we find a solvable arrangement (max 20 attempts)
    let bestBoard: (TileData | null)[][] | null = null;

    for (let attempt = 0; attempt < 20; attempt++) {
        // A. Shuffle the types
        const shuffledTypes = [...activeTypes];
        for (let i = shuffledTypes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTypes[i], shuffledTypes[j]] = [shuffledTypes[j], shuffledTypes[i]];
        }

        // B. Shuffle the positions
        const shuffledPositions = [...allValidPositions];
        for (let i = shuffledPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
        }

        // C. Create a fresh empty board
        const tempBoard: (TileData | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

        // D. Place active tiles into the first N random positions
        for (let i = 0; i < shuffledTypes.length; i++) {
            const pos = shuffledPositions[i];
            tempBoard[pos.row][pos.col] = {
                id: `shuffled-${attempt}-${i}-${Date.now()}`, // Force React re-render with new ID
                type: shuffledTypes[i],
                position: pos,
                isMatched: false
            };
        }

        // E. Check if solvable
        if (hasPossibleMoves(tempBoard)) {
            bestBoard = tempBoard;
            break;
        }
    }

    // If we found a solvable board, return it
    if (bestBoard) {
        return bestBoard;
    }

    // Fallback: If 20 attempts fail (unlikely), return a simple random scatter
    const finalBoard: (TileData | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
    
    // Shuffle types one last time
    activeTypes.sort(() => Math.random() - 0.5);
    // Shuffle positions one last time
    allValidPositions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < activeTypes.length; i++) {
        const pos = allValidPositions[i];
        finalBoard[pos.row][pos.col] = {
            id: `fallback-${i}-${Date.now()}`,
            type: activeTypes[i],
            position: pos,
            isMatched: false
        };
    }
    
    return finalBoard;
}
