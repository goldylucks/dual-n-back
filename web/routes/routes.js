
import React, { Component, PropTypes } from 'react'

import { Router, Route, useRouterHistory, IndexRedirect } from 'react-router'
import { createHashHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'

import AppContainer from '../containers/App'
import HomeContainer from '../containers/Home'
import PlayContainer from '../containers/Play'
import AuthContainer from '../containers/Auth'

const routerHistory = useRouterHistory(createHashHistory)()

export default class Routes extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render () {
    const history = syncHistoryWithStore(routerHistory, this.props.store)
    return (
      <Router history={ history }>
        <Route path={ '/' } component={ AppContainer }>
          <IndexRedirect to='home' />
          <Route path={ 'home' } component={ HomeContainer } />
          <Route path={ 'play' } component={ PlayContainer } />
          <Route path={ 'auth' } component={ AuthContainer } />
        </Route>
      </Router>
    )
  }

}
