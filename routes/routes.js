import React, { Component } from 'react';
import { Navigator } from 'react-native';

import Home from '../components/Home';
import Play from '../components/Play';

export default class Routes extends Component {

  initialRoute = { title: 'home', index: 0 }

  render () {
    return (
      <Navigator
        initialRoute={ this.initialRoute }
        renderScene={ this.renderScene }
      />
    );
  }

  renderScene = (route, navigator) => {
    if (route.index === 0) {
      return (
        <Home routeToGame={ this.routeToGame.bind(this, route, navigator) } />
      );
    }

    if (route.index === 1) {
      return (
        <Play />
      );
    }

  }

  routeToGame (route, navigator) {
    navigator.push({
      title: 'Game title',
      index: 1
    })
  }

}
