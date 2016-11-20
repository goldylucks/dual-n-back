import _ from 'lodash'

export default class GameConfMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'toggle mode') {
        this.validateAtLeastOneModeLeft(store.getState().play, action.payload)
      }
      next(action)
    }
  }

  validateAtLeastOneModeLeft ({ mode }, modeToToggle) {
    const newMode = Object.assign({}, mode)
    newMode[modeToToggle] = !newMode[modeToToggle]
    // don't toggle this mode if all others are off
    if (_.some(Object.values(newMode))) {
      return
    }
    global.alert('At least one mode is required to play \n wont b much of a game otherwise, would it? :)')
  }
}
