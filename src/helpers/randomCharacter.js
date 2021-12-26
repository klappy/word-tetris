export const randomCharacter = ({characters}) => (
  characters.charAt(Math.floor(Math.random() * characters.length))
);

export const unrepeated = (str) => [...new Set(str)].join('');

export const charactersFromWords = ({words=[]}) => words.join('');

export const randomCharacterFromWords = ({words=[]}) => {
  const characters = charactersFromWords({words});
  const char = randomCharacter({characters});
  return char;
};