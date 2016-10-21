import React, { Component, PropTypes } from 'react'
import Square from '../Square'

import styles from './Board.css'

export default class Board extends Component {

  static propTypes = {
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
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
        </div>
        <div className={ styles.row }>
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
        </div>
        <div className={ styles.row }>
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
        </div>
      </div>
    )
  }

}
