import { handleActions } from 'redux-actions'
import { LOCATION_CHANGE } from 'react-router-redux'
import _ from 'lodash'

const initialState = {
  nBack: 1,
  speed: 2000,
  mode: {
    audio: true,
    position: true,
    color: true,
  },
  status: 'idle',
  activeSquareColor: '',
  activeAudioLetter: '',
  activeSquareIdx: 0,
  positionGuessed: false,
  colorGuessed: false,
  audioGuessed: false,
  idxs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  colors: ['red', 'purple', 'yellow'],
  letters: ['M', 'Q', 'R'],
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
    const { mode } = state
    mode[action.payload] = !mode[action.payload]
    return {
      ...state,
      mode: Object.assign({}, mode),
    }
  },

  'reset board' (state, action) {
    return {
      ...state,
      activeSquareColor: '',
      activeAudioLetter: '',
      activeSquareIdx: 0,
    }
  },

  'start game' (state, action) {
    return {
      ...state,
      status: 'active',
      colorGuessed: false,
      positionGuessed: false,
      audioGuessed: false,
      // reset in case an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeAudioLetter: '',
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
    const turn = {}
    if (state.mode.color) {
      turn.activeSquareColor = _.sample(state.colors)
    }
    if (state.mode.position) {
      turn.activeSquareIdx = _.sample(state.idxs)
    }
    if (state.mode.audio) {
      turn.activeAudioLetter = _.sample(state.letters)
    }
    return {
      ...state,
      activeSquareColor: turn.activeSquareColor,
      activeSquareIdx: turn.activeSquareIdx,
      activeAudioLetter: turn.activeAudioLetter,
      positionGuessed: false,
      colorGuessed: false,
      audioGuessed: false,
      history: state.history.concat(turn),
    }
  },

  'miss aMatch' (state, action) {
    return gameOverState(state)
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
    return gameOverState(state)
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
    return gameOverState(state)
  },

  'guess audioCorrect' (state, action) {
    if (state.audioGuessed) {
      return state
    }
    return {
      ...state,
      audioGuessed: true,
      score: state.score + 1,
    }
  },

  'guess audioWrong' (state, action) {
    return gameOverState(state)
  },

  [LOCATION_CHANGE] (state, action) {
    if (!action.payload.pathname.match(/home|play/)) {
      return state
    }
    return {
      ...state,
      status: 'idle',
      colorGuessed: false,
      positionGuessed: false,
      audioGuessed: false,
      // reset in c1ase an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeAudioLetter: '',
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

function gameOverState (state) {
  const { bestScore, mode, nBack, score } = state
  bestScore[mode + nBack] = Math.max(score, bestScore[mode + nBack])
  return {
    ...state,
    bestScore,
    status: 'gameOver',
  }
}
