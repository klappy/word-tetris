import { useState, useEffect, useCallback } from 'react';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import { moveDown, moveLeft, moveRight, onKeyPress } from '../helpers/keypress';
import { moveLetters } from '../helpers/moveLetters';
import { checkWordAndDestroy } from '../helpers/checkWordAndDestroy';
import { randomCharacterFromWords } from '../helpers/randomCharacter';

function useLetters ({
  wordBank,
  tick,
  onTick,
  noOfColumns,
  numberOfRows,
  score,
  addScore,
  endGame,
  checkWordTime,
  verbose,
}) {
  const initialState = {
    letters: [],
    nextLetter: undefined,
    wordQueue: [],
    autoCheckTimeout: undefined,
  };
  const [state, setState] = useState(initialState);
  const [direction, setDirection] = useState();
  const [autoCheck, setAutoCheck] = useState();

  const onLetters = useDeepCompareCallback((letters) => { setState({ ...state, letters }); }, [state]);

  const clearLetters = useDeepCompareCallback(() => { setState({ ...state, letters: [] }); }, [state]);

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
    const character = randomCharacterFromWords({words: wordBank});
    const nextLetter = newLetter({ character });
    if (verbose) console.log('useLetter.generateNextLetter()', nextLetter);
    setState({ ...state, nextLetter });
  }, [state, wordBank, noOfColumns]);

  useDeepCompareEffect(() => {
    if (!state.nextLetter) {
      if (verbose) console.log('useLetter.useDeepCompareEffect(): !state.nextLetter');
      generateNextLetter();
    };
  }, [state.nextLetter, generateNextLetter]);

  const useNextLetter = useDeepCompareCallback(() => {
    const letter = state.nextLetter;
    const letters = [...state.letters, letter];
    if (verbose) console.log('useLetter.useNextLetter()', letter, letters.length);
    setState({ ...state, letters, nextLetter: undefined });
  }, [state.letters, state.nextLetter]);

  const alreadyHasLetterInPos = useDeepCompareCallback((pos) => {
    for (let i = 0; i < state.letters.length; i++) {
      if (state.letters[i].pos.x === pos.x && state.letters[i].pos.y === pos.y) {
        return true;
      };
    };
    return false;
  }, [state.letters]);

  const _moveLetters = useDeepCompareCallback(() => {
    moveLetters({
      onTick,
      letters: state.letters,
      onLetters,
      alreadyHasLetterInPos,
      useNextLetter,
      numberOfRows,
      endGame,
      verbose,
    });
    if (verbose) console.log('useLetters._moveLetters()');
  }, [state.letters, onLetters, onTick, alreadyHasLetterInPos, useNextLetter, numberOfRows, endGame, verbose]);

  useEffect(() => {
    if (tick) _moveLetters();
  }, [tick, _moveLetters]);

  const getLettersForColumn = useDeepCompareCallback((column) => {
    const { letters } = state;
    const lettersInColumn = [];
    for (let i = 0; i < letters.length; i++) {
      if (letters[i].pos.x === column) lettersInColumn.push(letters[i]);
    };
    return lettersInColumn;
  }, [state.letters]);

  const _checkWordAndDestroy = useDeepCompareCallback(() => {
    const { wordQueue, letters } = checkWordAndDestroy({
      letters: state.letters,
      wordQueue: state.wordQueue,
      score,
      addScore,
      wordBank,
    });
    if (verbose) console.log('useLetters._checkWordAndDestroy(): ', letters);
    setState({ ...state, wordQueue, letters });
  }, [addScore, state]);

  const onLetterClick = useDeepCompareCallback((letter) => {
    let wordQueue = [...state.wordQueue];
    let letters = [...state.letters];
    letters.find(l => {
      if (l && l.pos.x === letter.pos.x && l.pos.y === letter.pos.y) {
        l.isWord = !l.isWord;
        
        if (l.isWord) wordQueue.push(letter);
        else { //remove from wordQueue
          const index = wordQueue.findIndex(l => l && l.pos.x === letter.pos.x && l.pos.y === letter.pos.y);
          wordQueue.splice(index, 1);
        };
      };
      return null;
    });        
    //check word automatically 
    clearTimeout(state.autoCheckTimeout);
    const autoCheckTimeout = setTimeout(() => { setAutoCheck(true); }, checkWordTime);
    if (verbose) console.log('useLetters.onLetterClick(): ', letter);
    setState({ ...state, letters, wordQueue, autoCheckTimeout });
  }, [state, _checkWordAndDestroy, checkWordTime]);

  const onDirection = useCallback((_direction) => {
    if (verbose) console.log('useLetters.onDirection(\''+_direction+'\')');
    setDirection(_direction);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      onKeyPress({ evt, onDirection });
    });
  }, [onDirection]);

  const onMove = useDeepCompareCallback((letters) => {
    setState({ ...state, letters });
  }, [state]);

  useDeepCompareEffect(() => {
    const props = { letters: state.letters, onMove, alreadyHasLetterInPos, noOfColumns, numberOfRows, verbose };
    if (direction === 'left') moveLeft(props);
    else if (direction === 'right') moveRight(props);
    else if (direction === 'down') moveDown(props);
    setDirection();
  }, [state.letters, direction, alreadyHasLetterInPos, noOfColumns, numberOfRows, moveLeft, moveRight, moveDown, verbose]);

  useEffect(() => {
    if (autoCheck) {
      _checkWordAndDestroy();
      setAutoCheck(false);
    };
  }, [autoCheck, _checkWordAndDestroy]);

  return {
    letters: state.letters,
    clearLetters,
    nextLetter: state.nextLetter,
    useNextLetter,
    wordQueue: state.wordQueue,
    moveLetters: _moveLetters,
    getLettersForColumn,
    onLetterClick,
    checkWordAndDestroy: _checkWordAndDestroy,
    onDirection: setDirection,
  };
};

export default useLetters;