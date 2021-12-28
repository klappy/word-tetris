
export const onKeyPress = ({ evt, onDirection }) => {
  if (evt.key === "a" || evt.keyCode === 37) { //move left
    evt.preventDefault();
    onDirection('left');
  } else if (evt.key === "d" || evt.keyCode === 39) { //move right
    evt.preventDefault();
    onDirection('right');
  } else if (evt.key === "s" || evt.keyCode === 40) { //move right
    evt.preventDefault();
    onDirection('down');
  };
};

export const moveLeft = ({letters: _letters, onMove, alreadyHasLetterInPos, verbose}) => {
  let letters = [..._letters];
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].moving) {
      if (letters[i].pos.x > 0 && !alreadyHasLetterInPos({ x: letters[i].pos.x - 1, y: letters[i].pos.y })) {
        letters[i].pos.x = letters[i].pos.x - 1;
        if (verbose) console.log('<< moveLeft()\n');
      };
    };
  };
  onMove(letters);
};

export const moveRight = ({letters: _letters, onMove, alreadyHasLetterInPos, noOfColumns, verbose}) => {
  let letters = [..._letters];
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].moving) {
      if (letters[i].pos.x < noOfColumns - 1 && !alreadyHasLetterInPos({ x: letters[i].pos.x + 1, y: letters[i].pos.y })) {
        letters[i].pos.x = letters[i].pos.x + 1;
        if (verbose) console.log('>> moveRight()\n');
      };
    };
  };
  onMove(letters);
};

export const moveDown = ({letters: _letters, onMove, alreadyHasLetterInPos, numberOfRows, verbose}) => {
  let letters = [..._letters];
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].moving) {
      const alreadyHas = alreadyHasLetterInPos({ x: letters[i].pos.x, y: letters[i].pos.y + 1 });
      if (letters[i].pos.y < numberOfRows - 1 && !alreadyHas) {
        letters[i].pos.y = letters[i].pos.y + 1;
        if (verbose) console.log('VV moveDown()\n');
      };
      if (letters[i].pos.y === numberOfRows - 1 || alreadyHas) {
        letters[i].moving = false;
      };
    };
  };
  onMove(letters);
};