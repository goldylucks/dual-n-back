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
  bestScore: {},
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
    const activeSquareColor = state.mode === 'dual' ? randomizeActiveSquareColor(state.colors) : state.colors[0]
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
    const { bestScore, mode, nBack, score } = state
    bestScore[mode + nBack] = Math.max(score, bestScore[mode + nBack])
    return {
      ...state,
      bestScore,
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
    const { bestScore, mode, nBack, score } = state
    bestScore[mode + nBack] = Math.max(score, bestScore[mode + nBack])
    return {
      ...state,
      bestScore,
      active: false,
      gameOver: true,
    }
  },

  'route toHome' (state, action) {
    return {
      ...state,
      gameOver: false,
      activeSquareIdx: 0,
      activeSquareColor: '',
      score: 0,
      started: false,
    }
  },

  'sync bestScore' (state, action) {
    return {
      ...state,
      bestScore: action.payload,
    }
  },

}, initialState)

function randomizeActiveSquareColor (colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function randomizeActiveSquareIdx () {
  return Math.ceil(Math.random() * 9)
}
