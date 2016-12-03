import { handleActions } from 'redux-actions'
import { LOCATION_CHANGE } from 'react-router-redux'
import _ from 'lodash'

import * as utils from '../utils'

const initialState = {
  nBack: 2,
  speed: 2000,
  modes: {
    audio: false,
    position: true,
    color: true,
  },
  guessed: {
    position: false,
    color: false,
    audio: false,
  },
  status: 'idle',
  activeSquareColor: undefined,
  activeAudioLetter: undefined,
  activeSquarePosition: undefined,
  idxs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  colors: ['red', 'purple', 'yellow'],
  letters: ['m', 'q', 'r'],
  history: [],
  bestScores: {},
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
    const modes = Object.assign({}, state.modes)
    modes[action.payload] = !modes[action.payload]
    // don't toggle this modes if all others are off
    if (!_.some(Object.values(modes))) {
      return state
    }
    return {
      ...state,
      modes,
    }
  },

  'reset board' (state, action) {
    return {
      ...state,
      activeSquareColor: '',
      activeAudioLetter: '',
      activeSquarePosition: 0,
    }
  },

  'start game' (state, action) {
    return {
      ...state,
      status: 'active',
      guessed: {
        position: false,
        color: false,
        audio: false,
      },
      // reset in case an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeAudioLetter: '',
      activeSquarePosition: 0,
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
    const turn = getTurn(state)
    return {
      ...state,
      activeSquareColor: turn.color || state.colors[0],
      activeSquarePosition: turn.position || 5, // middle square when there's no position
      activeAudioLetter: turn.audio,
      guessed: {
        position: false,
        color: false,
        audio: false,
      },
      history: state.history.concat(turn),
    }
  },

  'miss aMatch' (state, action) {
    return gameOverState(state)
  },

  'guess correct' (state, { payload: guess }) {
    if (state.guessed[guess]) {
      return state
    }
    state.guessed = Object.assign({}, state.guessed, { [guess]: true })
    return {
      ...state,
      score: state.score + 1,
    }
  },

  'guess wrong' (state, action) {
    return gameOverState(state)
  },

  [LOCATION_CHANGE] (state, action) {
    if (!action.payload.pathname.match(/home|play/)) {
      return state
    }
    return {
      ...state,
      status: 'idle',
      guessed: {
        position: false,
        color: false,
        audio: false,
      },
      // reset in c1ase an old game had highlighted square
      history: [],
      score: 0,
      activeSquareColor: '',
      activeAudioLetter: '',
      activeSquarePosition: 0,
    }
  },

  'sync bestScores' (state, action) {
    return {
      ...state,
      bestScores: action.payload,
    }
  },

  'sync gameConfig' (state, action) {
    return {
      ...state,
      speed: action.payload.speed,
      nBack: action.payload.nBack,
      modes: action.payload.modes,
    }
  },

}, initialState)

function gameOverState (state) {
  let { bestScores, modes, nBack, score } = state
  if (utils.getBestScore(modes, nBack, bestScores) <= score) {
    bestScores = utils.updateBestScores(modes, nBack, bestScores, score)
  }
  return {
    ...state,
    bestScores,
    status: 'gameOver',
  }
}

function getTurn (state) {
  if (process.env.NODE_ENV === 'e2e') {
    return _TEST_TURNS.shift()
  }
  const turn = {}
  if (state.modes.color) {
    turn.color = _.sample(state.colors)
  }
  if (state.modes.position) {
    turn.position = _.sample(state.idxs)
  }
  if (state.modes.audio) {
    turn.audio = _.sample(state.letters)
  }
  return turn
}

const _TEST_TURNS = [
  // game 1 - 2Back Color Position
  { color: 'red', position: 1 },
  { color: 'yellow', position: 2 },
  { color: 'red', position: 3 }, // click color correct
  { color: 'purple', position: 2 }, // click position correct
  { color: 'red', position: 3 }, // click both correct
  { color: 'purple', position: 3 }, // miss color, score -> 4
  // game 2 - 2Back Color Position
  { color: 'purple', position: 7 },
  { color: 'yellow', position: 5 },
  { color: 'yellow', position: 7 }, // keypress position correct
  { color: 'yellow', position: 7 }, // keypress color correct
  { color: 'yellow', position: 7 }, // keypress both correct
  { color: 'red', position: 7 }, // miss position, score -> 4
  // game 3 - 2Back Color Position
  { color: 'purple', position: 7 },
  { color: 'purple', position: 7 },
  { color: 'purple', position: 7 }, // miss both, score -> 0
  // game 4 - 1Back Color Position
  { color: 'purple', position: 7 },
  { color: 'purple', position: 2 }, // click position wrong, score -> 0
  // game 5 - 1Back Color Position
  { color: 'purple', position: 7 },
  { color: 'yellow', position: 2 }, // click color wrong, score -> 0
  // game 6 - 1Back Color Position
  { color: 'purple', position: 7 },
  { color: 'purple', position: 2 }, // keypress position wrong, score -> 0
  // game 7 - 1Back Color Position
  { color: 'purple', position: 7 },
  { color: 'yellow', position: 2 }, // keypress color wrong, score -> 0
  // game 8 - 1Back Color Position Audio
   { color: 'purple', position: 7, audio: 'q' },
  { color: 'purple', position: 7, audio: 'q' }, // click all correct
  { color: 'yellow', position: 2, audio: 'q' }, // click audio correct
  { color: 'red', position: 2, audio: 'r' }, // click position correct
  { color: 'red', position: 4, audio: 'm' }, // click color correct
  { color: 'purple', position: 7, audio: 'q' },
  { color: 'purple', position: 7, audio: 'q' }, // keypress all correct
  { color: 'yellow', position: 2, audio: 'q' }, // keypress audio correct
  { color: 'red', position: 2, audio: 'r' }, // keypress position correct
  { color: 'red', position: 4, audio: 'm' }, // keypress color correct
  { color: 'red', position: 4, audio: 'm' }, // miss color, score -> 12
  // game 9 - 3Back Audio
  { audio: 'm' },
  { audio: 'q' },
  { audio: 'r' },
  { audio: 'r' },
  { audio: 'q' }, // click Audio correct
  { audio: 'r' }, // keypress Audio correct
]
