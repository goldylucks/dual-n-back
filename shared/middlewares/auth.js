import axios from 'axios'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import { API_URL } from '../constants'
import { facebookAuthSuccess, facebookAuthError, loginSuccess, loginError, signupSuccess, signupError } from '../actions/auth'

export default class AuthMiddleware {

  constructor ({ _axios, _hashHistory } = { _axios: axios, _hashHistory: hashHistory }) {
    this._axios = _axios
    this._hashHistory = _hashHistory
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'facebook auth') {
        this.onFacebookAuth(store.dispatch, action.payload)
        next(action)
        return
      }

      if (action.type === 'signup') {
        this.onSignup(store)
        next(action)
        return
      }

      if (action.type === 'login') {
        this.onLogin(store)
        next(action)
        return
      }

      next(action)
    }
  }

  async onFacebookAuth (dispatch, fbUser) {
    const params = {
      ...fbUser,
      fbPictureUrl: fbUser.picture && fbUser.picture.data && fbUser.picture.data.url,
    }
    try {
      const { data: user } = await this._axios.get(`${API_URL}/users/fbAuth`, { params })
      dispatch(facebookAuthSuccess(user))
      global.alert('successfully logged in as ' + user.name)
      this._hashHistory.push('/home')
    } catch ({ message }) {
      dispatch(facebookAuthError(message))
    }
  }

  async onLogin ({ dispatch, getState }) {
    const params = _.pick(getState().auth, 'email', 'password')
    try {
      const { data: user } = await this._axios.post(`${API_URL}/users/login`, params)
      dispatch(loginSuccess(user))
      global.alert('successfully logged in as ' + user.name)
      this._hashHistory.push('/home')
    } catch (err) {
      let { message } = err
      if (message.match(400)) {
        message = err.response.data
      }
      dispatch(loginError(message))
    }
  }

  async onSignup ({ dispatch, getState }) {
    const params = _.pick(getState().auth, 'name', 'email', 'password')
    try {
      const { data: user } = await this._axios.post(`${API_URL}/users/`, params)
      dispatch(signupSuccess(user))
      global.alert('successfully signed up as ' + user.name)
      this._hashHistory.push('/home')
    } catch (err) {
      let { message } = err
      if (message.match(400)) {
        message = err.response.data
      }
      dispatch(signupError(message))
    }
  }

}
