import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { startGame, pauseGame, resumeGame, guessPosition, guessColor } from '../../../shared/actions/play'

import Board from '../../components/Board'

import styles from './Play.css'

class PlayContainer extends Component {

  static propTypes = {
    intervalMillis: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    startGame: PropTypes.func.isRequired,
    guessColor: PropTypes.func.isRequired,
    guessPosition: PropTypes.func.isRequired,
  }

  render () {
    const { intervalMillis, colors, activeSquareColor, activeSquareIdx } = this.props
    return (
      <div className={ styles.container }>
        { this.renderScore() }
        <Board
          intervalMillis={ intervalMillis }
          colors={ colors }
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
        />
        <div className={ styles.controls }>
          { this.renderControls() }
        </div>
        { this.renderActions() }
      </div>
    )
  }

  renderScore () {
    return (
      <div className={ styles.score }>
        { this.props.score }
      </div>
    )
  }

  renderControls () {
    return (
      <div>
        <button className={ styles.control } onClick={ this.guessPosition }>Position</button>
        <button className={ styles.control } onClick={ this.guessColor }>Color</button>
      </div>
    )
  }

  renderActions () {
    const { started } = this.props

    if (started) {
      return
    }

    return (
      <div>
        <button onClick={ this.startGame }>Start</button>
      </div>
    )
  }

  startGame = () => {
    this.props.startGame()
  }

  guessPosition = () => {
    this.props.guessPosition()
  }

  guessColor = () => {
    this.props.guessColor()
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ startGame, pauseGame, resumeGame, guessPosition, guessColor }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayContainer)
