import { useState, useCallback, useMemo } from 'react';
import { GAMESTATE } from '../config/gameState';

function useGameStatus () {
  const { INITIAL, IN_PROGRESS, PAUSED, ENDED } = GAMESTATE;
  const [status, setStatus] = useState(INITIAL);

  const start = useCallback(() => { setStatus(IN_PROGRESS); }, []);
  const pause = useCallback(() => { setStatus(PAUSED); }, []);
  const end = useCallback(() => { setStatus(ENDED); }, []);
  const reset = useCallback(() => { setStatus(INITIAL); }, []);

  const ready = useMemo(() => (status === INITIAL), [status]);
  const started = useMemo(() => (status === IN_PROGRESS), [status]);
  const paused = useMemo(() => (status === PAUSED), [status]);
  const ended = useMemo(() => (status === ENDED), [status]);

  return {
    status,
    start,
    pause,
    end,
    reset,
    ready,
    started,
    paused,
    ended,
  };
};

export default useGameStatus;