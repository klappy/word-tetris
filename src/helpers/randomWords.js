import englishWords from 'an-array-of-english-words';

export const randomNumber = ({maxNumber}) => Math.floor(Math.random() * maxNumber);

export const randomWords = ({words, count=5}) => {
  let results = [];
  for ( var i = 0; i < count; i++ ) {
    const word = words[randomNumber({maxNumber: words.length})];
    results.push(word);
  };
  return results;
};

export const wordsOfLength = ({words, minLength=3, maxLength=4}) => {
  const filtered = words.filter(word => word.length >= minLength && word.length <= maxLength);
  return filtered;
};

export const randomEnglishWordsOfLength = ({count, minLength, maxLength}) => {
  const words = wordsOfLength({words: englishWords, minLength, maxLength});
  const random = randomWords({words, count});
  return random;
};