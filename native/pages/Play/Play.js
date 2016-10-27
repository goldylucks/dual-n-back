import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'
import FdIcon from 'react-native-vector-icons/Foundation'

import { capitalize, renderIf } from '../../../shared/utils'
import { startGame, guessPosition, guessColor, routeToHome } from '../../../shared/actions/play'

import Board from '../../components/Board'

class PlayPage extends Component {

  static propTypes = {
    gameOver: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    bestScore: PropTypes.object.isRequired,
    started: PropTypes.bool.isRequired,
    routeToHome: PropTypes.func.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({
      activeSquareColor: PropTypes.string.isRequired,
      activeSquareIdx: PropTypes.number.isRequired,
    })).isRequired,
    actions: PropTypes.shape({
      routeToHome: PropTypes.func.isRequired,
      startGame: PropTypes.func.isRequired,
      guessColor: PropTypes.func.isRequired,
      guessPosition: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    const { activeSquareColor, activeSquareIdx, gameOver, history, nBack } = this.props
    return (
      <View style={ styles.container }>
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
      </View>
    )
  }

  renderHeader () {
    const { started, gameOver, score } = this.props
    if (!started) {
      return (
        <Text onPress={ this.startGame } style={ styles.header }>Start</Text>
      )
    }
    if (gameOver) {
      return (
        <Text style={ styles.header }>
          <FaIcon style={ styles.headerGameOverIcon } name='frown-o' />
        </Text>
      )
    }
    return (
      <Text style={ styles.header }>
        { score }
      </Text>
    )
  }

  renderControls () {
    if (this.props.gameOver) {
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
    if (!this.props.gameOver) {
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
    const { mode, gameOver, score, nBack } = this.props
    if (!gameOver) {
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
    this.props.actions.routeToHome()
    this.props.routeToHome()
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
    actions: bindActionCreators({ startGame, guessPosition, guessColor, routeToHome }, dispatch),
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
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
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
