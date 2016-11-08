import { AsyncStorage } from 'react-native'
import logger from '../utils/logger'

import { syncBestScore } from '../actions/play'

export default class StorageMiddleware {

  constructor (storage = AsyncStorage) {
    this.AsyncStorage = storage
  }

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

  async onInitApp (dispatch) {
    try {
      const bestScore = await this.AsyncStorage.getItem('bestScore')
      // initialize empty object on first run
      if (!bestScore) {
        await this.AsyncStorage.setItem('bestScore', JSON.stringify({}))
        return
      }
      dispatch(syncBestScore(JSON.parse(bestScore)))
    } catch (err) {
      logger.warn('[StorageMiddleware] Error fetching bestScore:', err)
    }
  }

  async onEndGame ({ bestScore, mode, nBack, score }) {
    if (bestScore[mode + nBack] >= score) {
      return
    }
    try {
      await this.AsyncStorage.mergeItem('bestScore', JSON.stringify({ [mode + nBack]: score }))
    } catch (err) {
      logger.warn('[StorageMIddleware] Error saving bestScore:', err)
    }
  }

}
