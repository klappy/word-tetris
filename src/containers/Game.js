import React, { useEffect } from 'react';
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

import { gameStylesheet } from '../helpers/gameStylesheet';

import useLetters from '../hooks/useLetters';
import useScore from '../hooks/useScore';
import useHighScore from '../hooks/useHighScore';
import useGameClock from '../hooks/useGameClock';
import useGameStatus from '../hooks/useGameStatus';
import useWordBank from '../hooks/useWordBank';

const styles = gameStylesheet;

function Game () {

  const { start, pause, end, reset, ready, started, paused, ended } = useGameStatus();
  const { tick, onTick } = useGameClock({ ready, started, paused, ended, moveTime });
  const { score, addScore, resetScore } = useScore();
  const { highScore } = useHighScore({ score });

  const { wordBank, onValidWord } = useWordBank({ count: 1, minLength: 3, maxLength: 4 });

  const {
    letters,
    clearLetters,
    nextLetter,
    getLettersForColumn,
    onLetterClick,
    onDirection,
  } = useLetters({
    wordBank,
    onValidWord,
    tick,
    onTick,
    noOfColumns,
    numberOfRows,
    score,
    addScore,
    endGame: end,
    checkWordTime,
    verbose: true,
  });

  useEffect(() => { if (ready && letters.length > 1) clearLetters(); }, [ready, letters]);
  useEffect(() => { if (ended) clearLetters(); }, [ended, clearLetters]);
  useEffect(() => { if (ready) resetScore(); }, [ready, resetScore]);
  
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
      {ready && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={start}> Start</Button>}
      {paused && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={start}> Resume</Button>}
      {!ready && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={reset}> Reset</Button>}
      {started && <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={pause}> Pause</Button>}
      {started && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('left')}}><LeftIcon /></Button>}
      {started && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('down')}}><DownIcon /></Button>}
      {started && <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={() => {onDirection('right')}}><RightIcon /></Button>}
    </div>
  );
  const aboutComponent = (<About score={score} highScore={highScore} wordBank={wordBank} />);
  
  return (
    <div className={css(styles.container)}>
      {scoreComponent}
      {boardComponent}
      {controlsComponent}
      {aboutComponent}
    </div>
  );
};

export default Game;                
                