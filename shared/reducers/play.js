import { handleActions } from 'redux-actions'
import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  nBack: 2,
  speed: 2000,
  mode: 'dual',
  gameOver: false,
  started: false,
  status: 'idle',
  active: false,
  activeSquareColor: '',
  positionGuessed: false,
  colorGuessed: false,
  activeSquareIdx: 0,
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

  'increment speed' (state, action) {
    return {
      ...state,
      speed: state.speed + 100,
    }
  },

  'decrement speed' (state, action) {
    return {
      ...state,
      speed: Math.max(100, state.speed - 100),
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
      colorGuessed: false,
      positionGuessed: false,
      // reset in case an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeSquareIdx: 0,
    }
  },

  'pause game' (state, action) {
    return {
      ...state,
      status: 'paused',
    }
  },

  'resume game' (state, action) {
    return {
      ...state,
      status: 'active',
    }
  },

  'play interval' (state, action) {
    const activeSquareColor = state.mode === 'dual' ? randomizeActiveSquareColor(state.colors) : state.colors[0]
    const activeSquareIdx = randomizeActiveSquareIdx()
    return {
      ...state,
      activeSquareColor,
      activeSquareIdx,
      positionGuessed: false,
      colorGuessed: false,
      history: state.history.concat({ activeSquareIdx, activeSquareColor }),
    }
  },

  'miss aMatch' (state, action) {
    return onGameOver(state)
  },

  'guess colorCorrect' (state, action) {
    if (state.colorGuessed) {
      return state
    }
    return {
      ...state,
      colorGuessed: true,
      score: state.score + 1,
    }
  },

  'guess colorWrong' (state, action) {
    return onGameOver(state)
  },

  'guess positionCorrect' (state, action) {
    if (state.positionGuessed) {
      return state
    }
    return {
      ...state,
      positionGuessed: true,
      score: state.score + 1,
    }
  },

  'guess positionWrong' (state, action) {
    return onGameOver(state)
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

  [LOCATION_CHANGE] (state, action) {
    if (!action.payload.pathname.match(/home|play/)) {
      return state
    }
    return {
      ...state,
      started: false,
      active: false,
      gameOver: false,
      colorGuessed: false,
      positionGuessed: false,
      // reset in c1ase an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeSquareIdx: 0,
    }
  },

  'sync bestScore' (state, action) {
    return {
      ...state,
      bestScore: action.payload,
    }
  },

}, initialState)

function onGameOver (state) {
  const { bestScore, mode, nBack, score } = state
  bestScore[mode + nBack] = Math.max(score, bestScore[mode + nBack])
  return {
    ...state,
    bestScore,
    active: false,
    gameOver: true,
  }
}

function randomizeActiveSquareColor (colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function randomizeActiveSquareIdx () {
  return Math.ceil(Math.random() * 9)
}

