import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { startGame, pauseGame, resumeGame, endGame, guessPosition, guessColor } from '../../actions/play';

import Board from '../../components/Board';

// import styles from './Play.css';

class PlayPage extends Component {

  static propTypes = {
    intervalMillis: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired
    // startGame: PropTypes.function.isRequired,
    // endGame: PropTypes.function.isRequired,
    // guessColor: PropTypes.function.isRequired,
    // guessPosition: PropTypes.function.isRequired
  }

  render () {
    const { intervalMillis, colors, activeSquareColor, activeSquareIdx } = this.props;
    return (
      <View style={ styles.container }>
        { this.renderScore() }
        <Board
          intervalMillis={ intervalMillis }
          colors={ colors }
          activeSquareColor={ activeSquareColor }
          activeSquareIdx={ activeSquareIdx }
        />
        <View style={ styles.control }>
          { this.renderControls() }
        </View>
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
      <View>
        <TouchableHighlight style={ styles.control } onClick={ this.guessPosition }>
          <Text>Position</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.control } onClick={ this.guessColor }>
          <Text>Color</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderActions () {
    const { started } = this.props;

    if (!started) {
      return (
        <TouchableHighlight onClick={ this.startGame }>
          <Text>Start</Text>
        </TouchableHighlight>
      );
    }

    if (started) {
      return (
        <TouchableHighlight onClick={ this.endGame }>
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

  },

  control: {
  },

};
