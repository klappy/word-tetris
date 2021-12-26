import React, { Component } from 'react';
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
import { checkWord, randomEnglishWordsOfLength } from '../helpers/randomWords';
import { randomCharacterFromWords } from '../helpers/randomCharacter';
import { gameStylesheet } from '../helpers/gameStylesheet';
import { onKeyPress } from '../helpers/keypress';
import { moveLetters } from '../helpers/moveLetters';

import { GAMESTATE } from '../config/gameState';
import { checkWordAndDestroy } from '../helpers/checkWordAndDestroy';

const styles = gameStylesheet;

const wordBank = randomEnglishWordsOfLength({count: 1, minLength: 3, maxLength: 3});

class Game extends Component {
    nextLetter = undefined;
    letters = [];
    wordQueue = [];
    gameState = GAMESTATE.INITIAL;
    checkWordAutomatic;
    state = {
        updateFlag: false,
        score: 0
    };
    
    componentDidMount() {
        window.addEventListener("keydown", this._onKeyPress);
    }

    _onKeyPress = (evt) => {
        onKeyPress({
            evt,
            letters: this.letters,
            toggleUpdateFlag: this.toggleUpdateFlag,
            alreadyHasLetterInPos: this._alreadyHasLetterInPos,
            noOfColumns,
            numberOfRows,
        });
    };

    updateScore = (score) => {
        this.setState({
            updateFlag: !this.state.updateFlag,
            score,
        });
    };

    toggleUpdateFlag = (score) => {
        this.setState({
            updateFlag: !this.state.updateFlag,
        });
    };


    _startGame = () => {
        if (this.gameState !== GAMESTATE.PAUSED)
            this.setState({ score: 0 })
        this.gameState = GAMESTATE.IN_PROGRESS;
        if (this.letters.length === 0) {
            this.generateLetter();
        }
        setTimeout(this.startMoving, moveTime);
    }

    _pauseGame = () => {
        this.gameState = GAMESTATE.PAUSED;
        clearInterval(this.gameInterval)
        saveHighScore(this.state.score) //just save
        this.setState({ updateFlag: !this.state.updateFlag })
    }

    startMoving = () => {
        clearInterval(this.gameInterval)
        this.gameInterval = setInterval(this._moveLetters, moveTime);
    }

    _alreadyHasLetterInPos = (pos) => {
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x === pos.x && this.letters[i].pos.y === pos.y) {
                return true;
            }
        }
        return false;
    }

    _setGameState = (gameState) => {
        this.gameState = gameState;
    };

    _moveLetters = () => {
        moveLetters({
            letters: this.letters,
            alreadyHasLetterInPos: this._alreadyHasLetterInPos,
            score: this.state.score,
            gameInterval: this.gameInterval,
            onGameState: this._setGameState,
            toggleUpdateFlag: this.toggleUpdateFlag,
            generateLetter: this.generateLetter,
            numberOfRows,
            saveHighScore,
        });
    };

    _getNewLetter = () => {
        let _newLetter;
        if (this.nextLetter) {
            _newLetter = this.nextLetter;
            this.nextLetter = randomCharacterFromWords({words: wordBank});
        } else {
            _newLetter = randomCharacterFromWords({words: wordBank});
            this.nextLetter = randomCharacterFromWords({words: wordBank});
        }
        return _newLetter;
    }

    generateLetter = () => {
        const letter = this._getNewLetter();
        const columnno = Math.floor(Math.random() * noOfColumns);
        const newLetter = {
            letter: letter,
            moving: true,
            isWord: false,
            pos: {
                x: columnno,
                y: 0
            }
        }
        this.letters = [...this.letters, newLetter]
        this.setState({ updateFlag: !this.state.updateFlag })
    }

    _getLetterForThisColumn = (column) => {
        const _letterInColumn = []
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x === column)
                _letterInColumn.push(this.letters[i])
        }
        return _letterInColumn
    }

    _getColumn = () => {
        let columns = []
        for (let i = 0; i < noOfColumns; i++) {
            const letter = this._getLetterForThisColumn(i)
            columns.push(<BlockColumn key={`column${i}`} columnId={i} letters={letter} onLetterClick={this._onLetterClick} />)
        }

        return columns;
    }

    _onLetterClick = (letter) => {

        this.letters.find(_l => {
            if (_l && _l.pos.x === letter.pos.x && _l.pos.y === letter.pos.y) {
                _l.isWord = !_l.isWord;

                if (_l.isWord)
                    this.wordQueue.push(letter);
                else {
                    //remove from wordQueue
                    this.wordQueue.splice(this.wordQueue.findIndex(_l => _l && _l.pos.x === letter.pos.x && _l.pos.y === letter.pos.y), 1);
                }
            };
            return null;
        })

        this.setState({ updateFlag: !this.state.updateFlag })


        //check word automatically 
        clearTimeout(this.checkWordAutomatic)
        this.checkWordAutomatic = setTimeout(this._checkWordAndDestroy, checkWordTime)

    }

    _checkWordAndDestroy = () => {
        const { wordQueue, letters } = checkWordAndDestroy({
            letters: this.letters,
            wordQueue: this.wordQueue,
            toggleUpdateFlag: this.toggleUpdateFlag,
            score: this.state.score,
            updateScore: this.updateScore,
            wordBank,
        });
        this.wordQueue = wordQueue;
        this.letters = letters;
    };

    render() {
        return (
            <div className={css(styles.container)} >
                <div className={css(styles.scoreLine)}>
                    <div className={css(styles.score)}> {`Best : ${getHighScore()}`} </div>
                    <div className={css(styles.score)}> {`Score : ${this.state.score}`} </div>
                    {this.nextLetter && <div className={css(styles.score)}> {`Next : ${this.nextLetter.toUpperCase()}`} </div>}
                </div>
                {this.gameState !== GAMESTATE.ENDED &&
                    <div className={css(styles.gameContainer)}>
                        {this._getColumn()}
                    </div>
                }
                {this.gameState === GAMESTATE.ENDED &&
                    <GameOver score={this.state.score} />
                }
                <div className={css(styles.controlContainer)}>
                    {this.gameState !== GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={this._startGame}> {this.letters.length > 0 ? "Resume" : "Start"}</Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={this._pauseGame}> Pause</Button>}
                    {this.wordQueue.length > 0 &&
                        <Button variant="contained" size="small" color="primary" className={css([styles.buttons, styles.destroyColor])} onClick={this._checkWordAndDestroy}> Destroy</Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._moveLeft}><LeftIcon /></Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._moveDown}><DownIcon /></Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._moveRight}><RightIcon /></Button>}
                </div>
                <About score={this.state.score} wordBank={wordBank} />
            </div>
        );
    }
}


export default Game


