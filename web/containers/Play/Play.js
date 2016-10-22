import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import { capitalize, renderIf } from '../../../shared/utils'

import { startGame, pauseGame, resumeGame, guessPosition, guessColor, routeToHome } from '../../../shared/actions/play'

import Board from '../../components/Board'

import styles from './Play.css'

class PlayContainer extends Component {

  static propTypes = {
    intervalMillis: PropTypes.number.isRequired,
    gameOver: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    bestScore: PropTypes.object.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      routeToHome: PropTypes.func.isRequired,
      guessColor: PropTypes.func.isRequired,
      guessPosition: PropTypes.func.isRequired,
    }).isRequired,
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
        { this.renderGameOverOverlay() }
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
    const isDualMode = this.props.mode === 'dual'
    return (
      <div>
        <button className={ styles.control } onClick={ this.guessPosition }>Position</button>
        {
          renderIf(isDualMode)(
            <button className={ styles.control } onClick={ this.guessColor }>Color</button>
          )
        }
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

  renderGameOverOverlay () {
    const { mode, gameOver, score, nBack } = this.props
    if (!gameOver) {
      return
    }
    return (
      <div className={ styles.gameOverOverlay }>
        <div className={ styles.gameOverHeadline }>GAME OVER</div>
        <div className={ styles.gameOverText }>
          <div className={ styles.strong }>{ capitalize(mode) } { nBack }-Back </div>
          <br />
          Score: { score }
          <br />
          Best Score: { this.getBestScore() }
        </div>
        <div className={ styles.gameOverControls }>
          <Link to='/home' className={ styles.gameOverControl } onClick={ this.onMenuPress }>MENU</Link>
          <div className={ styles.gameOverControl } onClick={ this.startGame }>RETRY</div>
        </div>
      </div>
    )
  }

  startGame = () => {
    this.props.actions.startGame()
  }

  onMenuPress = () => {
    this.props.actions.routeToHome()
  }

  guessPosition = () => {
    this.props.actions.guessPosition()
  }

  guessColor = () => {
    this.props.actions.guessColor()
  }

  getBestScore () {
    const { mode, bestScore, nBack } = this.props
    return bestScore[mode + nBack] || 0
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ startGame, pauseGame, resumeGame, routeToHome, guessPosition, guessColor }, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayContainer)
