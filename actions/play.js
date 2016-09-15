import { createAction } from 'redux-actions';

export const playInterval = createAction('play interval');
export const resetBoard = createAction('reset board');
export const startGame = createAction('start game');
export const endGame = createAction('end game');
export const guessPosition = createAction('guess position');
export const guessColor = createAction('guess color');
export const guessColorCorrect = createAction('guess colorCorrect');
export const guessColorWrong = createAction('guess colorWrong');
export const guessPositionCorrect = createAction('guess positionCorrect');
export const guessPositionWrong = createAction('guess positionWrong');
