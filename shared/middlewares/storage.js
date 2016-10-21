import { AsyncStorage } from 'react-native'
import logger from '../utils/logger'

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

  async onInitApp (store) {
    try {
      const bestScore = await AsyncStorage.getItem('bestScore')
      if (!bestScore) {
        // initialize empty object on first run
        await AsyncStorage.setItem('bestScore', JSON.stringify({}))
        return
      }
      store.dispatch(syncBestScore(JSON.parse(bestScore)))
    } catch (err) {
      logger.warn('[StorageMiddleware] Error fetching bestScore:', err)
    }
  }

  async onEndGame (store) {
    const { bestScore, mode, nBack, score } = store.getState().play
    if (bestScore[mode + nBack] >= score) {
      return
    }
    try {
      await AsyncStorage.mergeItem('bestScore', JSON.stringify({ [mode + nBack]: score }))
    } catch (err) {
      logger.warn('[StorageMIddleware] Error saving bestScore:', err)
    }
  }

}
