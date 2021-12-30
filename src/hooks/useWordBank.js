import { useEffect, useState } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import { randomEnglishWordsOfLength } from "../helpers/randomWords";

function useWordBank ({count, minLength, maxLength}) {
  const [wordBank, setWordBank] = useState([]);

  useEffect(() => {
    if (wordBank.length < count) {
      const word = randomEnglishWordsOfLength({ count: 1, minLength, maxLength });
      const _wordBank = [...wordBank, word];
      setWordBank(_wordBank);
    };
  }, [wordBank, count, minLength, maxLength]);

  const onValidWord = useDeepCompareCallback((word) => {
    const _wordBank = wordBank.filter(w => w != word);
    setWordBank(_wordBank);
  }, [wordBank]);

  return {
    wordBank,
    onValidWord,
  }
};

export default useWordBank;