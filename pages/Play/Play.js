import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import FdIcon from 'react-native-vector-icons/Foundation';

import { startGame, pauseGame, resumeGame, endGame, guessPosition, guessColor } from '../../actions/play';

import Board from '../../components/Board';

class PlayPage extends Component {

  static propTypes = {
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    startGame: PropTypes.func.isRequired,
    endGame: PropTypes.func.isRequired,
    guessColor: PropTypes.func.isRequired,
    guessPosition: PropTypes.func.isRequired,
  }

  render () {
    const { activeSquareColor, activeSquareIdx } = this.props;
    return (
      <View style={ styles.container }>
        { this.renderScore() }
        <Board
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
        />
        { this.renderControls() }
        { this.renderActions() }
      </View>
    );
  }

  renderScore () {
    return (
      <Text style={ styles.score }>
        { this.props.score }
      </Text>
    );
  }

  renderControls () {
    return (
      <View style={ styles.controls }>
        <TouchableHighlight style={ styles.firstControl } onPress={ this.guessPosition }>
          <FaIcon style={ styles.controlIcon } name='th' />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.control } onPress={ this.guessColor }>
          <FdIcon style={ styles.controlIcon } name='paint-bucket' />
        </TouchableHighlight>
      </View>
    );
  }

  renderActions () {
    const { started } = this.props;

    if (!started) {
      return (
        <TouchableHighlight onPress={ this.startGame }>
          <Text>Start</Text>
        </TouchableHighlight>
      );
    }

    if (started) {
      return (
        <TouchableHighlight onPress={ this.endGame }>
          <Text>End</Text>
        </TouchableHighlight>
      );
    }
  }

  startGame = () => {
    this.props.startGame();
  }

  endGame = () => {
    this.props.endGame();
  }

  guessPosition = () => {
    this.props.guessPosition();
  }

  guessColor = () => {
    this.props.guessColor();
  }

}

function mapStateToProps (state) {
  return state.play;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ startGame, pauseGame, resumeGame, endGame, guessPosition, guessColor }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayPage);

const styles = {
  container: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 5,
    borderStyle: 'solid',
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  score: {
    flex: .2,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
  },

  controls: {
    flex: .2,
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

};
