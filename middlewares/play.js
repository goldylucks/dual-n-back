import { playInterval, resetBoard, guessColorCorrect, guessColorWrong, guessPositionCorrect, guessPositionWrong } from '../actions/play'

export default class PlayMiddleware {

  constructor () {
    this.interval
    this.resetBoardTimeout
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'start game') {
        this.onStartGame(store)
        next(action)
        return
      }

      if (action.type === 'guess color') {
        this.onGuessColor(store)
        next(action)
        return
      }

      if (action.type === 'guess position') {
        this.onGuessPosition(store)
        next(action)
        return
      }

      next(action)
    }
  }

  onStartGame (store) {
    const { intervalMillis } = store.getState().play
    this.interval = setInterval(() => {
      store.dispatch(playInterval())
      this.resetBoardTimeout = setTimeout(() => {
        store.dispatch(resetBoard())
      }, intervalMillis * 0.9)
    }, intervalMillis)
  }

  onGuessColor (store) {
    const { history, nBack } = store.getState().play
    if (history[history.length - 1 - nBack].activeSquareColor !== history[history.length - 1].activeSquareColor) {
      store.dispatch(guessColorWrong())
      this.onEndGame()
      return
    }

    store.dispatch(guessColorCorrect())
  }

  onGuessPosition (store) {
    const { history, nBack } = store.getState().play
    if (history[history.length - 1 - nBack].activeSquareIdx !== history[history.length - 1].activeSquareIdx) {
      store.dispatch(guessPositionWrong())
      this.onEndGame()
      return
    }

    store.dispatch(guessPositionCorrect())
  }

  onEndGame () {
    clearInterval(this.interval)
    clearTimeout(this.resetBoardTimeout)
  }

}
