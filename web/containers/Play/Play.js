import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'
import Sound from 'react-sound'
import _ from 'lodash'
import mPath from '../../../shared/assets/M.wav'
import qPath from '../../../shared/assets/Q.wav'
import rPath from '../../../shared/assets/R.wav'
import * as utils from '../../../shared/utils'
import * as actions from '../../../shared/actions/play'
import Board from '../../components/Board'

import styles from './Play.css'

class PlayContainer extends Component {

  static propTypes = {
    nBack: PropTypes.number.isRequired,
    mode: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    bestScore: PropTypes.object.isRequired,
    activeAudioLetter: PropTypes.string,
    activeSquareColor: PropTypes.string,
    activeSquareIdx: PropTypes.number,
    score: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({
      activeSquareColor: PropTypes.string,
      activeAudioLetter: PropTypes.string,
      activeSquareIdx: PropTypes.number,
    })).isRequired,
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      pauseGame: PropTypes.func.isRequired,
      resumeGame: PropTypes.func.isRequired,
      guessColor: PropTypes.func.isRequired,
      guessPosition: PropTypes.func.isRequired,
      guessAudio: PropTypes.func.isRequired,
    }).isRequired,
  }

  componentDidMount () {
    document.addEventListener('keypress', this.onKeyPress)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.mode.audio) {
      return
    }
    if (nextProps.history.length === this.props.history.length) {
      return
    }
    this.audioPlayed = false
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.props.mode.audio) {
      return
    }
    if (prevProps.history.length === this.props.history.length) {
      return
    }
    this.audioPlayed = true
  }

  componentWillUnmount () {
    document.removeEventListener('keypress', this.onKeyPress)
  }

  render () {
    return (
      <div className={ styles.container }>
        { this.renderHeader() }
        { this.renderGameOverAudio() }
        { this.renderBoard() }
        { this.renderControls() }
        { this.renderGameOverControls() }
        { this.renderGameOverStats() }
        { this.renderSound() }
      </div>
    )
  }

  renderHeader () {
    const { status, score } = this.props
    if (status === 'idle') {
      return (
        <a onClick={ this.startGame } className={ styles.header }>Start</a>
      )
    }
    if (status === 'gameOver') {
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

  renderGameOverAudio () {
    const { mode, status, nBack, history } = this.props
    if (!mode.audio || status !== 'gameOver') {
      return
    }
    return (
      <div className={ styles.gameOverAudio }>
        <span>{ nBack } ago</span>
        <i className='fa fa-long-arrow-right' />
        <span>{ _.last(history).activeAudioLetter }/{ _.nth(history, -nBack - 1).activeAudioLetter }</span>
        <i className='fa fa-long-arrow-left' />
        <span>last</span>
      </div>
    )
  }

  renderBoard () {
    const { mode, history, nBack, status, activeSquareColor, activeSquareIdx } = this.props
    if (!mode.color && !mode.position) {
      return
    }
    return (
      <Board
        nBack={ nBack }
        status={ status }
        lastTurn={ history[history.length - 1] }
        nBackTurn={ history[history.length - 1 - nBack] }
        activeSquareColor={ activeSquareColor }
        activeSquareIdx={ activeSquareIdx }
      />
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
    if (this.props.status === 'gameOver') {
      return
    }
    const { color, position, audio } = this.props.mode
    return (
      <div className={ styles.controls }>
        {
          utils.renderIf(position)(
            <div className={ styles.control } onClick={ this.guessPosition }>
              <i className={ ['fa fa-th', styles.controlIcon].join(' ') } />
            </div>
          )
        }
        {
          utils.renderIf(color)(
            <div className={ styles.control } onClick={ this.guessColor }>
              <i className={ ['fa fa-paint-brush', styles.controlIcon].join(' ') } />
            </div>
          )
        }
        {
          utils.renderIf(audio)(
            <div className={ styles.control } onClick={ this.guessAudio }>
              <i className={ ['fa fa-headphones', styles.controlIcon].join(' ') } />
            </div>
          )
        }
      </div>
    )
  }

  renderGameOverControls () {
    if (this.props.status !== 'gameOver') {
      return
    }
    return (
      <div className={ styles.gameOverControls }>
        <Link to='/home' className={ styles.gameOverControl }>MENU</Link>
        <div className={ styles.gameOverControl } onClick={ this.startGame }>RETRY</div>
      </div>
    )
  }

  renderGameOverStats () {
    const { status, score, nBack } = this.props
    if (status !== 'gameOver') {
      return
    }
    return (
      <div>
        <div className={ styles.gameOverMode }>{ nBack }-Back </div>
        Score / Best Score: <span className={ styles.strong }>{ score }/{ this.getBestScore() }</span>
      </div>
    )
  }

  renderSound () {
    const { mode, activeAudioLetter } = this.props
    if (!mode.audio || this.audioPlayed) {
      return
    }
    return (
      <div>
        <Sound
          url={ mPath }
          playStatus={ activeAudioLetter === 'M' ? Sound.status.PLAYING : 'STOPPED' }
        />
        <Sound
          url={ qPath }
          playStatus={ activeAudioLetter === 'Q' ? Sound.status.PLAYING : 'STOPPED' }
        />
        <Sound
          url={ rPath }
          playStatus={ activeAudioLetter === 'R' ? Sound.status.PLAYING : 'STOPPED' }
        />
      </div>
    )
  }

  startGame = () => {
    this.props.actions.startGame()
  }

  guessPosition = () => {
    if (this.isGuessDisabled()) {
      return
    }
    this.props.actions.guessPosition()
  }

  guessColor = () => {
    if (this.isGuessDisabled()) {
      return
    }
    this.props.actions.guessColor()
  }

  guessAudio = () => {
    if (this.isGuessDisabled()) {
      return
    }
    this.props.actions.guessAudio()
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

  onKeyPress = ({ keyCode }) => {
    const { mode, status } = this.props
    if (keyCode === 112 && mode.position) { // p
      this.guessPosition()
      return
    }
    if (keyCode === 99 && mode.color) { // c
      this.guessColor()
      return
    }
    if (keyCode === 97 && mode.audio) { // a
      this.guessAudio()
      return
    }
    if (keyCode === 114 && status === 'gameOver') { // r
      this.startGame()
      return
    }
    if (keyCode === 109 && status === 'gameOver') { // m
      hashHistory.push('/home')
      return
    }
    if (keyCode === 115 && status === 'idle') { // s
      this.startGame()
      return
    }
  }

  isGuessDisabled () {
    const { history, nBack, status } = this.props
    return history.length - 1 < nBack || status !== 'active'
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayContainer)
