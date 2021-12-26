
export const onKeyPress = ({evt, letters, onLetters, alreadyHasLetterInPos, noOfColumns, numberOfRows}) => {
  if (evt.key === "a" || evt.keyCode === 37) {
    evt.preventDefault();
    //move left
    moveLeft({
      letters,
      onLetters,
      alreadyHasLetterInPos,
    });
  } else if (evt.key === "d" || evt.keyCode === 39) {
    evt.preventDefault();
    //move right
    moveRight({
      letters,
      onLetters,
      alreadyHasLetterInPos,
      noOfColumns,
    })
  } else if (evt.key === "s" || evt.keyCode === 40) {
    evt.preventDefault();
    //move right
    moveDown({
      letters,
      onLetters,
      alreadyHasLetterInPos,
      numberOfRows,
    })
  }
};

export const moveLeft = ({letters: _letters, onLetters, alreadyHasLetterInPos}) => {
  let letters = _letters;
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].moving) {
      if (letters[i].pos.x > 0 && !alreadyHasLetterInPos({ x: letters[i].pos.x - 1, y: letters[i].pos.y })) {
        letters[i].pos.x = letters[i].pos.x - 1;
      };
    };
  };
  onLetters(letters);
};

export const moveRight = ({letters: _letters, onLetters, alreadyHasLetterInPos, noOfColumns}) => {
  let letters = _letters;
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].moving) {
      if (letters[i].pos.x < noOfColumns - 1 && !alreadyHasLetterInPos({ x: letters[i].pos.x + 1, y: letters[i].pos.y })) {
        letters[i].pos.x = letters[i].pos.x + 1;
      };
    };
  };
  onLetters(letters);
};

export const moveDown = ({letters: _letters, onLetters, alreadyHasLetterInPos, numberOfRows}) => {
  let letters = _letters;
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].moving) {
      const alreadyHas = alreadyHasLetterInPos({ x: letters[i].pos.x, y: letters[i].pos.y + 1 });
      if (letters[i].pos.y < numberOfRows - 1 && !alreadyHas) {
        letters[i].pos.y = letters[i].pos.y + 1;
      };
      if (letters[i].pos.y === numberOfRows - 1 || alreadyHas) {
        letters[i].moving = false;
      };
    };
  };
  onLetters(letters);
};