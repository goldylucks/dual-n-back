import { syncBestScore } from '../actions/play'

export default class StorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'init app') {
        this.onInitApp(store)
      }

      if (action.type === 'guess colorWrong' || action.type === 'guess positionWrong') {
        this.onEndGame(store)
      }

      next(action)
    }
  }

  onInitApp (store) {
    const bestScore = global.localStorage.getItem('bestScore')
    // initialize empty object on first run
    if (!bestScore) {
      global.localStorage.setItem('bestScore', JSON.stringify({}))
      return
    }
    store.dispatch(syncBestScore(JSON.parse(bestScore)))
  }

  onEndGame (store) {
    const { bestScore, mode, nBack, score } = store.getState().play
    if (bestScore[mode + nBack] >= score) {
      return
    }
    bestScore[mode + nBack] = score
    global.localStorage.setItem('bestScore', JSON.stringify(bestScore))
  }

}
