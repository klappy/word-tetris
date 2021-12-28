import React, { useState, useEffect, useCallback } from 'react';
import { useDeepCompareCallback } from 'use-deep-compare';
import { css } from 'aphrodite';

import Button from '@material-ui/core/Button';
import LeftIcon from '@material-ui/icons/ArrowBack';
import RightIcon from '@material-ui/icons/ArrowForward';
import DownIcon from '@material-ui/icons/ArrowDownward';

import BlockColumn from './Column'
import { noOfColumns, numberOfRows, moveTime, checkWordTime } from '../config/config'
import { saveHighScore, getHighScore } from '../config/SaveScore';
import GameOver from './GameOver';
import About from './About';

import { randomEnglishWordsOfLength } from '../helpers/randomWords';
import { gameStylesheet } from '../helpers/gameStylesheet';

import { GAMESTATE } from '../config/gameState';
import useLetters from '../hooks/useLetters';

const styles = gameStylesheet;

function Game () {
  const initialState = {
    score: 0,
    status: GAMESTATE.INITIAL,
    wordBank: randomEnglishWordsOfLength({count: 1, minLength: 3, maxLength: 3}),
  };
  const [state, setState] = useState(initialState);
  const [tick, setTick] = useState(false);
  const [gameInterval, setGameInterval] = useState();
  
  const updateScore = (score) => { setState({ ...state, score }); };

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
    score: state.score,
    updateScore,
    endGame,
    checkWordTime,
    verbose: false,
  });

  useEffect(() => {
    if (state.status === GAMESTATE.ENDED) {
      saveHighScore(score);
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
    let score = (state.status !== GAMESTATE.PAUSED) ? 0 : state.score;
    let status = GAMESTATE.IN_PROGRESS;
    if (letters.length === 0) useNextLetter();
    setState({ ...state, score, status });
    startMoving();
  }, [state, startMoving, useNextLetter]);
    
  const pauseGame = () => {
    const status = GAMESTATE.PAUSED;
    clearInterval(gameInterval);
    saveHighScore(state.score); //just save
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
      <div className={css(styles.score)}> {`Best : ${getHighScore()}`} </div>
      <div className={css(styles.score)}> {`Score : ${state.score}`} </div>
      {nextLetter?.character && <div className={css(styles.score)}> {`Next : ${nextLetter?.character.toUpperCase()}`} </div>}
    </div>
  );
  const boardComponent = (
    <>
      {state.status !== GAMESTATE.ENDED && <div className={css(styles.gameContainer)}>{getColumns()}</div>}
      {state.status === GAMESTATE.ENDED && <GameOver score={state.score} />}
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
  const aboutComponent = (<About score={state.score} wordBank={state.wordBank} />);
  
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
                