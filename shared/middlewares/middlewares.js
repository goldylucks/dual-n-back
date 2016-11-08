import Play from './play'
import Logger from './logger'
import Storage from './storage'
import { isColorMatch, isPositionMatch, missedAMatch } from '../utils'

export default function middlewares () {
  const logger = new Logger()
  const play = new Play({ isColorMatch, isPositionMatch, missedAMatch })
  const storage = new Storage()

  return [
    logger.toMiddleware(),
    play.toMiddleware(),
    storage.toMiddleware(),
  ]
}
