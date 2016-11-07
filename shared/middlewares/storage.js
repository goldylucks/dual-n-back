import { syncBestScore } from '../actions/play'

export default class StorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'init app') {
        this.onInitApp(store.dispatch)
      }

      if (action.type === 'guess colorWrong' || action.type === 'guess positionWrong') {
        this.onEndGame(store.getState().play)
      }

      next(action)
    }
  }

  onInitApp (dispatch) {
    const bestScore = global.localStorage.getItem('bestScore')
    // initialize empty object on first run
    if (!bestScore) {
      global.localStorage.setItem('bestScore', '{}')
      return
    }
    dispatch(syncBestScore(JSON.parse(bestScore)))
  }

  onEndGame ({ bestScore, mode, nBack, score }) {
    if (bestScore[mode + nBack] >= score) {
      return
    }
    bestScore[mode + nBack] = score
    global.localStorage.setItem('bestScore', JSON.stringify(bestScore))
  }

}
