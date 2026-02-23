export interface CharacterSprite {
  id: number;
  name: string;
  imageSrc: string;
}

const CHARACTER_ASSET_VERSION = 'mini-sheet-20260223-1';

const createCharacter = (id: number, name: string, imageSrc: string): CharacterSprite => ({
  id,
  name,
  imageSrc: `${imageSrc}?v=${CHARACTER_ASSET_VERSION}`,
});

export const CHARACTER_SPRITES: CharacterSprite[] = [
  createCharacter(1, 'Maltese', '/characters/maltese.png'),
  createCharacter(2, 'Samoyed', '/characters/samoyed.png'),
  createCharacter(3, 'Siberian Husky', '/characters/siberian-husky.png'),
  createCharacter(4, 'Chihuahua', '/characters/chihuahua.png'),
  createCharacter(5, 'Shiba Inu', '/characters/shiba-inu.png'),
  createCharacter(6, 'Pomeranian', '/characters/pomeranian.png'),
  createCharacter(7, 'French Bulldog', '/characters/french-bulldog.png'),
  createCharacter(8, 'Poodle', '/characters/poodle.png'),
  createCharacter(9, 'Schnauzer', '/characters/schnauzer.png'),
  createCharacter(10, 'Welsh Corgi', '/characters/welsh-corgi.png'),
  createCharacter(11, 'Doberman Pinscher', '/characters/doberman-pinscher.png'),
  createCharacter(12, 'Jindo', '/characters/jindo.png'),
];

export const CHARACTER_COUNT = CHARACTER_SPRITES.length;

const CHARACTER_BY_ID: Record<number, CharacterSprite> = CHARACTER_SPRITES.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {} as Record<number, CharacterSprite>);

export const getCharacterSpriteByType = (type: number): CharacterSprite => {
  return CHARACTER_BY_ID[type] || CHARACTER_BY_ID[1];
};
