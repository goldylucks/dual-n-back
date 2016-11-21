import { AsyncStorage } from 'react-native'

import * as utils from '../utils'
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
      const bestScores = await this.AsyncStorage.getItem('bestScores')
      // initialize empty object on first run
      if (!bestScores) {
        await this.AsyncStorage.setItem('bestScores', JSON.stringify({}))
        return
      }
      dispatch(syncBestScore(JSON.parse(bestScores)))
    } catch (err) {
      logger.warn('[StorageMiddleware] Error fetching bestScores:', err)
    }
  }

  async onEndGame ({ bestScores, modes, nBack, score }) {
    if (utils.getBestScore(modes, nBack, bestScores) >= score) {
      return
    }
    try {
      await this.AsyncStorage.mergeItem('bestScores', JSON.stringify({ [utils.getBestScoreKey]: score }))
    } catch (err) {
      logger.warn('[StorageMIddleware] Error saving bestScores:', err)
    }
  }

}
