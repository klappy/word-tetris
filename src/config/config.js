import viewportSize from "viewport-size";

export const noOfColumns = 10;
export const numberOfRows = 10;
export const moveTime = 700;
export const checkWordTime = 2000;


export const windowHeight = () => viewportSize.getHeight();
export const windowWidth = () => viewportSize.getWidth();

export const blockSize = () => {
    const calculatedSize = (viewportSize.getWidth() - 10) / noOfColumns;
    return calculatedSize < 60 ? calculatedSize : 60;
}


export const COLORS = {
    MOVING: "#8237fb",
    NOTMOVING: "#262723",
    POSSIBLE_WORD: "#32bc4c"
}
