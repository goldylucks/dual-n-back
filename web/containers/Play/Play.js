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
    gameOver: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    bestScore: PropTypes.object.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({
      activeSquareColor: PropTypes.string.isRequired,
      activeSquareIdx: PropTypes.number.isRequired,
    })).isRequired,
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      pauseGame: PropTypes.func.isRequired,
      resumeGame: PropTypes.func.isRequired,
      routeToHome: PropTypes.func.isRequired,
      guessColor: PropTypes.func.isRequired,
      guessPosition: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    const { history, nBack, gameOver, activeSquareColor, activeSquareIdx } = this.props
    return (
      <div className={ styles.container }>
        { this.renderHeader() }
        <Board
          gameOver={ gameOver }
          lastTurn={ history[history.length - 1] }
          nBackTurn={ history[history.length - 1 - nBack] }
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
        />
        { this.renderControls() }
        { this.renderGameOverControls() }
        { this.renderGameOverStats() }
      </div>
    )
  }

  renderHeader () {
    const { gameOver, started, score } = this.props
    if (!started) {
      return (
        <div onClick={ this.startGame } className={ styles.header }>Start</div>
      )
    }
    if (gameOver) {
      return (
        <div className={ styles.header }>
          <i className='fa fa-frown-o' />
        </div>
      )
    }
    return (
      <div className={ styles.header }>
        <span className={ styles.headerText }>{ score }</span>
        { this.renderPauseResume() }
      </div>
    )
  }

  renderPauseResume () {
    if (this.props.status === 'paused') {
      return (
        <i onClick={ this.onResume } className={ [styles.headerPauseResumeIcon, 'fa fa-play'].join(' ') } />
      )
    }

    return (
      <i onClick={ this.onPause } className={ [styles.headerPauseResumeIcon, 'fa fa-pause'].join(' ') } />
    )
  }

  renderControls () {
    if (this.props.gameOver) {
      return
    }
    const isDualMode = this.props.mode === 'dual'
    return (
      <div className={ styles.controls }>
        <div className={ [styles.control, styles.firstControl].join(' ') } onClick={ this.guessPosition }>
          <i className={ ['fa fa-th', styles.controlIcon].join(' ') } />
        </div>
        {
          renderIf(isDualMode)(
            <div className={ styles.control } onClick={ this.guessColor }>
              <i className={ ['fa fa-paint-brush', styles.controlIcon].join(' ') } />
            </div>
          )
        }
      </div>
    )
  }

  renderGameOverControls () {
    if (!this.props.gameOver) {
      return
    }
    return (
      <div className={ styles.gameOverControls }>
        <Link to='/home' className={ styles.gameOverControl } onClick={ this.onMenuPress }>MENU</Link>
        <div className={ styles.gameOverControl } onClick={ this.startGame }>RETRY</div>
      </div>
    )
  }

  renderGameOverStats () {
    const { mode, gameOver, score, nBack } = this.props
    if (!gameOver) {
      return
    }
    return (
      <div>
        <div className={ styles.gameOverMode }>{ capitalize(mode) } { nBack }-Back </div>
        Score / Best Score: <span className={ styles.strong }>{ score }/{ this.getBestScore() }</span>
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

  onPause = () => {
    this.props.actions.pauseGame()
  }

  onResume = () => {
    this.props.actions.resumeGame()
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
