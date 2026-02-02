import React from 'react';
import { TileData } from '../types';
import { ICONS_MAP } from './Icons';

interface TileProps {
  tile: TileData;
  isSelected: boolean;
  isError: boolean;
  isMatching?: boolean;
  onClick: (tile: TileData) => void;
}

const Tile: React.FC<TileProps> = ({ tile, isSelected, isError, isMatching, onClick }) => {
  if (tile.isMatched) {
    return <div className="w-full h-full" />;
  }

  const Icon = ICONS_MAP[tile.type] || ICONS_MAP[1];

  return (
    <div
      onClick={() => onClick(tile)}
      className={`
        relative w-full h-full cursor-pointer
        flex items-center justify-center
        transition-colors duration-75
        border-2
        ${isMatching 
            ? 'bg-yellow-300 border-yellow-500 animate-match-pop z-50' 
            : isSelected 
                ? 'bg-yellow-200 border-yellow-600 z-10' 
                : 'bg-white border-blue-900 hover:bg-blue-50'
        }
        ${isError ? 'bg-red-200 border-red-500 animate-shake' : ''}
      `}
    >
        {/* Remove all padding/margins, force icon to take full available space minus minimal breathing room */}
        <div className={`w-full h-full p-[1px] ${isSelected && !isMatching ? 'animate-pixel-bounce' : ''}`}>
           <Icon />
        </div>
    </div>
  );
};

export default React.memo(Tile);