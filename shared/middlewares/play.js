import { playInterval, missAMatch, resetBoard, guessColorCorrect, guessColorWrong, guessPositionCorrect, guessPositionWrong, guessAudioCorrect, guessAudioWrong } from '../actions/play'

export default class PlayMiddleware {

  constructor ({ interval, resetBoardTimeout, isColorMatch, isPositionMatch, isAudioMatch, missedAMatch }) {
    this.interval = interval
    this.resetBoardTimeout = resetBoardTimeout
    this.isColorMatch = isColorMatch
    this.isPositionMatch = isPositionMatch
    this.isAudioMatch = isAudioMatch
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

      if (action.type === 'guess color') {
        this.onGuessColor(store.getState().play, store.dispatch)
        next(action)
        return
      }

      if (action.type === 'guess position') {
        this.onGuessPosition(store.getState().play, store.dispatch)
        next(action)
        return
      }

      if (action.type === 'guess audio') {
        this.onGuessAudio(store.getState().play, store.dispatch)
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

  onTick ({ speed, history, nBack, modes, positionGuessed, colorGuessed, audioGuessed }, dispatch) {
    if (this.missedAMatch(history, nBack, modes, positionGuessed, colorGuessed, audioGuessed)) {
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

  onGuessColor ({ history, nBack }, dispatch) {
    if (!this.isColorMatch(history, nBack)) {
      dispatch(guessColorWrong())
      this.endGame()
      return
    }

    dispatch(guessColorCorrect())
  }

  onGuessPosition ({ history, nBack }, dispatch) {
    if (!this.isPositionMatch(history, nBack)) {
      dispatch(guessPositionWrong())
      this.endGame()
      return
    }

    dispatch(guessPositionCorrect())
  }

  onGuessAudio ({ history, nBack }, dispatch) {
    if (!this.isAudioMatch(history, nBack)) {
      dispatch(guessAudioWrong())
      this.endGame()
      return
    }

    dispatch(guessAudioCorrect())
  }

  endGame () {
    this.resetTimers()
  }

  resetTimers () {
    clearInterval(this.interval)
    clearTimeout(this.resetBoardTimeout)
  }

}
