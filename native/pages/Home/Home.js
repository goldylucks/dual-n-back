import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'

import { toggleMode, incrementSpeed, decrementSpeed, incrementN, decrementN } from '../../../shared/actions/play'

class HomePage extends Component {

  static propTypes = {
    mode: PropTypes.string.isRequired,
    nBack: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    bestScore: PropTypes.object.isRequired,
    routeToGame: PropTypes.func.isRequired,
    actions: PropTypes.shape({
      toggleMode: PropTypes.func.isRequired,
      incrementN: PropTypes.func.isRequired,
      decrementN: PropTypes.func.isRequired,
      incrementSpeed: PropTypes.func.isRequired,
      decrementSpeed: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    const { mode, nBack, speed } = this.props
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
        <View style={ styles.settings }>
          <View style={ styles.leftSetting }>
            <FaIcon onPress={ this.decrementSpeed } name='minus' style={ styles.leftSettingIcon } />
          </View>
          <View style={ styles.middleSetting }>
            <Text style={ styles.middleSettingText }>{ speed }</Text>
          </View>
          <View style={ styles.rightSetting }>
            <FaIcon onPress={ this.incrementSpeed } name='plus' style={ styles.rightSettingIcon } />
          </View>
        </View>
        <View style={ styles.play }>
          <TouchableHighlight onPress={ this.routeToGame }>
            <FaIcon name='play-circle' style={ styles.playIcon } />
          </TouchableHighlight>
        </View>
        <Text style={ styles.record }>
          BEST SCORE: { this.getBestScore() }
        </Text>
      </View>
    )
  }

  routeToGame = evt => {
    this.props.routeToGame()
  }

  toggleMode = evt => {
    this.props.actions.toggleMode()
  }

  incrementN = evt => {
    this.props.actions.incrementN()
  }

  decrementN = evt => {
    this.props.actions.decrementN()
  }

  incrementSpeed = evt => {
    this.props.actions.incrementSpeed()
  }

  decrementSpeed = evt => {
    this.props.actions.decrementSpeed()
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
    actions: bindActionCreators({ toggleMode, incrementSpeed, decrementSpeed, incrementN, decrementN }, dispatch),
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
    flex: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 80,
  },

  settings: {
    flex: 0.15,
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white',
  },

  leftSetting: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'white',
    borderRightWidth: 1,
    borderStyle: 'solid',
  },

  leftSettingIcon: {
    color: 'white',
    fontSize: 50,
  },

  middleSetting: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  middleSettingText: {
    fontSize: 50,
    color: 'white',
  },

  rightSetting: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: 'white',
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },

  rightSettingIcon: {
    color: 'white',
    fontSize: 50,
  },

  play: {
    flex: 0.2,
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
    flex: 0.1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 25,
  },

}
