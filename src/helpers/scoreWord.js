export const scoreWord = (word) => {
  const letterScore = 10;
  let score = word.length * letterScore;
  return score;
};