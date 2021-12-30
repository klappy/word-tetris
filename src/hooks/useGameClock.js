import { useState, useEffect, } from "react";
import { GAMESTATE } from "../config/gameState";

function useGameClock ({status, moveTime}) {
  const [tick, setTick] = useState(false);
  const [gameInterval, setGameInterval] = useState();

  const onTick = () => { setTick(false); };
  
  useEffect(() => {
    if (status === GAMESTATE.ENDED) clearInterval(gameInterval);
  }, [status]);

  useEffect(() => {
    if (status === GAMESTATE.IN_PROGRESS) {
      clearInterval(gameInterval);
      const _gameInterval = setInterval(() => { setTick(true); }, moveTime);
      setGameInterval(_gameInterval);
    } else if (status === GAMESTATE.PAUSED) {
      clearInterval(gameInterval);
      onTick(); // unset the tick asap
    };
  }, [status]); // if status changes, set the game interval

  return {
    tick,
    onTick,
  };
};

export default useGameClock;