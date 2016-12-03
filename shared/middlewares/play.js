import { playInterval, missAMatch, resetBoard, guessCorrect, guessWrong } from '../actions/play'

export default class PlayMiddleware {

  constructor ({ interval, resetBoardTimeout, isGuessCorrect, missedAMatch }) {
    this.interval = interval
    this.resetBoardTimeout = resetBoardTimeout
    this.isGuessCorrect = isGuessCorrect
    this.missedAMatch = missedAMatch
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

      if (action.type === 'guess') {
        this.onGuess(store.getState().play, store.dispatch, action.payload)
        next(action)
        return
      }

      next(action)
    }
  }

  onStartGame (store) {
    const { speed } = store.getState().play
    this.interval = setInterval(() => {
      this.onTick(store.getState().play, store.dispatch)
    }, speed)
  }

  onTick ({ speed, history, nBack, modes, guessed }, dispatch) {
    if (this.missedAMatch(history, nBack, modes, guessed)) {
      dispatch(missAMatch())
      this.endGame()
      return
    }
    dispatch(playInterval())
    this.resetBoardTimeout = setTimeout(() => {
      dispatch(resetBoard())
    }, speed * 0.8)
  }

  onPauseGame () {
    this.resetTimers()
  }

  onResumeGame (store) {
    store.dispatch(resetBoard())
    this.onStartGame(store)
  }

  onGuess ({ history, nBack }, dispatch, guess) {
    if (!this.isGuessCorrect(history, nBack, guess)) {
      dispatch(guessWrong(guess))
      this.endGame()
      return
    }

    dispatch(guessCorrect(guess))
  }

  endGame () {
    this.resetTimers()
  }

  resetTimers () {
    clearInterval(this.interval)
    clearTimeout(this.resetBoardTimeout)
  }

}
