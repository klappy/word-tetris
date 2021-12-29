import { sortWordQueue } from "../config/wordCheck";
import { scoreForThisWord } from "../config/SaveScore";
import { checkWord } from "./randomWords";

export const checkWordAndDestroy = ({letters: _letters, wordQueue: _wordQueue, score, addScore, wordBank}) => {
  let letters = [..._letters];
  let wordQueue = [..._wordQueue];
  if (wordQueue.length > 0) {
    wordQueue = sortWordQueue(wordQueue);
    //check its proper selected // in sequence
    // row check 
    let wordIsInRow = false;
    let wordIsInColumn = false;
    if (wordQueue.length > 1) {
      for (let i = 0; i < wordQueue.length - 1; i++) {
        if (Math.abs(wordQueue[i].pos.x - wordQueue[i + 1].pos.x) === 1) {
          wordIsInRow = true;
        };
      };
    };
    
    if (!wordIsInRow) {
      // if not in row then only we will check for column
      for (let i = 0; i < wordQueue.length - 1; i++) {
        if (Math.abs(wordQueue[i].pos.y - wordQueue[i + 1].pos.y) === 1) {
          wordIsInColumn = true;
        };
      };
    };
    if (wordIsInRow || wordIsInColumn) {
      let word = "";
      wordQueue.forEach(_w => word = word + _w.character);
      if (checkWord({words: wordBank, word: word.toLowerCase()})) {
        letters = foundValidWord({letters, wordQueue, word, score, addScore, wordIsInRow, wordIsInColumn});
      } else if (checkWord({words: wordBank, word: word.toLowerCase().split("").reverse().join("")})) {
        // check reverse word as well
        letters = foundValidWord({letters, wordQueue, word, score, addScore, wordIsInRow, wordIsInColumn});
      };
    };
    wordQueue = [];
    letters = letters.map(l => ({...l, isWord: false}));
  };
  return { wordQueue, letters };
};

export const foundValidWord = ({letters: _letters, wordQueue, word, score, addScore, wordIsInRow, wordIsInColumn}) => {
  let letters = [..._letters];
  // valid word
  letters = letters.filter(_letter => {
    const _letterInWordQueue = wordQueue.find(_wl => (_wl.pos.x === _letter.pos.x && _wl.pos.y === _letter.pos.y))
    if (_letterInWordQueue) return false;
    return true;
  });
  const newScore = score + scoreForThisWord(word.length);

  //fill empty space left by destroyed letters
  if (wordIsInRow) {
    wordQueue.forEach(_wq => {
      letters.forEach(_l => {
        if (_l.pos.x === _wq.pos.x && _l.pos.y < _wq.pos.y) {
          _l.pos.y = _l.pos.y + 1;
        };
      });
    });
  } else if (wordIsInColumn) {
    letters.forEach(_l => {
      if (_l.pos.x === wordQueue[0].pos.x && _l.pos.y < wordQueue[0].pos.y) {
        _l.pos.y = _l.pos.y + wordQueue.length;
      };
    });
  };

  addScore(newScore);

  return letters;
};