import _ from 'lodash'
import axios from 'axios'
import logger from '../utils/logger'
import * as utils from '../utils'
import { API_URL } from '../constants'
import { playInterval, missAMatch, resetBoard, guessCorrect, guessWrong } from '../actions/play'

export default class PlayMiddleware {

  constructor ({ interval, resetBoardTimeout, isMatch, missedAMatch }) {
    this.interval = interval
    this.resetBoardTimeout = resetBoardTimeout
    this.isMatch = isMatch
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

      if (action.type.match(/guess wrong|miss aMatch/)) {
        this.resetTimers()
        const prevBestScores = store.getState().play.bestScores
        next(action) // let reducer update the state before saving state to DB
        const newBestScores = store.getState().play.bestScores
        this.storeLosingMovesInDB(store)
        if (_.isEqual(prevBestScores, newBestScores)) {
          return
        }
        this.storeBestScoresInDB(store)
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
    const missed = this.missedAMatch(history, nBack, modes, guessed)
    if (missed.length) {
      dispatch(missAMatch(missed))
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
    if (!this.isMatch(history, nBack, guess)) {
      dispatch(guessWrong(guess))
      return
    }

    dispatch(guessCorrect(guess))
  }

  storeLosingMovesInDB (store) {
    const { _id } = store.getState().auth.user
    if (!_id) {
      return
    }
    const { losingMoves } = store.getState().play
    axios.put(`${API_URL}/users/${_id}`, losingMoves)
      .then(() => logger.log('store losing moves to DB:', losingMoves))
      .catch(err => logger.error('store losing moves to DB error:', err))
  }

  storeBestScoresInDB (store) {
    const { _id } = store.getState().auth.user
    if (!_id) {
      return
    }
    const { score, modes, nBack } = store.getState().play
    const mode = utils.getBestScoreKey(modes, nBack)
    axios.put(`${API_URL}/bestScores/addOrUpdate`, { mode, score })
      .then(() => logger.log('store bestScore to DB: success', { mode, score }))
      .catch(err => logger.error('store bestScore to DB: error:', err))
  }

  resetTimers () {
    clearInterval(this.interval)
    clearTimeout(this.resetBoardTimeout)
  }

}
