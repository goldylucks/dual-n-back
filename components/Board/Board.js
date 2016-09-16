import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';
import Square from '../Square';

export default class Board extends Component {

  static propTypes = {
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired
  }

  render () {
    const { activeSquareIdx, activeSquareColor } = this.props;
    return (
      <View style={ styles.container }>
        <View style={ styles.row }>
          <Square
            idx={ 1 }
            style={ { marginRight: 2 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 2 }
            style={ { marginRight: 2 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 3 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 1 }
            style={ { marginRight: 2 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 2 }
            style={ { marginRight: 2 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 3 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 1 }
            style={ { marginRight: 2 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 2 }
            style={ { marginRight: 2 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 3 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
        </View>
      </View>
    );
  }

}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    borderColor: 'yellow',
    borderStyle: 'solid',
    borderWidth: 3,
  },

  row: {
    // flex: 1,
    // height: 100,
    flexDirection: 'row',
    marginBottom: 2,
    justifyContent: 'center',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
  }

};
