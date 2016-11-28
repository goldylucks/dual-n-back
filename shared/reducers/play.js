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
  status: 'idle',
  activeSquareColor: undefined,
  activeAudioLetter: undefined,
  activeSquareIdx: undefined,
  positionGuessed: false,
  colorGuessed: false,
  idxs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  colors: ['red', 'purple', 'yellow'],
  letters: ['M', 'Q', 'R'],
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
    const turn = getTurn(state)
    return {
      ...state,
      activeSquareColor: turn.activeSquareColor || state.colors[0],
      activeSquareIdx: turn.activeSquareIdx || 5, // middle square when there's no position
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
    turn.activeSquareColor = _.sample(state.colors)
  }
  if (state.modes.position) {
    turn.activeSquareIdx = _.sample(state.idxs)
  }
  if (state.modes.audio) {
    turn.activeAudioLetter = _.sample(state.letters)
  }
  return turn
}

const _TEST_TURNS = [
  // game 1 - 2Back Color Position
  { activeSquareColor: 'red', activeSquareIdx: 1 },
  { activeSquareColor: 'yellow', activeSquareIdx: 2 },
  { activeSquareColor: 'red', activeSquareIdx: 3 }, // click color correct
  { activeSquareColor: 'purple', activeSquareIdx: 2 }, // click position correct
  { activeSquareColor: 'red', activeSquareIdx: 3 }, // click both correct
  { activeSquareColor: 'purple', activeSquareIdx: 3 }, // miss color, score -> 4
  // game 2 - 2Back Color Position
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'yellow', activeSquareIdx: 5 },
  { activeSquareColor: 'yellow', activeSquareIdx: 7 }, // keypress position correct
  { activeSquareColor: 'yellow', activeSquareIdx: 7 }, // keypress color correct
  { activeSquareColor: 'yellow', activeSquareIdx: 7 }, // keypress both correct
  { activeSquareColor: 'red', activeSquareIdx: 7 }, // miss position, score -> 4
  // game 3 - 2Back Color Position
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'purple', activeSquareIdx: 7 }, // miss both, score -> 0
  // game 4 - 1Back Color Position
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'purple', activeSquareIdx: 2 }, // click position wrong, score -> 0
  // game 5 - 1Back Color Position
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'yellow', activeSquareIdx: 2 }, // click color wrong, score -> 0
  // game 6 - 1Back Color Position
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'purple', activeSquareIdx: 2 }, // keypress position wrong, score -> 0
  // game 7 - 1Back Color Position
  { activeSquareColor: 'purple', activeSquareIdx: 7 },
  { activeSquareColor: 'yellow', activeSquareIdx: 2 }, // keypress color wrong, score -> 0
  // game 8 - 1Back Color Position Audio
  { activeSquareColor: 'purple', activeSquareIdx: 7, activeAudioLetter: 'Q' },
  { activeSquareColor: 'purple', activeSquareIdx: 7, activeAudioLetter: 'Q' }, // click all correct
  { activeSquareColor: 'yellow', activeSquareIdx: 2, activeAudioLetter: 'Q' }, // click audio correct
  { activeSquareColor: 'red', activeSquareIdx: 2, activeAudioLetter: 'R' }, // click position correct
  { activeSquareColor: 'red', activeSquareIdx: 4, activeAudioLetter: 'M' }, // click color correct
  { activeSquareColor: 'purple', activeSquareIdx: 7, activeAudioLetter: 'Q' },
  { activeSquareColor: 'purple', activeSquareIdx: 7, activeAudioLetter: 'Q' }, // keypress all correct
  { activeSquareColor: 'yellow', activeSquareIdx: 2, activeAudioLetter: 'Q' }, // keypress audio correct
  { activeSquareColor: 'red', activeSquareIdx: 2, activeAudioLetter: 'R' }, // keypress position correct
  { activeSquareColor: 'red', activeSquareIdx: 4, activeAudioLetter: 'M' }, // keypress color correct
  { activeSquareColor: 'red', activeSquareIdx: 4, activeAudioLetter: 'M' }, // miss color, score -> 12
  // game 9 - 3Back Audio
  { activeAudioLetter: 'M' },
  { activeAudioLetter: 'Q' },
  { activeAudioLetter: 'R' },
  { activeAudioLetter: 'R' },
  { activeAudioLetter: 'Q' }, // click Audio correct
  { activeAudioLetter: 'R' }, // keypress Audio correct

]
