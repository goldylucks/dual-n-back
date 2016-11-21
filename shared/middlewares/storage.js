import { syncBestScores, syncGameConfig } from '../actions/play'
import { syncUser } from '../actions/auth'
import * as lsUtils from '../utils/localStorage'
export default class StorageMiddleware {

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
        const { modes, nBack, speed } = store.getState().play
        localStorage.setItem('gameConfig', JSON.stringify({ modes, nBack, speed }))
        return
      }

      if (action.type.match(/guess colorWrong|guess positionWrong|guess audioWrong/)) {
        next(action) // let reducer update the state before saving it to LS
        localStorage.setItem('bestScores', JSON.stringify(store.getState().play.bestScores))
        return
      }

      if (action.type === 'facebook authSuccess') {
        localStorage.setItem('user', JSON.stringify(action.payload))
        next(action)
        return
      }

      next(action)
    }
  }

}
