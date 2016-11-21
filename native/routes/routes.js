import React, { Component } from 'react'
import { Navigator } from 'react-native'

import Home from '../pages/Home'
import Play from '../pages/Play'

export default class Routes extends Component {

  render () {
    return (
      <Navigator
        initialRoute={ this.initialRoute }
        renderScene={ this.renderScene }
      />
    )
  }

  renderScene = (route, navigator) => {
    if (route.index === 0) {
      return (
        <Home routeToGame={ this.routeToGame.bind(this, route, navigator) } />
      )
    }

    if (route.index === 1) {
      return (
        <Play routeToHome={ this.routeToHome.bind(this, route, navigator) } />
      )
    }
  }

  routeToGame (route, navigator) {
    navigator.push({
      title: 'Game title',
      index: 1,
    })
  }

  routeToHome (route, navigator) {
    navigator.push({
      title: 'Home title',
      index: 0,
    })
  }

  // initialRoute = { title: 'Game title', index: 1 }
  initialRoute = { title: 'home', index: 0 }

}
