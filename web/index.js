import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'

import middlewares from '../shared/middlewares'
import Routes from './routes'

import configureStore from '../shared/store'

const store = configureStore(middlewares())

ReactDOM.render(
  <Provider store={ store }>
    <Routes store={ store } />
  </Provider>,
  document.getElementById('root')
)
