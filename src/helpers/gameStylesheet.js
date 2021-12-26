import { StyleSheet } from 'aphrodite';
import { windowWidth } from '../config/config';


export const gameStylesheet = StyleSheet.create({
  container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
  },
  scoreLine: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#3367D6',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.0rem",
      fontWeight: 600,
      "@media (max-width: 700px)": {
          width: windowWidth()
      },
      "@media (min-width: 700px)": {
          height: 50
      },
  },
  gameContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
  },
  score: {
      margin: 5,
      paddin: 5
  },
  controlContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // flexWrap: 'wrap',
      padding: 0
  },
  buttons: {
      // border: '1px solid blue',
      width: 80,
      height: 40,
      margin: 5
  },
  destroyColor: {
      backgroundColor: "green"
  }
});