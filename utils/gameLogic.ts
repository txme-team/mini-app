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
    const type = (i % tileTypesCount) + 1;
    tiles.push(type, type);
  }

  // Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
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

// Shuffle only remaining tiles
export const shuffleBoard = (board: (TileData | null)[][]): (TileData | null)[][] => {
    const rows = board.length;
    const cols = board[0].length;
    
    // Extract remaining tiles
    const remainingTiles: TileData[] = [];
    const positions: Point[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = board[r][c];
            if (tile && !tile.isMatched) {
                remainingTiles.push(tile);
                positions.push({row: r, col: c});
            }
        }
    }

    // Shuffle tile data (types) but keep positions list same to refill
    for (let i = remainingTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempType = remainingTiles[i].type;
        remainingTiles[i].type = remainingTiles[j].type;
        remainingTiles[j].type = tempType;
        remainingTiles[i].id = `shuffled-${Math.random()}`;
        remainingTiles[j].id = `shuffled-${Math.random()}`;
    }

    const newBoard = board.map(row => row.map(tile => {
        if (tile === null) return null; 
        if (tile.isMatched) return tile; 
        return null;
    }));

    for (let i = 0; i < remainingTiles.length; i++) {
        const pos = positions[i];
        const tile = remainingTiles[i];
        tile.position = pos;
        newBoard[pos.row][pos.col] = tile;
    }

    return newBoard as (TileData | null)[][];
}