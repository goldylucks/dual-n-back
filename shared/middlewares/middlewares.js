import Play from './play'
import AuthHeaders from './authHeaders'
import createLogger from 'redux-logger'
import Storage from './storage'
import Auth from './auth'
import GameConf from './gameConf'
import { isMatch, missedAMatch } from '../utils'

export default function middlewares () {
  const logger = createLogger({
    collapsed: true,
    predicate: () => __DEV__,
  })
  const play = new Play({ isMatch, missedAMatch })
  const authHeaders = new AuthHeaders()
  const storage = new Storage()
  const auth = new Auth()
  const gameConf = new GameConf()

  return [
    logger,
    authHeaders.toMiddleware(),
    play.toMiddleware(),
    storage.toMiddleware(),
    auth.toMiddleware(),
    gameConf.toMiddleware(),
  ]
}
