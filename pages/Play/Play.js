import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'
import FdIcon from 'react-native-vector-icons/Foundation'

import { capitalize } from '../../utils'
import { startGame, guessPosition, guessColor, routeHome } from '../../actions/play'

import Board from '../../components/Board'

class PlayPage extends Component {

  static propTypes = {
    history: PropTypes.arrayOf(PropTypes.object).isRequired,
    gameOver: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    bestScore: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    routeToHome: PropTypes.func.isRequired,
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      guessColor: PropTypes.func.isRequired,
      guessPosition: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    const { activeSquareColor, activeSquareIdx } = this.props
    return (
      <View style={ styles.container }>
        { this.renderScore() }
        <Board
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
        />
        { this.renderControls() }
        { this.renderGameOverOverlay() }
      </View>
    )
  }

  renderScore () {
    if (!this.props.started) {
      return (
        <Text onPress={ this.startGame } style={ styles.score }>Start</Text>
      )
    }
    return (
      <Text style={ styles.score }>
        { this.props.score }
      </Text>
    )
  }

  renderControls () {
    return (
      <View style={ styles.controls }>
        <TouchableHighlight style={ styles.firstControl } onPress={ this.guessPosition } disabled={ this.isGuessDisabled() }>
          <FaIcon style={ styles.controlIcon } name='th' />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.control } onPress={ this.guessColor } disabled={ this.isGuessDisabled() }>
          <FdIcon style={ styles.controlIcon } name='paint-bucket' />
        </TouchableHighlight>
      </View>
    )
  }

  renderGameOverOverlay () {
    const { mode, gameOver, bestScore, score, nBack } = this.props
    if (!gameOver) {
      return
    }
    return (
      <View style={ styles.gameOverOverlay }>
        <Text style={ styles.gameOverHeadline }>GAME OVER</Text>
        <Text style={ styles.gameOverText }>
          <Text style={ styles.strong }>{ capitalize(mode) } { nBack }-Back </Text>
          { '\n' }
          Score: { score }
          { '\n' }
          Best Score: { bestScore }
        </Text>
        <View style={ styles.gameOverControls }>
          <Text style={ styles.gameOverControl } onPress={ this.onMenuPress }>MENU</Text>
          <Text style={ styles.gameOverControl } onPress={ this.startGame }>RETRY</Text>
        </View>
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
    this.props.actions.routeHome()
    this.props.routeToHome()
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ startGame, guessPosition, guessColor, routeHome }, dispatch),
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

  score: {
    flex: 0.2,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
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

  gameOverOverlay: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(120, 120, 120, .9)',
  },

  gameOverHeadline: {
    color: 'red',
    fontSize: 45,
  },

  gameOverText: {
    color: 'white',
    fontSize: 30,
  },

  gameOverControls: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },

  gameOverControl: {
    width: 150,
    marginRight: 5,
    marginTop: 5,
    height: 60,
    fontSize: 25,
    textAlign: 'center',
    padding: 10,
    textAlignVertical: 'center',
    backgroundColor: 'gray',
    color: 'black',
  },

  strong: {
    fontWeight: 'bold',
  },

}
