import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'
import FdIcon from 'react-native-vector-icons/Foundation'

import { startGame, pauseGame, resumeGame, guessPosition, guessColor } from '../../actions/play'

import Board from '../../components/Board'

class PlayPage extends Component {

  static propTypes = {
    history: PropTypes.arrayOf(PropTypes.object).isRequired,
    gameOver: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
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

  renderGameOverOverlay () {
    if (!this.props.gameOver) {
      return
    }
    return (
      <View style={ styles.gameOverOverlay }>
        <Text onPress={ this.startGame }>GAME OVER</Text>
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
        <TouchableHighlight style={ styles.firstControl } onPress={ this.guessPosition } disabled={ this.guessDisabled() }>
          <FaIcon style={ styles.controlIcon } name='th' />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.control } onPress={ this.guessColor } disabled={ this.guessDisabled() }>
          <FdIcon style={ styles.controlIcon } name='paint-bucket' />
        </TouchableHighlight>
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

  guessDisabled () {
    const { history, nBack } = this.props
    return history.length - 1 < nBack
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ startGame, pauseGame, resumeGame, guessPosition, guessColor }, dispatch),
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
    zIndex: 10,
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(120, 120, 120, .7)',
  },

}
