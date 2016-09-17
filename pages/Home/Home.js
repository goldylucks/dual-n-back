import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'

import { toggleMode, incrementN, decrementN } from '../../actions/play';

class HomePage extends Component {

  static propTypes = {
    routeToGame: PropTypes.func.isRequired,
    actions: PropTypes.shape({
      toggleMode: PropTypes.func.isRequired,
      incrementN: PropTypes.func.isRequired,
      decrementN: PropTypes.func.isRequired,
    }).isRequired,
    routeToGame: PropTypes.func.isRequired,
  }

  render() {
    const { mode, bestScore, nBack } = this.props;
    return (
      <View style={ styles.container }>
        <Text style={ styles.headline }>MEMORY N-BACK</Text>
        <View style={ styles.settings }>
          <View style={ styles.leftSetting }>
            <FaIcon onPress={ this.toggleMode } name='caret-left' style={ styles.leftSettingIcon } /> 
          </View>
          <View style={ styles.middleSetting }>
            <Text style={ styles.middleSettingText }>{ mode }</Text>
          </View>
          <View style={ styles.rightSetting }>
            <FaIcon onPress={ this.toggleMode } name='caret-right' style={ styles.rightSettingIcon } /> 
          </View>
        </View>
        <View style={ styles.settings }>
          <View style={ styles.leftSetting }>
            <FaIcon onPress={ this.decrementN } name='minus' style={ styles.leftSettingIcon } /> 
          </View>
          <View style={ styles.middleSetting }>
            <Text style={ styles.middleSettingText }>{ nBack }</Text>
          </View>
          <View style={ styles.rightSetting }>
            <FaIcon onPress={ this.incrementN } name='plus' style={ styles.rightSettingIcon } /> 
          </View>
        </View>
        <View style={ styles.play }>
          <TouchableHighlight onPress={ this.routeToGame }>
            <FaIcon name='play-circle' style={ styles.playIcon } />
          </TouchableHighlight>
        </View>
        <Text style={ styles.record }>
          BEST SCORE: { bestScore }
        </Text>
      </View>
    )
  }

  routeToGame = evt => {
    this.props.routeToGame()
  }

  toggleMode = evt => {
    this.props.actions.toggleMode();
  }

  incrementN = evt => {
    this.props.actions.incrementN();
  }

  decrementN = evt => {
    this.props.actions.decrementN();
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ toggleMode, incrementN, decrementN }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage)

const styles = {

  container: {
    flex: 1,
    backgroundColor: 'blue',
  },

  headline: {
    flex: .5,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 80,
  },

  settings: {
    flex: .15,
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white',
  },

  leftSetting: {
    flex: .2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'white',
    borderRightWidth: 1,
    borderLeftColor: 'white',
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },

  leftSettingIcon: {
    color: 'white',
    fontSize: 50,
  },

  middleSetting: {
    flex: .6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  middleSettingText: {
    fontSize: 50,
    color: 'white',
  },

  rightSetting: {
    flex: .2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'white',
    borderRightWidth: 1,
    borderLeftColor: 'white',
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },

  rightSettingIcon: {
    color: 'white',
    fontSize: 50,
  },

  play: {
    flex: .2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    borderTopColor: 'white',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },

  playIcon: {
    color: 'white',
    fontSize: 60,
  },

  record: {
    flex: .1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 25,
  },

}
