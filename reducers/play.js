import { handleActions } from 'redux-actions'

const initialState = {
  nBack: 2,
  mode: 'dual',
  gameOver: false,
  started: false,
  active: false,
  activeSquareColor: '',
  activeSquareIdx: 0,
  intervalMillis: 1500,
  colors: ['red', 'purple', 'yellow'],
  history: [],
  bestScore: 0,
  score: 0,
}

export default handleActions({

  'increment n' (state, action) {
    return {
      ...state,
      nBack: state.nBack + 1,
    }
  },

  'decrement n' (state, action) {
    return {
      ...state,
      nBack: Math.max(1, state.nBack - 1),
    }
  },

  'toggle mode' (state, action) {
    return {
      ...state,
      mode: state.mode === 'dual' ? 'simple' : 'dual',
    }
  },

  'reset board' (state, action) {
    return {
      ...state,
      activeSquareColor: '',
      activeSquareIdx: 0,
    }
  },

  'start game' (state, action) {
    return {
      ...state,
      started: true,
      active: true,
      gameOver: false,
      // reset in case an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeSquareIdx: 0,
    }
  },

  'play interval' (state, action) {
    const activeSquareColor = randomizeActiveSquareColor(state.colors)
    const activeSquareIdx = randomizeActiveSquareIdx()
    return {
      ...state,
      activeSquareColor,
      activeSquareIdx,
      history: state.history.concat({ activeSquareIdx, activeSquareColor }),
    }
  },

  'guess colorCorrect' (state, action) {
    return {
      ...state,
      score: state.score + 1,
    }
  },

  'guess colorWrong' (state, action) {
    return {
      ...state,
      active: false,
      gameOver: true,
    }
  },

  'guess positionCorrect' (state, action) {
    return {
      ...state,
      score: state.score + 1,
    }
  },

  'guess positionWrong' (state, action) {
    return {
      ...state,
      active: false,
      gameOver: true,
    }
  },

}, initialState)

function randomizeActiveSquareColor (colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function randomizeActiveSquareIdx () {
  return Math.ceil(Math.random() * 9)
}
