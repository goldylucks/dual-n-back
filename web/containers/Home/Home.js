import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { toggleMode, incrementN, decrementN } from '../../../shared/actions/play'

import styles from './Home.css'

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
      <div className={ styles.container }>
        <div className={ styles.headline }>MEMORY N-BACK</div>
        <div className={ styles.settings }>
          <div className={ styles.leftSetting }>
            <i onClick={ this.toggleMode } className={ [styles.leftSettingIcon, 'fa fa-caret-left'].join(' ') } />
          </div>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText }>{ mode }</div>
          </div>
          <div className={ styles.rightSetting }>
            <i onClick={ this.toggleMode } className={ [styles.rightSettingIcon, 'fa fa-caret-right'].join(' ') } />
          </div>
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
        <div className={ styles.play }>
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
