import React, { useState, useEffect } from 'react';
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
import { randomCharacterFromWords } from '../helpers/randomCharacter';
import { gameStylesheet } from '../helpers/gameStylesheet';
import { moveDown, moveLeft, moveRight, onKeyPress } from '../helpers/keypress';
import { moveLetters } from '../helpers/moveLetters';

import { GAMESTATE } from '../config/gameState';
import { checkWordAndDestroy } from '../helpers/checkWordAndDestroy';
import { newLetterFromWords } from '../helpers/newLetterFromWords';

const styles = gameStylesheet;

export function Game () {
  const initialState = {
    letters: [],
    wordQueue: [],
    score: 0,
    status: GAMESTATE.INITIAL,
    nextLetter: undefined,
    wordBank: randomEnglishWordsOfLength({count: 1, minLength: 3, maxLength: 3}),
    gameInterval: undefined,
    checkWordAutomatic: undefined,
  };
  const [state, setState] = useState(initialState);

  const onLetters = (letters) => { setState({ ...state, letters }); };

  useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      onKeyPress({
        evt,
        letters: state.letters,
        alreadyHasLetterInPos,
        noOfColumns,
        numberOfRows,
        onLetters,
      });
    });
  }, []);
  
  const updateScore = (score) => {
    setState({ ...state, score });
  };
  
  const generateLetter = useDeepCompareCallback(() => {
    let letters = state.letters;
    const letter = newLetterFromWords({ words: state.wordBank, nextLetter: state.nextLetter, noOfColumns });
    let nextLetter = randomCharacterFromWords({words: state.wordBank});
    letters = [...state.letters, letter];
    setState({ ...state, letters, nextLetter });
  }, [state.letters, state.wordBank, state.nextLetter, noOfColumns]);
  
  const alreadyHasLetterInPos = useDeepCompareCallback((pos) => {
    for (let i = 0; i < state.letters.length; i++) {
      if (state.letters[i].pos.x === pos.x && state.letters[i].pos.y === pos.y) {
        return true;
      };
    };
    return false;
  }, [state.letters]);

  const onGameStatus = useDeepCompareCallback((status) => { setState({ ...state, status }); }, [state]);

  const _moveLetters = useDeepCompareCallback(() => {
    moveLetters({
      letters: state.letters,
      alreadyHasLetterInPos,
      score: state.score,
      gameInterval: state.gameInterval,
      onGameStatus,
      generateLetter,
      numberOfRows,
      saveHighScore,
    });
  }, [state, generateLetter, numberOfRows, saveHighScore, alreadyHasLetterInPos, onGameStatus]);
  
  const startMoving = useDeepCompareCallback(() => {
    clearInterval(state.gameInterval);
    const gameInterval = setInterval(_moveLetters, moveTime);
    setState({...state, gameInterval })
  }, [state.gameInterval, _moveLetters, moveTime, state]);
  
  const startGame = useDeepCompareCallback(() => {
    let score = (state.status !== GAMESTATE.PAUSED) ? 0 : state.score;
    let status = GAMESTATE.IN_PROGRESS;
    if (state.letters.length === 0) {
      generateLetter();
    };
    setState({ ...state, score, status });
    setTimeout(startMoving, moveTime);
  }, [state, startMoving, moveTime, generateLetter]);
    
  const pauseGame = () => {
    const status = GAMESTATE.PAUSED;
    clearInterval(state.gameInterval);
    saveHighScore(state.score); //just save
    setState({ ...state, status });
  };
  
  const getLetterForThisColumn = (column) => {
    const _letterInColumn = [];
    for (let i = 0; i < state.letters.length; i++) {
      if (state.letters[i].pos.x === column) _letterInColumn.push(state.letters[i]);
    };
    return _letterInColumn;
  };
  
  const onLetterClick = (letter) => {
    let wordQueue = state.wordQueue;
    state.letters.find(l => {
      if (l && l.pos.x === letter.pos.x && l.pos.y === letter.pos.y) {
        l.isWord = !l.isWord;
        
        if (l.isWord) wordQueue.push(letter);
        else { //remove from wordQueue
          const index = wordQueue.findIndex(l => l && l.pos.x === letter.pos.x && l.pos.y === letter.pos.y);
          wordQueue.splice(index, 1);
        };
      };
      return null;
    });        
    //check word automatically 
    clearTimeout(state.checkWordAutomatic);
    const checkWordAutomatic = setTimeout(_checkWordAndDestroy, checkWordTime);
    setState({ ...state, wordQueue, checkWordAutomatic });
  };
  
  const getColumn = () => {
    let columns = [];
    for (let i = 0; i < noOfColumns; i++) {
      const letter = getLetterForThisColumn(i);
      columns.push(
        <BlockColumn
        key={`column${i}`}
        columnId={i}
        letters={letter}
        onLetterClick={onLetterClick}
        />
        );
      };
      return columns;
    };
    
    const _checkWordAndDestroy = () => {
      const { wordQueue, letters } = checkWordAndDestroy({
        letters: state.letters,
        wordQueue: state.wordQueue,
        score: state.score,
        updateScore: updateScore,
        wordBank: state.wordBank,
      });
      
      setState({ ...state, wordQueue, letters });
    };
    
    return (
      <div className={css(styles.container)} >
      <div className={css(styles.scoreLine)}>
      <div className={css(styles.score)}> {`Best : ${getHighScore()}`} </div>
      <div className={css(styles.score)}> {`Score : ${state.score}`} </div>
      {state.nextLetter && <div className={css(styles.score)}> {`Next : ${state.nextLetter.toUpperCase()}`} </div>}
      </div>
      {state.status !== GAMESTATE.ENDED &&
        <div className={css(styles.gameContainer)}>
        {getColumn()}
        </div>
      }
      {state.status === GAMESTATE.ENDED &&
        <GameOver score={state.score} />
      }
      <div className={css(styles.controlContainer)}>
      {state.status !== GAMESTATE.IN_PROGRESS &&
        <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={startGame}> {state.letters.length > 0 ? "Resume" : "Start"}</Button>}
        {state.status !== GAMESTATE.PAUSED && state.status === GAMESTATE.IN_PROGRESS &&
          <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={pauseGame}> Pause</Button>}
          {state.wordQueue.length > 0 &&
            <Button variant="contained" size="small" color="primary" className={css([styles.buttons, styles.destroyColor])} onClick={_checkWordAndDestroy}> Destroy</Button>}
            {state.status !== GAMESTATE.PAUSED && state.status === GAMESTATE.IN_PROGRESS &&
              <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={moveLeft}><LeftIcon /></Button>}
              {state.status !== GAMESTATE.PAUSED && state.status === GAMESTATE.IN_PROGRESS &&
                <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={moveDown}><DownIcon /></Button>}
                {state.status !== GAMESTATE.PAUSED && state.status === GAMESTATE.IN_PROGRESS &&
                  <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={moveRight}><RightIcon /></Button>}
                  </div>
                  <About score={state.score} wordBank={state.wordBank} />
                  </div>
                  );
                };
                
                export default Game
                
                
                