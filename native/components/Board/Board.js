import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'
import Square from '../Square'

export default class Board extends Component {

  static propTypes = {
    nBack: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    lastTurn: PropTypes.shape({
      activeSquareColor: PropTypes.string.isRequired,
      activeSquareIdx: PropTypes.number.isRequired,
    }),
    nBackTurn: PropTypes.shape({
      activeSquareColor: PropTypes.string.isRequired,
      activeSquareIdx: PropTypes.number.isRequired,
    }),
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
          >
            { this.renderOnLose(1) }
          </Square>
          <Square
            idx={ 2 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(2) }
          </Square>
          <Square
            idx={ 3 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(3) }
          </Square>
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 4 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(4) }
          </Square>
          <Square
            idx={ 5 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(5) }
          </Square>
          <Square
            idx={ 6 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(6) }
          </Square>
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 7 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(7) }
          </Square>
          <Square
            idx={ 8 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(8) }
          </Square>
          <Square
            idx={ 9 }
            activeSquareColor={ activeSquareColor }
            activeSquareIdx={ activeSquareIdx }
          >
            { this.renderOnLose(9) }
          </Square>
        </View>
      </View>
    )
  }

  renderOnLose (idx) {
    const { nBack, status, lastTurn, nBackTurn } = this.props
    if (status !== 'gameOver') {
      return
    }
    let lastTurnText
    let nBackTurnText
    if (lastTurn.activeSquareIdx === idx) {
      lastTurnText = (
        <Text style={ { color: lastTurn.activeSquareColor } }>
          Last turn
        </Text>
      )
    }
    if (nBackTurn.activeSquareIdx === idx) {
      nBackTurnText = (
        <Text style={ { color: nBackTurn.activeSquareColor } }>
          { nBack } turns back
        </Text>
      )
    }
    return (
      <Text>
        { lastTurnText }
        { lastTurnText && nBackTurnText && '\n' } { /* line break only if both texts are in same square */ }
        { nBackTurnText }
      </Text>
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
