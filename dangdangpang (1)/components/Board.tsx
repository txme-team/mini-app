
import React, { useEffect, useState, useRef } from 'react';
import { TileData, Point, Path } from '../types';
import Tile from './Tile';
import { BOARD_COLS } from '../constants';

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

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight,
          cellWidth: clientWidth / BOARD_COLS,
          cellHeight: clientHeight / board.length
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [board]);

  const getPolylinePoints = () => {
    if (!connectionPath || connectionPath.length === 0) return '';
    return connectionPath.map(p => {
      const x = (p.col * dimensions.cellWidth) + (dimensions.cellWidth / 2);
      const y = (p.row * dimensions.cellHeight) + (dimensions.cellHeight / 2);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="relative w-full h-full p-0" ref={containerRef}>
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-sm border-4 border-sky-200">
           <div className="text-3xl font-black text-sky-500 animate-pulse uppercase tracking-widest">PAUSED</div>
        </div>
      )}

      <div 
        className={`grid gap-[1px] h-full content-center transition-opacity duration-300 ${isPaused ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(0, 1fr))`,
          touchAction: 'none' // Critical for game feel in webview
        }}
      >
        {board.map((row, rIndex) => (
          row.map((tile, cIndex) => {
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
