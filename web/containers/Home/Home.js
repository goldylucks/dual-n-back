import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as utils from '../../../shared/utils'
import * as actions from '../../../shared/actions/play'

import styles from './Home.css'

class HomeContainer extends Component {

  static propTypes = {
    modes: PropTypes.object.isRequired,
    nBack: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    bestScores: PropTypes.object.isRequired,
    user: PropTypes.object,
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
      <div className={ styles.container }>
        <div className={ styles.headline }>MEMORY N-BACK</div>
        <div className={ `${styles.settings} ${styles.modes}` }>
          <i onClick={ this.toggleMode.bind(this, 'position') } className={ `fa fa-th ${modes.position ? styles.active : ''}` } { ...this._test('modePosition') } />
          <i onClick={ this.toggleMode.bind(this, 'audio') } className={ `fa fa-headphones ${modes.audio ? styles.active : ''}` } { ...this._test('modeAudio') } />
          <i onClick={ this.toggleMode.bind(this, 'color') } className={ `fa fa-paint-brush ${modes.color ? styles.active : ''}` } { ...this._test('modeColor') } />
        </div>
        <div className={ styles.settings }>
          <a onClick={ this.decrementN } className={ styles.leftSetting } { ...this._test('nBackDecrement') }>
            <i className={ [styles.leftSettingIcon, 'fa fa-minus'].join(' ') } />
          </a>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText } { ...this._test('nBack') }>{ nBack }</div>
          </div>
          <a onClick={ this.incrementN } className={ styles.rightSetting } { ...this._test('nBackIncrement') }>
            <i className={ [styles.rightSettingIcon, 'fa fa-plus'].join(' ') } />
          </a>
        </div>
        <div className={ styles.settings }>
          <a onClick={ this.decrementSpeed } className={ styles.leftSetting } { ...this._test('speedDecrement') }>
            <i className={ [styles.leftSettingIcon, 'fa fa-minus'].join(' ') } />
          </a>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText } { ...this._test('speed') }>{ speed }</div>
          </div>
          <a onClick={ this.incrementSpeed } className={ styles.rightSetting } { ...this._test('speedIncrement') }>
            <i className={ [styles.rightSettingIcon, 'fa fa-plus'].join(' ') } />
          </a>
        </div>
        <div className={ styles.play }>
          { this.renderLogin() }
          <Link to={ '/play' } { ...this._test('routeToPlay') }>
            <i className={ [styles.playIcon, 'fa fa-play-circle'].join(' ') } />
          </Link>
        </div>
        <div className={ styles.record } { ...this._test('bestScore') }>
          BEST SCORE: { utils.getBestScore(modes, nBack, bestScores) }
        </div>
      </div>
    )
  }

  renderLogin () {
    if (this.props.user.name) {
      return
    }
    return (
      <Link to={ '/auth' } className={ styles.auth } { ...this._test('routeToAuth') }>
        <i className={ [styles.authIcon, 'fa fa-sign-in'].join(' ') } />
      </Link>
    )
  }

  toggleMode = modes => {
    this.props.actions.toggleMode(modes)
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
  return {
    ...state.play,
    user: state.auth.user,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer)
