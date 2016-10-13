import React, { Component } from 'react'
import { Provider } from 'react-redux'

import Routes from './routes'

import configureStore from './store'
import middlewares from './middlewares'

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
