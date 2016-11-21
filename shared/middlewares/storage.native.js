import { AsyncStorage } from 'react-native'

import * as utils from '../utils'
import logger from '../utils/logger'
import { syncBestScores, syncGameConfig } from '../actions/play'
import { syncUser } from '../actions/auth'
import * as lsUtils from '../utils/localStorage'

export default class StorageMiddleware {

  constructor (storage = AsyncStorage) {
    this.AsyncStorage = storage
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'init app') {
        lsUtils.sync(store.dispatch, syncUser, 'user')
        lsUtils.sync(store.dispatch, syncBestScores, 'bestScores')
        lsUtils.sync(store.dispatch, syncGameConfig, 'gameConfig')
        next(action)
        return
      }

      if (action.type.match(/crement n|rement speed|toggle modes/)) {
        next(action) // let reducer update the state before saving it to LS
        this.saveGameConf(store.getState().play)
        return
      }

      if (action.type.match(/guess colorWrong|guess positionWrong|guess audioWrong/)) {
        this.saveBestScores(store.getState().play)
        next(action)
        return
      }

      if (action.type === 'facebook authSuccess') {
        this.saveUser(action.payload)
        next(action)
        return
      }

      next(action)
    }
  }

  async saveGameConf ({ modes, nBack, speed }) {
    try {
      this.AsyncStorage.setItem('gameConfig', JSON.stringify({ modes, nBack, speed }))
    } catch (err) {
      logger.error('[StorageMiddleware] Error saving gameConf:', { modes, nBack, speed }, err)
    }
  }

  async saveBestScores ({ bestScores, modes, nBack, score }) {
    if (utils.getBestScore(modes, nBack, bestScores) >= score) {
      return
    }
    try {
      await this.AsyncStorage.mergeItem('bestScores', JSON.stringify({ [utils.getBestScoreKey]: score }))
    } catch (err) {
      logger.error('[StorageMiddleware] Error saving bestScores:', err)
    }
  }

  async saveUser (user) {
    try {
      await this.AsyncStorage.setItem('user', JSON.stringify(user))
    } catch (err) {
      logger.error('[StorageMiddleware] Error saving user:', user, err)
    }
  }

}
