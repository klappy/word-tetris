import { useEffect } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import { wordsOfLength } from "../helpers/randomWords";

function useCheckWord ({ letters, onLetters, addScore, wordBank, onValidWord, verbose }) {
  const [wordQueue, setWordQueue] = useState([]);
  const [autoCheckTimeout, setAutoCheckTimeout] = useState();
  const [autoCheck, setAutoCheck] = useState();

  const _checkWordAndDestroy = useDeepCompareCallback(() => {
    const { wordQueue, letters: _letters } = checkWordAndDestroy({
      letters,
      wordQueue,
      addScore,
      wordBank,
      onValidWord,
      verbose,
    });
    if (verbose) console.log('useLetters._checkWordAndDestroy(): ', letters);
    onLetters(_letters);
    setWordQueue([]);
  }, [addScore, state, wordBank, onValidWord, verbose]);

  const addLetterToWordQueue = useDeepCompareCallback((letter) => {
    setWordQueue([...wordQueue, letter]);
  }, [wordQueue]);

  const removeLetterFromWordQueue = useDeepCompareCallback((letter) => {
    const index = wordQueue.findIndex(l => l && l.pos.x === letter.pos.x && l.pos.y === letter.pos.y);
    wordQueue.splice(index, 1);
  }, [wordQueue]);

  const toggleLetterInWordQueue = useDeepCompareCallback((letter) => {
    letters.find(l => {
      if (l && l.pos.x === letter.pos.x && l.pos.y === letter.pos.y) {
        l.isWord = !l.isWord;
        if (l.isWord) addLetterToWordQueue(letter);
        else removeLetterFromWordQueue(letter);
      };
      return null;
    });
  }, [wordQueue]);

  useEffect(() => {
    startAutoCheckTimeout();
  }, [wordQueue]); // if wordqueue changes and isn't empty start autocheck

  const resetAutoCheck = () => {
    clearTimeout(autoCheckTimeout);
    setAutoCheckTimeout();
  };

  const startAutoCheckTimeout = () => {
    clearTimeout(autoCheckTimeout);
    const _autoCheckTimeout = setTimeout(() => { setAutoCheck(true); }, checkWordTime);
    setAutoCheckTimeout(_autoCheckTimeout);
  };

  return {
    wordQueue,
    addLetterToWordQueue,
    removeLetterFromWordQueue,
    resetAutoCheck,
    startAutoCheckTimeout,
  };
};

export default useCheckWord;