import Play from './play'
import createLogger from 'redux-logger'
import Storage from './storage'
import { isColorMatch, isPositionMatch, missedAMatch } from '../utils'

export default function middlewares () {
  const logger = createLogger({
    collapsed: true,
    predicate: () => __DEV__,
  })
  const play = new Play({ isColorMatch, isPositionMatch, missedAMatch })
  const storage = new Storage()

  return [
    logger,
    play.toMiddleware(),
    storage.toMiddleware(),
  ]
}
