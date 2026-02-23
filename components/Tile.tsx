
import React from 'react';
import { TileData } from '../types';
import { getCharacterSpriteByType } from '../constants/characters';

interface TileProps {
  tile: TileData;
  isSelected: boolean;
  isError: boolean;
  isMatching?: boolean;
  onClick: (tile: TileData) => void;
  isShuffling?: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, isSelected, isError, isMatching, onClick, isShuffling }) => {
  if (tile.isMatched) {
    return <div className="w-full h-full" />;
  }

  const character = getCharacterSpriteByType(tile.type);
  const fallbackCharacter = getCharacterSpriteByType(1);
  const [imageSrc, setImageSrc] = React.useState(character.imageSrc);

  React.useEffect(() => {
    setImageSrc(character.imageSrc);
  }, [character.imageSrc]);

  return (
    <div
      onClick={() => onClick(tile)}
      title={character.name}
      aria-label={character.name}
      className={`
        relative w-full h-full cursor-pointer pixel-btn-corner-sm
        flex items-center justify-center
        transition-colors duration-75
        border
        animate-pop-in
        p-[1px]
        ${isShuffling ? 'animate-rumble' : ''}
        ${isMatching 
            ? 'bg-[#ffe4ad] border-[#d1842f] animate-match-pop z-50 shadow-[0_0_0_1px_#fff3cd,0_0_0_2px_#d1842f]' 
            : isSelected 
                ? 'bg-[#fff4cf] border-[#d69a35] z-20 shadow-[0_0_0_1px_#fff9df,0_0_0_2px_#d69a35,0_0_8px_rgba(214,154,53,0.45)] animate-pulse' 
                : 'bg-[linear-gradient(180deg,#eef8ff_0%,#deeffb_100%)] border-[#8fb8d6] hover:bg-[linear-gradient(180deg,#f4fbff_0%,#e7f3fc_100%)]'
        }
        ${isError ? 'bg-[#ffdada] border-[#d55353] animate-shake shadow-none' : ''}
      `}
    >
        <div className={`w-full h-full pixel-btn-corner-sm border border-[#c1daea] bg-[linear-gradient(180deg,#f9fdff_0%,#edf7ff_100%)] ${isSelected && !isMatching && !isShuffling ? 'animate-pixel-bounce scale-[1.03]' : ''}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full overflow-hidden p-[1px]">
            <img
              src={imageSrc}
              alt={character.name}
              draggable={false}
              onError={() => {
                if (imageSrc !== fallbackCharacter.imageSrc) {
                  setImageSrc(fallbackCharacter.imageSrc);
                }
              }}
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{
                imageRendering: 'pixelated',
              }}
            />
            </div>
          </div>
        </div>
    </div>
  );
};

export default React.memo(Tile);
