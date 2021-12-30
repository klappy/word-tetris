import { useState, useEffect, } from "react";

function useGameClock ({ready, started, paused, ended, moveTime}) {
  const [tick, setTick] = useState(false);
  const [gameInterval, setGameInterval] = useState();

  const onTick = () => { setTick(false); };
  
  useEffect(() => {
    if (ended) clearInterval(gameInterval);
  }, [ended]);

  useEffect(() => {
    if (started) {
      clearInterval(gameInterval);
      const _gameInterval = setInterval(() => { setTick(true); }, moveTime);
      setGameInterval(_gameInterval);
    };
  }, [started]); // if status changes, set the game interval

  useEffect(() => {
    if (paused) {
      clearInterval(gameInterval);
      onTick(); // unset the tick asap
    };
  }, [paused]); // if status changes, set the game interval

  return {
    tick,
    onTick,
  };
};

export default useGameClock;