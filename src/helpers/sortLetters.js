
export const sortWordQueue = (wordQueue) => {
    wordQueue.sort((a, b) => a.pos.x - b.pos.x);
    wordQueue.sort((a, b) => a.pos.y - b.pos.y);
    return wordQueue;
}

export const sortLetters = (letters) => {
    letters.sort((a, b) => b.letter.pos.x - a.letter.pos.x);
    letters.sort((a, b) => b.letter.pos.y - a.letter.pos.y);
    return letters;
}