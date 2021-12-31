import { useState, useEffect } from 'react';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import { moveLetters } from '../helpers/moveLetters';
import useCheckWord from './useCheckWord';
import useNextLetter from './useNextLetter';

function useLetters ({
  wordBank,
  onValidWord: _onValidWord,
  tick,
  onTick,
  noOfColumns,
  numberOfRows,
  addScore,
  endGame,
  checkWordTime,
  verbose,
}) {
  const [letters, setLetters] = useState([]);

  const { nextLetter, clearNextLetter, } = useNextLetter({ wordBank, noOfColumns, verbose });

  const { wordQueue, addLetterToWordQueue, resetAutoCheck, startAutoCheckTimeout } = useCheckWord({ letters, onLetters, addScore, wordBank, onValidWord, verbose });

  const haveLetters = useDeepCompareMemo(() => (letters.length > 0), [letters]);
  const onLetters = useCallback((_letters) => { setLetters(_letters); }, []);
  const clearLetters = useCallback(() => { setLetters([]); }, []);
  const addLetter = useDeepCompareCallback((letter) => {
    const _letters = [...letters, letter];
    onLetters(_letters);
    return (_letters.length > 0);
  }, [letters]);

  const onValidWord = useDeepCompareCallback((word) => {
    _onValidWord(word);
    clearNextLetter();
  }, [clearNextLetter, _onValidWord]);

  const playNextLetter = useDeepCompareCallback(() => {
    if (nextLetter) {
      addLetter(nextLetter) && clearNextLetter();
      if (verbose) console.log('useLetter.playNextLetter()', letter, letters.length);
    };
  }, [letters, nextLetter, clearNextLetter]);

  useEffect(() => {
    if (!haveLetters) playNextLetter();
  }, [haveLetters, playNextLetter]);

  const _moveLetters = useDeepCompareCallback(() => {
    moveLetters({
      onTick,
      letters,
      onLetters,
      alreadyHasLetterInPos,
      playNextLetter,
      numberOfRows,
      endGame,
      verbose,
    });
    if (verbose) console.log('useLetters._moveLetters()');
  }, [letters, onLetters, onTick, alreadyHasLetterInPos, playNextLetter, numberOfRows, endGame, verbose]);

  useEffect(() => {
    if (tick) _moveLetters();
  }, [tick, _moveLetters]);

  const getLettersForColumn = useDeepCompareCallback((column) => {
    const { letters } = state;
    const lettersInColumn = [];
    letters.forEach(letter => {
      if (letter.pos.x === column) lettersInColumn.push(letter);
    });

    return lettersInColumn;
  }, [state.letters]);

  const onLetterClick = useDeepCompareCallback((letter) => {
    let letters = [...letters];
      

    if (verbose) console.log('useLetters.onLetterClick(): ', letter);
    setState({ ...state, letters, wordQueue, autoCheckTimeout });
  }, [state, checkWordTime]);

  const onMove = useDeepCompareCallback((letters) => {
    setState({ ...state, letters });
  }, [state]);

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
    wordQueue: state.wordQueue,
    moveLetters: _moveLetters,
    getLettersForColumn,
    onLetterClick,
    checkWordAndDestroy: _checkWordAndDestroy,
    onDirection: setDirection,
  };
};

export default useLetters;