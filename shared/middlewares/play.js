import { playInterval, missAMatch, resetBoard, guessColorCorrect, guessColorWrong, guessPositionCorrect, guessPositionWrong } from '../actions/play'
import { isColorMatch, isPositionMatch, missedAMatch } from '../utils'

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

      if (action.type === 'pause game') {
        this.onPauseGame()
        next(action)
        return
      }

      if (action.type === 'resume game') {
        this.onResumeGame(store)
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
      const { history, nBack, positionGuessed, colorGuessed } = store.getState().play
      if (missedAMatch(history, nBack, positionGuessed, colorGuessed)) {
        store.dispatch(missAMatch())
        this.onEndGame()
        return
      }
      store.dispatch(playInterval())
      this.resetBoardTimeout = setTimeout(() => {
        store.dispatch(resetBoard())
      }, intervalMillis * 0.9)
    }, intervalMillis)
  }

  onPauseGame () {
    this.onEndGame()
  }

  onResumeGame (store) {
    store.dispatch(resetBoard())
    this.onStartGame(store)
  }

  onGuessColor (store) {
    const { history, nBack } = store.getState().play
    if (!isColorMatch(history, nBack)) {
      store.dispatch(guessColorWrong())
      this.onEndGame()
      return
    }

    store.dispatch(guessColorCorrect())
  }

  onGuessPosition (store) {
    const { history, nBack } = store.getState().play
    if (!isPositionMatch(history, nBack)) {
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
