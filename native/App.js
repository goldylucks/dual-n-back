const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent
if (isDebuggingInChrome) {
  require('../shared/utils/dev')
}
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import Routes from './routes'

import configureStore from '../shared/store'
import middlewares from '../shared/middlewares'

import { initApp } from '../shared/actions/play'

const store = configureStore(middlewares())

export default class dualMobile extends Component {
  render () {
    return (
      <Provider store={ store }>
        <Routes />
      </Provider>
    )
  }
}

store.dispatch(initApp())

// DEBUG STUFF
// TODO [AdGo] - move to own file
if (isDebuggingInChrome) {
  require('../shared/utils/dev')(store)
}
