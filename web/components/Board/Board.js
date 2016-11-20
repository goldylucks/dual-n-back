import React, { Component, PropTypes } from 'react'
import Square from '../Square'

import styles from './Board.css'

export default class Board extends Component {

  static propTypes = {
    nBack: PropTypes.number.isRequired,
    activeSquareColor: PropTypes.string,
    activeSquareIdx: PropTypes.number,
    status: PropTypes.string.isRequired,
    lastTurn: PropTypes.shape({
      activeSquareColor: PropTypes.string,
      activeSquareIdx: PropTypes.number,
    }),
    nBackTurn: PropTypes.shape({
      activeSquareColor: PropTypes.string,
      activeSquareIdx: PropTypes.number,
    }),
  }

  render () {
    const { activeSquareIdx, activeSquareColor } = this.props
    return (
      <div className={ styles.container }>
        <div className={ styles.row }>
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
        </div>
        <div className={ styles.row }>
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
        </div>
        <div className={ styles.row }>
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
        </div>
      </div>
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
        <div style={ { color: lastTurn.activeSquareColor } }>
          Last turn
        </div>
      )
    }
    if (nBackTurn.activeSquareIdx === idx) {
      nBackTurnText = (
        <div style={ { color: nBackTurn.activeSquareColor } }>
          { nBack } { nBack === 1 ? 'turn ' : 'turns' } ago
        </div>
      )
    }
    return (
      <div className={ styles.onLose }>
        { lastTurnText }
        { nBackTurnText }
      </div>
    )
  }

}
