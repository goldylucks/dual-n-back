import * as utils from '../utils'
import { syncBestScore } from '../actions/play'
import { syncUser } from '../actions/auth'

export default class StorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'init app') {
        this.syncUser(store.dispatch)
        this.syncBestScore(store.dispatch)
        next(action)
        return
      }

      if (action.type === 'guess colorWrong' || action.type === 'guess positionWrong' || action.type === 'guess audioWrong') {
        this.onEndGame(store.getState().play)
        next(action)
        return
      }

      if (action.type === 'facebook authSuccess') {
        this.onAuthSuccess(action.payload)
        next(action)
        return
      }

      next(action)
    }
  }

  syncUser (dispatch) {
    const user = localStorage.getItem('user')
    // initialize empty object on first run
    if (!user) {
      localStorage.setItem('user', '{}')
      return
    }
    dispatch(syncUser(JSON.parse(user)))
  }

  syncBestScore (dispatch) {
    const bestScores = localStorage.getItem('bestScores')
    // initialize empty object on first run
    if (!bestScores) {
      localStorage.setItem('bestScores', '{}')
      return
    }
    dispatch(syncBestScore(JSON.parse(bestScores)))
  }

  onEndGame ({ bestScores, modes, nBack, score }) {
    if (utils.getBestScore(modes, nBack, bestScores) >= score) {
      return
    }
    bestScores = utils.updateBestScores(modes, nBack, bestScores, score)
    localStorage.setItem('bestScores', JSON.stringify(bestScores))
  }

  onAuthSuccess (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

}
