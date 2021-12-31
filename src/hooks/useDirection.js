
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import { moveDown, moveLeft, moveRight, onKeyPress } from '../helpers/keypress';

function useDirection ({
  letters,
  onLetters,
  noOfColumns,
  numberOfRows,
}) {
  const [direction, setDirection] = useState();

  const onDirection = useCallback((_direction) => {
    setDirection(_direction);
    if (verbose) console.log('useLetters.onDirection(\''+_direction+'\')');
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      onKeyPress({ evt, onDirection });
    });
  }, []);

  const alreadyHasLetterInPos = useDeepCompareCallback(({ x,y }) => {
    let taken = false;
    letters.forEach(letter => {
      if (letter.pos.x === x && letter.pos.y === y) taken = true;
    });
    return taken;
  }, [letters]);

  useDeepCompareEffect(() => {
    const props = { letters, onLetters, alreadyHasLetterInPos, noOfColumns, numberOfRows, verbose };
    if (direction === 'left') moveLeft(props);
    else if (direction === 'right') moveRight(props);
    else if (direction === 'down') moveDown(props);
    setDirection();
  }, [direction, letters, onLetters, alreadyHasLetterInPos, noOfColumns, numberOfRows, moveLeft, moveRight, moveDown, verbose]);

  return {
    direction,
    onDirection,
  };
};

export default useDirection;