import { useState, useCallback } from "react";

function useScore () {
  const [score, setScore] = useState(0);

  const addScore = useCallback((points) => {
    const newScore = score + points;
    setScore(newScore);
  }, [score]);

  const resetScore = useCallback(() => {
    setScore(0);
  }, []);
  
  return {
    score,
    addScore,
    resetScore,
  };
};

export default useScore;