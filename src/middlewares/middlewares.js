import Play from './play';
import Logger from './logger';

export default function middlewares () {
  const logger = new Logger();
  const play = new Play();

  return [
    logger.toMiddleware(),
    play.toMiddleware()
  ];
}
