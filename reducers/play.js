import { handleActions } from 'redux-actions';

const initialState = {
  nBack: 2,
  started: false,
  active: false,
  activeSquareColor: '',
  activeSquareIdx: 0,
  intervalMillis: 1000,
  colors: ['red', 'yellow', 'purple'],
  history: [],
  score: 0
};

export default handleActions({

  'reset board' (state, action) {
    return {
      ...state,
      activeSquareColor: '',
      activeSquareIdx: 0
    };
  },

  'start game' (state, action) {
    return {
      ...state,
      started: true,
      active: true,
      // reset in case an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeSquareIdx: 0
    };
  },

  'end game' (state, action) {
    return {
      ...state,
      started: false,
      active: false
    };
  },

  'play interval' (state, action) {
    const activeSquareColor = randomizeActiveSquareColor(state.colors);
    const activeSquareIdx = randomizeActiveSquareIdx();
    return {
      ...state,
      activeSquareColor,
      activeSquareIdx,
      history: state.history.concat({ activeSquareIdx, activeSquareColor })
    };
  },

  'guess colorCorrect' (state, action) {
    return {
      ...state,
      score: state.score + 1
    };
  },

  'guess colorWrong' (state, action) {
    return {
      ...state,
      started: false,
      active: false
    };
  },

  'guess positionCorrect' (state, action) {
    return {
      ...state,
      score: state.score + 1
    };
  },

  'guess positionWrong' (state, action) {
    return {
      ...state,
      started: false,
      active: false
    };
  }

}, initialState);

function randomizeActiveSquareColor (colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomizeActiveSquareIdx () {
  return Math.ceil(Math.random() * 9);
}
