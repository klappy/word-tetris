import { useState, useCallback } from 'react';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';

import { randomCharacterFromWords } from '../helpers/randomCharacter';

function useNextLetter ({
  wordBank,
  noOfColumns,
  verbose,
}) {
  const [nextLetter, setNextLetter] = useState();

  const clearNextLetter = useCallback(() => { setNextLetter(undefined); }, []);

  const newLetter = useCallback(({ character }) => {
    const columnNumber = Math.floor(Math.random() * noOfColumns);
    const letter = {
        character,
        moving: true,
        isWord: false,
        pos: { x: columnNumber, y: 0 },
    };
    return letter;
  }, [noOfColumns]);

  const generateNextLetter = useDeepCompareCallback(() => {
    if (wordBank.length) {
      const character = randomCharacterFromWords({words: wordBank});
      const _nextLetter = newLetter({ character });
      setNextLetter(_nextLetter);
      if (verbose) console.log('useNextLetter.generateNextLetter()', nextLetter);
    };
  }, [wordBank, newLetter, noOfColumns]);

  useDeepCompareEffect(() => {
    if (!nextLetter) {
      if (verbose) console.log('useNextLetter.useDeepCompareEffect(): !nextLetter');
      generateNextLetter();
    };
  }, [nextLetter, generateNextLetter]);

  return {
    nextLetter,
    clearNextLetter,
    generateNextLetter,
  };
};

export default useNextLetter;