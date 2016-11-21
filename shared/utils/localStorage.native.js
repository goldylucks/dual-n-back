import logger from './logger'

export async function sync (dispatch, action, key) {
  try {
    const value = await this.AsyncStorage.getItem(key)
    // initialize empty object on first run
    if (!value) {
      await this.AsyncStorage.setItem(key, JSON.stringify({}))
      return
    }
    dispatch(action(JSON.parse(value)))
  } catch (err) {
    logger.error(`localStorage helper: error syncing ${key}!`, err)
  }
}
