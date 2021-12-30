export const moveLetters = ({
  onTick,
  letters: _letters,
  onLetters,
  alreadyHasLetterInPos,
  numberOfRows,
  useNextLetter,
  endGame,
  verbose,
}) => {
  let letters = [..._letters];
  let moved = false;

  letters = letters.map(_letter => {
    let letter = {..._letter};
    if (letter.moving && letter.pos.y < numberOfRows - 1) {
      const { x, y } = letter.pos;
      const occupied = alreadyHasLetterInPos({ x, y: y + 1 });
      if (!occupied) letter.pos.y = y + 1;
      if (occupied || letter.pos.y === numberOfRows - 1) letter.moving = false;
      if (letter.pos.y === 0) { 
        // can't move, game over
        endGame();
      };
      moved = true;
    };
    return letter;
  });

  if (verbose) console.log('moveLetters() => moved: ', moved);
  if (moved) onLetters(letters);
  else useNextLetter();

  onTick();
};