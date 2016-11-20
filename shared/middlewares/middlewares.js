import Play from './play'
import createLogger from 'redux-logger'
import Storage from './storage'
import Auth from './auth'
import { isColorMatch, isPositionMatch, isAudioMatch, missedAMatch } from '../utils'

export default function middlewares () {
  const logger = createLogger({
    collapsed: true,
    predicate: () => __DEV__,
  })
  const play = new Play({ isColorMatch, isPositionMatch, isAudioMatch, missedAMatch })
  const storage = new Storage()
  const auth = new Auth()

  return [
    logger,
    play.toMiddleware(),
    storage.toMiddleware(),
    auth.toMiddleware(),
  ]
}
