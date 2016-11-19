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

      if (action.type === 'guess colorWrong' || action.type === 'guess positionWrong') {
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
    const bestScore = localStorage.getItem('bestScore')
    // initialize empty object on first run
    if (!bestScore) {
      localStorage.setItem('bestScore', '{}')
      return
    }
    dispatch(syncBestScore(JSON.parse(bestScore)))
  }

  onEndGame ({ bestScore, mode, nBack, score }) {
    if (bestScore[mode + nBack] >= score) {
      return
    }
    bestScore[mode + nBack] = score
    localStorage.setItem('bestScore', JSON.stringify(bestScore))
  }

  onAuthSuccess (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

}
