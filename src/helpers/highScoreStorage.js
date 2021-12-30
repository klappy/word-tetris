const HIGH_SCORE_KEY = "highScore";

export const saveHighScore = (score) => {
  localStorage.setItem(HIGH_SCORE_KEY, score);
};

export const readHighScore = () => {
  const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY)
  return savedHighScore || 0;
};