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

import useLetters from '../hooks/useLetters';
import useScore from '../hooks/useScore';
import useHighScore from '../hooks/useHighScore';
import useGameClock from '../hooks/useGameClock';
import useGameStatus from '../hooks/useGameStatus';

const styles = gameStylesheet;

function Game () {
  const initialState = {
    wordBank: randomEnglishWordsOfLength({count: 2, minLength: 3, maxLength: 4}),
  };
  const [state, setState] = useState(initialState);

  const { status, start, pause, end, reset, ready, started, paused, ended } = useGameStatus();
  const { tick, onTick } = useGameClock({ status, moveTime });
  const { score, addScore, resetScore } = useScore();
  const { highScore } = useHighScore({ score });

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
    endGame: end,
    checkWordTime,
    verbose: false,
  });

  useEffect(() => { if (ended) clearLetters(); }, [ended, clearLetters]);

  const startGame = useDeepCompareCallback(() => {
    if (!paused) resetScore();
    if (letters.length === 0) useNextLetter();
    start();
  }, [state, resetScore, useNextLetter]);
  
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
      {!ended && <div className={css(styles.gameContainer)}>{getColumns()}</div>}
      {ended && <GameOver score={score} highScore={highScore} />}
    </>
  );
  const controlsComponent = (
    <div className={css(styles.controlContainer)}>
      {!started && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={start}> {letters.length > 0 ? "Resume" : "Start"}</Button>}
      {started && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={pause}> Pause</Button>}
      {wordQueue.length > 0 && <Button variant="contained" size="small" color="primary" className={css([styles.buttons, styles.destroyColor])} onClick={checkWordAndDestroy}> Destroy</Button>}
      {started && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('left')}}><LeftIcon /></Button>}
      {started && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('down')}}><DownIcon /></Button>}
      {started && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('right')}}><RightIcon /></Button>}
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
                