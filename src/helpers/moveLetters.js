import { GAMESTATE } from "../config/gameState";

export const  moveLetters = ({letters, alreadyHasLetterInPos, numberOfRows, score, saveHighScore, gameInterval, onGameState, toggleUpdateFlag, generateLetter}) => {
  let updatedSomething = false
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].pos.y < numberOfRows - 1 && letters[i].moving) {
      const alreadyHas = alreadyHasLetterInPos({ x: letters[i].pos.x, y: letters[i].pos.y + 1 })
      if (!alreadyHas) letters[i].pos.y = letters[i].pos.y + 1;
      if (letters[i].pos.y === numberOfRows - 1 || alreadyHas) {
        letters[i].moving = false;
      };
      if (letters[i].pos.y === 0) {
        // so basically one column is full Game over
        saveHighScore(score)
        letters = [];
        clearInterval(gameInterval)
        onGameState(GAMESTATE.ENDED);
        toggleUpdateFlag();
      };
      updatedSomething = true;
    };
  };
  if (updatedSomething) {
    //console.log(this.state.letters, " vs ", updated)
    toggleUpdateFlag();
  } else {
    // this._checkPossibleWords();
    generateLetter();
  };
};