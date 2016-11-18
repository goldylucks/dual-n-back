import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'

import './reset.css'
import 'font-awesome-webpack'

import middlewares from '../shared/middlewares'
import Routes from './routes'

import configureStore from '../shared/store'

import { initApp } from '../shared/actions/play'

const store = configureStore(middlewares())

ReactDOM.render(
  <Provider store={ store }>
    <Routes store={ store } />
  </Provider>,
  document.getElementById('root')
)

store.dispatch(initApp())
if (__DEV__) {
  require('../shared/utils/dev')(store)
}
