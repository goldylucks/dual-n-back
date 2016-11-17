import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'
import FdIcon from 'react-native-vector-icons/Foundation'

import { capitalize, renderIf } from '../../../shared/utils'
import * as actions from '../../../shared/actions/play'

import Board from '../../components/Board'

class PlayPage extends Component {

  static propTypes = {
    nBack: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    bestScore: PropTypes.object.isRequired,
    routeToHome: PropTypes.func.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({
      activeSquareColor: PropTypes.string.isRequired,
      activeSquareIdx: PropTypes.number.isRequired,
    })).isRequired,
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      pauseGame: PropTypes.func.isRequired,
      resumeGame: PropTypes.func.isRequired,
      guessColor: PropTypes.func.isRequired,
      guessPosition: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    const { activeSquareColor, activeSquareIdx, status, history, nBack } = this.props
    return (
      <View style={ styles.container }>
        { this.renderHeader() }
        <Board
          status={ status }
          lastTurn={ history[history.length - 1] }
          nBackTurn={ history[history.length - 1 - nBack] }
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
        />
        { this.renderControls() }
        { this.renderGameOverControls() }
        { this.renderGameOverStats() }
      </View>
    )
  }

  renderHeader () {
    const { status, score } = this.props
    if (status === 'idle') {
      return (
        <View style={ styles.header }>
          <Text onPress={ this.startGame } style={ styles.headerText }>Start</Text>
        </View>
      )
    }
    if (status === 'active') {
      return (
        <View style={ styles.header }>
          <FaIcon style={ styles.headerGameOverIcon } name='frown-o' />
        </View>
      )
    }
    return (
      <View style={ styles.header }>
        <Text style={ styles.headerText }>{ score }</Text>
        { this.renderPauseResume() }
      </View>
    )
  }

  renderPauseResume () {
    if (this.props.status === 'paused') {
      return (
        <FaIcon onPress={ this.onResume } style={ styles.headerPauseResumeIcon } name='play' />
      )
    }

    return (
      <FaIcon onPress={ this.onPause } style={ styles.headerPauseResumeIcon } name='pause' />
    )
  }

  renderControls () {
    if (this.props.status === 'gameOver') {
      return
    }
    const isDualMode = this.props.mode === 'dual'
    return (
      <View style={ styles.controls }>
        <TouchableHighlight style={ styles.firstControl } onPress={ this.guessPosition } disabled={ this.isGuessDisabled() }>
          <FaIcon style={ styles.controlIcon } name='th' />
        </TouchableHighlight>
        {
          renderIf(isDualMode)(
            <TouchableHighlight style={ [styles.control] } onPress={ this.guessColor } disabled={ this.isGuessDisabled() }>
              <FdIcon style={ styles.controlIcon } name='paint-bucket' />
            </TouchableHighlight>
          )
        }
      </View>
    )
  }

  renderGameOverControls () {
    if (this.props.status !== 'gameOver') {
      return
    }
    return (
      <View style={ styles.gameOverControls }>
        <Text style={ styles.gameOverControl } onPress={ this.onMenuPress }>MENU</Text>
        <Text style={ styles.gameOverControl } onPress={ this.startGame }>RETRY</Text>
      </View>
    )
  }

  renderGameOverStats () {
    const { mode, status, score, nBack } = this.props
    if (status !== 'gameOver') {
      return
    }
    return (
      <View style={ styles.gameOverStats }>
        <Text style={ styles.gameOverScores }>
          Score / Best Score: <Text style={ styles.strong }>{ score }/{ this.getBestScore() }</Text>
        </Text>
        <Text>{ capitalize(mode) } { nBack }-Back </Text>
      </View>
    )
  }

  startGame = () => {
    this.props.actions.startGame()
  }

  guessPosition = () => {
    this.props.actions.guessPosition()
  }

  guessColor = () => {
    this.props.actions.guessColor()
  }

  isGuessDisabled () {
    const { history, nBack } = this.props
    return history.length - 1 < nBack
  }

  onMenuPress = () => {
    this.props.routeToHome()
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
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayPage)

const styles = {
  container: {
    flex: 1,
  },

  header: {
    flex: 0.2,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  headerText: {
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  headerPauseResumeIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
    fontSize: 40,
    color: '#fff',
  },

  headerGameOverIcon: {
    fontSize: 50,
  },

  controls: {
    flex: 0.2,
    flexDirection: 'row',
  },

  firstControl: {
    flex: 1,
    alignItems: 'center',
    marginRight: 2,
    justifyContent: 'center',
    backgroundColor: 'green',
  },

  control: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },

  controlIcon: {
    fontSize: 45,
    color: 'white',
  },

  gameOverControls: {
    flexDirection: 'row',
  },

  gameOverControl: {
    marginTop: 5,
    flex: 1,
    height: 60,
    fontSize: 25,
    textAlign: 'center',
    padding: 10,
    textAlignVertical: 'center',
    backgroundColor: 'gray',
    color: 'black',
  },

  gameOverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  strong: {
    fontWeight: 'bold',
  },

}
