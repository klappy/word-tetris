import { useState, useCallback, useEffect } from "react";
import { readHighScore, saveHighScore } from '../config/SaveScore';

function useHighScore ({score}) {
  const [highScore, setHighScore] = useState();

  const _readHighScore = useCallback(() => (readHighScore()), []);
  const _saveHighScore = useCallback((score) => (saveHighScore(score)), []);

  useEffect(() => {
    const _highScore = _readHighScore();
    setHighScore(_highScore);
  }, []); // on first run (empty array), get the high score from localstorage and save to state

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]); // if the score is greater than the high score, save to state

  useEffect(() => {
    if (highScore > 0) _saveHighScore(highScore);
  }, [highScore, _saveHighScore]); // if the high score changes and greater than 0, persist to localstorage

  const resetHighScore = useCallback(() => {
    setHighScore(0);
    _saveHighScore(0);
  }, [saveHighScore]);
  
  return {
    highScore,
    resetHighScore,
  };
};

export default useHighScore;