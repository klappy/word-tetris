import React, { useState, useEffect, useCallback } from 'react';
import { useDeepCompareCallback } from 'use-deep-compare';
import { css } from 'aphrodite';

import Button from '@material-ui/core/Button';
import LeftIcon from '@material-ui/icons/ArrowBack';
import RightIcon from '@material-ui/icons/ArrowForward';
import DownIcon from '@material-ui/icons/ArrowDownward';

import BlockColumn from './Column'
import { noOfColumns, numberOfRows, moveTime, checkWordTime } from '../config/config'
import GameOver from './GameOver';
import About from './About';

import { randomEnglishWordsOfLength } from '../helpers/randomWords';
import { gameStylesheet } from '../helpers/gameStylesheet';

import { GAMESTATE } from '../config/gameState';
import useLetters from '../hooks/useLetters';
import useScore from '../hooks/useScore';
import useHighScore from '../hooks/useHighScore';

const styles = gameStylesheet;

function Game () {
  const initialState = {
    status: GAMESTATE.INITIAL,
    wordBank: randomEnglishWordsOfLength({count: 2, minLength: 3, maxLength: 4}),
  };
  const [state, setState] = useState(initialState);
  const [tick, setTick] = useState(false);
  const [gameInterval, setGameInterval] = useState();

  const { score, addScore, resetScore } = useScore();
  const { highScore } = useHighScore({ score });

  const endGame = () => { setState({ ...state, status: GAMESTATE.ENDED }); };

  const onTick = () => { setTick(false); };

  const {
    letters,
    clearLetters,
    nextLetter,
    useNextLetter,
    wordQueue,
    getLettersForColumn,
    checkWordAndDestroy,
    onLetterClick,
    onDirection,
  } = useLetters({
    wordBank: state.wordBank,
    tick,
    onTick,
    noOfColumns,
    numberOfRows,
    score,
    addScore,
    endGame,
    checkWordTime,
    verbose: false,
  });

  useEffect(() => {
    if (state.status === GAMESTATE.ENDED) {
      clearInterval(gameInterval);
      clearLetters();
    };
  }, [state.status]);

  const startMoving = useCallback(() => {
    clearInterval(gameInterval);
    const _gameInterval = setInterval(() => { setTick(true); }, moveTime);
    setGameInterval(_gameInterval);
  }, [gameInterval, moveTime]);

  const startGame = useDeepCompareCallback(() => {
    if (state.status !== GAMESTATE.PAUSED) resetScore();
    if (letters.length === 0) useNextLetter();
    let status = GAMESTATE.IN_PROGRESS;
    setState({ ...state, status });
    startMoving();
  }, [state, startMoving, useNextLetter]);
    
  const pauseGame = () => {
    const status = GAMESTATE.PAUSED;
    clearInterval(gameInterval);
    setState({ ...state, status });
  };
  
  const getColumns = useDeepCompareCallback(() => {
    let columns = [];
    for (let i = 0; i < noOfColumns; i++) {
      const colLetters = getLettersForColumn(i);
      columns.push(
        <BlockColumn
          key={`column${i}`}
          columnId={i}
          letters={colLetters}
          onLetterClick={onLetterClick}
        />
      );
    };
    return columns;
  }, [noOfColumns, getLettersForColumn, onLetterClick]);

  const scoreComponent = (
    <div className={css(styles.scoreLine)}>
      <div className={css(styles.score)}> {`Best : ${highScore}`} </div>
      <div className={css(styles.score)}> {`Score : ${score}`} </div>
      {nextLetter?.character && <div className={css(styles.score)}> {`Next : ${nextLetter?.character.toUpperCase()}`} </div>}
    </div>
  );
  const boardComponent = (
    <>
      {state.status !== GAMESTATE.ENDED && <div className={css(styles.gameContainer)}>{getColumns()}</div>}
      {state.status === GAMESTATE.ENDED && <GameOver score={score} />}
    </>
  );
  const controlsComponent = (
    <div className={css(styles.controlContainer)}>
      {state.status !== GAMESTATE.IN_PROGRESS && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={startGame}> {letters.length > 0 ? "Resume" : "Start"}</Button>}
      {state.status === GAMESTATE.IN_PROGRESS && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={pauseGame}> Pause</Button>}
      {wordQueue.length > 0 && <Button variant="contained" size="small" color="primary" className={css([styles.buttons, styles.destroyColor])} onClick={checkWordAndDestroy}> Destroy</Button>}
      {state.status === GAMESTATE.IN_PROGRESS && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('left')}}><LeftIcon /></Button>}
      {state.status === GAMESTATE.IN_PROGRESS && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('down')}}><DownIcon /></Button>}
      {state.status === GAMESTATE.IN_PROGRESS && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('right')}}><RightIcon /></Button>}
    </div>
  );
  const aboutComponent = (<About score={score} highScore={highScore} wordBank={state.wordBank} />);
  
  return (
    <div className={css(styles.container)} >
      {scoreComponent}
      {boardComponent}
      {controlsComponent}
      {aboutComponent}
    </div>
  );
};

export default Game;                
                