import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { toggleMode, incrementN, decrementN } from '../../../shared/actions/play'

class HomePage extends Component {

  static propTypes = {
    mode: PropTypes.string.isRequired,
    nBack: PropTypes.number.isRequired,
    bestScore: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      toggleMode: PropTypes.func.isRequired,
      incrementN: PropTypes.func.isRequired,
      decrementN: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    const { mode, nBack } = this.props
    return (
      <div style={ styles.container }>
        <span style={ styles.headline }>MEMORY N-BACK</span>
        <div style={ styles.settings }>
          <div style={ styles.leftSetting }>
            <span onClick={ this.toggleMode } name='caret-left' style={ styles.leftSettingIcon } />
          </div>
          <div style={ styles.middleSetting }>
            <span style={ styles.middleSettingText }>{ mode }</span>
          </div>
          <div style={ styles.rightSetting }>
            <span onClick={ this.toggleMode } name='caret-right' style={ styles.rightSettingIcon } />
          </div>
        </div>
        <div style={ styles.settings }>
          <div style={ styles.leftSetting }>
            <span onClick={ this.decrementN } name='minus' style={ styles.leftSettingIcon } />
          </div>
          <div style={ styles.middleSetting }>
            <span style={ styles.middleSettingText }>{ nBack }</span>
          </div>
          <div style={ styles.rightSetting }>
            <span onClick={ this.incrementN } name='plus' style={ styles.rightSettingIcon } />
          </div>
        </div>
        <div style={ styles.play }>
          <Link to={ '/play' }>
            <span name='play-circle' style={ styles.playIcon } />
          </Link>
        </div>
        <span style={ styles.record }>
          BEST SCORE: { this.getBestScore() }
        </span>
      </div>
    )
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
    actions: bindActionCreators({ toggleMode, incrementN, decrementN }, dispatch),
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
    borderLeftColor: 'white',
    borderLeftWidth: 1,
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
