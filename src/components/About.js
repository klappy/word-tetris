import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function About ({score, highScore, wordBank}) {
  return (
    <div className={css(styles.container)}>
      <h3>{`Score : ${score}`}</h3>
      <h3>Words: {wordBank.join(', ').toUpperCase()}</h3>
      <h3>{`High Score: ${highScore}`}</h3>
      
      <h4>Gameplay</h4>
      <p>Destroy words in the word bank by dropping letters in order to make the word vertically or horizontally, forward or reverse.</p>
      <p>Select letters of the word and if it is a valid word in the word bank then it will disappear.</p>
      <h4>Check out github repo here</h4>
      <a className="github-button" href="https://github.com/klappy/wordris" data-size="large" data-show-count="true" aria-label="Star klappy/wordris on GitHub">Github Repo</a>
    </div>
  );
};

export default About;