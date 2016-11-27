import { createAction } from 'redux-actions'

export const initApp = createAction('init app')

export const startGame = createAction('start game')
export const playInterval = createAction('play interval')
export const resetBoard = createAction('reset board')
export const missAMatch = createAction('miss aMatch')
export const pauseGame = createAction('pause game')
export const resumeGame = createAction('resume game')

export const guessPosition = createAction('guess position')
export const guessPositionCorrect = createAction('guess positionCorrect')
export const guessPositionWrong = createAction('guess positionWrong')

export const guessColor = createAction('guess color')
export const guessColorCorrect = createAction('guess colorCorrect')
export const guessColorWrong = createAction('guess colorWrong')

export const guessAudio = createAction('guess audio')
export const guessAudioCorrect = createAction('guess audioCorrect')
export const guessAudioWrong = createAction('guess audioWrong')

export const toggleMode = createAction('toggle mode')
export const incrementN = createAction('increment n')
export const decrementN = createAction('decrement n')
export const incrementSpeed = createAction('increment speed')
export const decrementSpeed = createAction('decrement speed')

export const syncBestScores = createAction('sync bestScores')
export const syncGameConfig = createAction('sync gameConfig')
