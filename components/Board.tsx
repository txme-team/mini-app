
import React, { useEffect, useState, useRef } from 'react';
import { TileData, Point, Path } from '../types';
import Tile from './Tile';
import { BOARD_COLS, BOARD_ROWS } from '../constants';

interface BoardProps {
  board: (TileData | null)[][];
  selectedTile: TileData | null;
  secondSelectedTile: TileData | null;
  errorTile: TileData | null;
  onTileClick: (tile: TileData) => void;
  connectionPath: Path | null;
  isPaused: boolean;
  isShuffling?: boolean;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  selectedTile, 
  secondSelectedTile,
  errorTile, 
  onTileClick,
  connectionPath,
  isPaused,
  isShuffling = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, cellWidth: 0, cellHeight: 0 });
  const playableRows = BOARD_ROWS - 2;
  const playableCols = BOARD_COLS - 2;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight,
          cellWidth: clientWidth / playableCols,
          cellHeight: clientHeight / playableRows
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [board, playableCols, playableRows]);

  const mapColToX = (col: number) => {
    if (col <= 0) return 0;
    if (col >= BOARD_COLS - 1) return dimensions.width;
    return ((col - 1) * dimensions.cellWidth) + (dimensions.cellWidth / 2);
  };

  const mapRowToY = (row: number) => {
    if (row <= 0) return 0;
    if (row >= BOARD_ROWS - 1) return dimensions.height;
    return ((row - 1) * dimensions.cellHeight) + (dimensions.cellHeight / 2);
  };

  const getPolylinePoints = () => {
    if (!connectionPath || connectionPath.length === 0) return '';
    return connectionPath.map(p => {
      const x = mapColToX(p.col);
      const y = mapRowToY(p.row);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="relative w-full h-full p-0" ref={containerRef}>
      {isPaused && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
           <div className="text-2xl font-bold text-[#2a3356] animate-pulse uppercase tracking-wider drop-shadow-[0_2px_0_#f3fbff]">PAUSED</div>
           <div className="text-[11px] font-medium mt-2 text-[#2a3356] tracking-wide drop-shadow-[0_1px_0_#f3fbff]">PRESS P OR TAP PLAY</div>
        </div>
      )}

      <div 
        className={`grid gap-[2px] h-full content-center transition-opacity duration-300 ${isPaused ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          gridTemplateColumns: `repeat(${playableCols}, minmax(0, 1fr))`,
          touchAction: 'none' // Critical for game feel in webview
        }}
      >
        {board.slice(1, BOARD_ROWS - 1).map((row, playableRIdx) => (
          row.slice(1, BOARD_COLS - 1).map((tile, playableCIdx) => {
             const rIndex = playableRIdx + 1;
             const cIndex = playableCIdx + 1;
             // Determine if this tile is currently part of a successful match
             const isMatching = !!connectionPath && !!tile && 
                (selectedTile?.id === tile.id || secondSelectedTile?.id === tile.id);

             return (
                <div key={`${rIndex}-${cIndex}`} className="aspect-square w-full h-full">
                  {tile ? (
                    <Tile
                      tile={tile}
                      isSelected={selectedTile?.id === tile.id || secondSelectedTile?.id === tile.id}
                      isError={errorTile?.id === tile.id}
                      isMatching={isMatching}
                      onClick={onTileClick}
                      isShuffling={isShuffling}
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
             );
          })
        ))}
      </div>

      {connectionPath && !isPaused && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
          <polyline
            points={getPolylinePoints()}
            fill="none"
            stroke="#2563eb" // Blue-600
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm opacity-80"
          />
        </svg>
      )}
    </div>
  );
};

export default Board;
