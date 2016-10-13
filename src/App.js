import React, { Component } from 'react'
import { Provider } from 'react-redux'

import Routes from './routes'

import configureStore from './store'
import middlewares from './middlewares'

import { initApp } from './actions/play'

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
