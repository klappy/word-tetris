import { randomCharacterFromWords } from "./randomCharacter";

export const newLetterFromWords = ({ words, nextLetter, noOfColumns }) => {
  const newLetter = nextLetter || randomCharacterFromWords({words});
  const columnNumber = Math.floor(Math.random() * noOfColumns);
  const letter = {
      letter: newLetter,
      moving: true,
      isWord: false,
      pos: {
          x: columnNumber,
          y: 0
      },
  };
  return letter;
};