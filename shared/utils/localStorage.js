import logger from './logger'

export function sync (dispatch, action, key) {
  const value = localStorage.getItem(key)
  // initialize empty object on first run
  if (!value) {
    localStorage.setItem(key, '{}')
    return
  }
  try {
    dispatch(action(JSON.parse(value)))
  } catch (err) {
    logger.error(`localStorage helper: error syncing ${key}!`, err)
  }
}
