import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as actions from '../../../shared/actions/play'

import styles from './Home.css'

class HomePage extends Component {

  static propTypes = {
    mode: PropTypes.object.isRequired,
    nBack: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    bestScore: PropTypes.object.isRequired,
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
    const { mode, nBack, speed } = this.props
    return (
      <div className={ styles.container }>
        <div className={ styles.headline }>MEMORY N-BACK</div>
        <div className={ `${styles.settings} ${styles.mode}` }>
          <i onClick={ this.toggleMode.bind(this, 'position') } className={ `fa fa-th ${mode.position ? styles.active : ''}` } />
          <i onClick={ this.toggleMode.bind(this, 'audio') } className={ `fa fa-headphones ${mode.audio ? styles.active : ''}` } />
          <i onClick={ this.toggleMode.bind(this, 'color') } className={ `fa fa-paint-brush ${mode.color ? styles.active : ''}` } />
        </div>
        <div className={ styles.settings }>
          <div className={ styles.leftSetting }>
            <i onClick={ this.decrementN } className={ [styles.leftSettingIcon, 'fa fa-minus'].join(' ') } />
          </div>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText }>{ nBack }</div>
          </div>
          <div className={ styles.rightSetting }>
            <i onClick={ this.incrementN } className={ [styles.rightSettingIcon, 'fa fa-plus'].join(' ') } />
          </div>
        </div>
        <div className={ styles.settings }>
          <div className={ styles.leftSetting }>
            <i onClick={ this.decrementSpeed } className={ [styles.leftSettingIcon, 'fa fa-minus'].join(' ') } />
          </div>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText }>{ speed }</div>
          </div>
          <div className={ styles.rightSetting }>
            <i onClick={ this.incrementSpeed } className={ [styles.rightSettingIcon, 'fa fa-plus'].join(' ') } />
          </div>
        </div>
        <div className={ styles.play }>
          { this.renderLogin() }
          <Link to={ '/play' }>
            <i className={ [styles.playIcon, 'fa fa-play-circle'].join(' ') } />
          </Link>
        </div>
        <div className={ styles.record }>
          BEST SCORE: { this.getBestScore() }
        </div>
      </div>
    )
  }

  renderLogin () {
    if (this.props.user.name) {
      return
    }
    return (
      <Link to={ '/auth' } className={ styles.auth }>
        <i className={ [styles.authIcon, 'fa fa-sign-in'].join(' ') } />
      </Link>
    )
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

  getBestScore () {
    const { mode, bestScore, nBack } = this.props
    return bestScore[mode + nBack] || 0
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
)(HomePage)
