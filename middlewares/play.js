import { playInterval, resetBoard, guessColorCorrect, guessColorWrong, guessPositionCorrect, guessPositionWrong } from '../actions/play';

export default class PlayMiddleware {

  constructor () {
    this.interval;
    this.resetBoardTimeout;
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'start game') {
        this.onStartGame(store);
        next(action);
        return;
      }

      if (action.type === 'guess color') {
        this.onGuessColor(store);
        next(action);
        return;
      }

      if (action.type === 'guess position') {
        this.onGuessPosition(store);
        next(action);
        return;
      }

      if (action.type === 'end game') {
        this.onEndGame(store);
        next(action);
        return;
      }

      next(action);
    };
  }

  onStartGame (store) {
    const { intervalMillis } = store.getState().play;
    this.interval = setInterval(() => {
      store.dispatch(playInterval());
      this.resetBoardTimeout = setTimeout(() => {
        store.dispatch(resetBoard());
      }, intervalMillis * 0.9);
    }, intervalMillis);
  }

  onGuessColor (store) {
    const { history, activeSquareColor, nBack } = store.getState().play;
    console.log('COLOR: last:', history[history.length - 1 - nBack].activeSquareColor, 'current:', activeSquareColor)
    if (history[history.length - 1 - nBack].activeSquareColor !== history[history.length - 1].activeSquareColor) {
      store.dispatch(guessColorWrong());
      this.onEndGame();
      return;
    }

    store.dispatch(guessColorCorrect());
  }

  onGuessPosition (store) {
    const { history, activeSquareIdx, nBack } = store.getState().play;
    console.log('IDX: last:', history[history.length - 1 - nBack].activeSquareIdx, 'current:', activeSquareIdx)
    if (history[history.length - 1 - nBack].activeSquareIdx !== history[history.length - 1 - nBack].activeSquareIdx) {
      store.dispatch(guessPositionWrong());
      this.onEndGame();
      return;
    }

    store.dispatch(guessPositionCorrect());
  }

  onEndGame () {
    clearInterval(this.interval);
    // clearTimeout(this.resetBoardTimeout);
  }

}
