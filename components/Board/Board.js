import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';
import Square from '../Square';

const styles = {
  container: {
    backgroundColor: 'green',
    flex: 1,
    borderColor: 'yellow',
    borderStyle: 'solid',
    borderWidth: 3,
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },

  square: {
    flex: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    // height: 50,
    // width: 50
  }
};

export default class Board extends Component {

  squares = [];

  static propTypes = {
    intervalMillis: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired
  }

  render () {
    return (
      <View style={ styles.container }>
        { this.renderSquares() }
      </View>
    );
  }

  renderSquares () {
    const { activeSquareIdx, activeSquareColor, intervalMillis } = this.props;
    let squares = [];
    for (let i = 1; i < 10; i++) {
      squares.push(
        <Square
          key={ i }
          idx={ i }
          style={ styles.square }
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
          intervalMillis={ intervalMillis }
          />
        );
    }
    return squares;
  }

}

