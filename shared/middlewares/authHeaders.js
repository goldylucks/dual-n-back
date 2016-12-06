import axios from 'axios'

export default class AuthHeadersMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type.match(/facebook authSuccess|signup success|login success|init app/)) {
        next(action) // let reducer update state first
        this.setAuthHeader(store)
        return
      }

      next(action)
    }
  }

  setAuthHeader (store) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getState().auth.user.token
  }

}
