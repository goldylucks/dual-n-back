import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FaIcon from 'react-native-vector-icons/FontAwesome'

import * as utils from '../../../shared/utils'
import * as actions from '../../../shared/actions/play'

class HomePage extends Component {

  static propTypes = {
    modes: PropTypes.object.isRequired,
    nBack: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    bestScores: PropTypes.object.isRequired,
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
    const { modes, nBack, speed, bestScores } = this.props
    return (
      <View style={ styles.container }>
        <Text style={ styles.headline }>MEMORY N-BACK</Text>
        <View style={ Object.assign({}, styles.settings, styles.modes) }>
          <FaIcon onPress={ () => this.toggleMode('position') } style={ Object.assign({}, styles.modesIcon, modes.position ? styles.modesIconActive : {}) } name='th' />
          { /* <FaIcon onPress={ () => this.toggleMode('audio') } style={ Object.assign({}, styles.modesIcon, modes.audio ? styles.modesIconActive : {}) } name='headphones' /> */ }
          <FaIcon onPress={ () => this.toggleMode('color') } style={ Object.assign({}, styles.modesIcon, modes.color ? styles.modesIconActive : {}) } name='paint-brush' />
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
          BEST SCORE: { utils.getBestScore(modes, nBack, bestScores) }
        </Text>
      </View>
    )
  }

  routeToGame = evt => {
    this.props.routeToGame()
  }

  toggleMode = mode => {
    this.props.actions.toggleMode(mode)
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

  modes: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  modesIcon: {
    fontSize: 40,
    color: '#fff',
    opacity: 0.5,
  },

  modesIconActive: {
    opacity: 1,
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
