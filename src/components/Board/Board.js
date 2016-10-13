import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import Square from '../Square'

export default class Board extends Component {

  static propTypes = {
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
  }

  render () {
    const { activeSquareIdx, activeSquareColor } = this.props
    return (
      <View style={ styles.container }>
        <View style={ styles.row }>
          <Square
            idx={ 1 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 2 }
            style={ { marginRight: 3 } }
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
            idx={ 4 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 5 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 6 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 7 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 8 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
          <Square
            idx={ 9 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          />
        </View>
      </View>
    )
  }

}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'center',
  },

}
