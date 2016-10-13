import Play from './play'
import Logger from './logger'
import Storage from './storage'

export default function middlewares () {
  const logger = new Logger()
  const play = new Play()
  const storage = new Storage()

  return [
    logger.toMiddleware(),
    play.toMiddleware(),
    storage.toMiddleware(),
  ]
}
