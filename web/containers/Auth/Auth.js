import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import FacebookLogin from 'react-facebook-login'
import _ from 'lodash'

import Button from '../../components/Button'
import * as actions from '../../../shared/actions/auth'
import * as utils from '../../../shared/utils'

import styles from './Auth.css'

class AuthContainer extends Component {

  static propTypes = {
    modes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    rePassword: PropTypes.string.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    nameError: PropTypes.string,
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
    serverError: PropTypes.string,
    nameValid: PropTypes.bool,
    emailValid: PropTypes.bool,
    passwordValid: PropTypes.bool,
    actions: PropTypes.shape({
      toggleAuthMode: PropTypes.func.isRequired,
      updateName: PropTypes.func.isRequired,
      updateEmail: PropTypes.func.isRequired,
      updatePassword: PropTypes.func.isRequired,
      updateRePassword: PropTypes.func.isRequired,
      login: PropTypes.func.isRequired,
      signup: PropTypes.func.isRequired,
      onNameBlur: PropTypes.func.isRequired,
      onEmailBlur: PropTypes.func.isRequired,
      onPasswordBlur: PropTypes.func.isRequired,
      onRePasswordBlur: PropTypes.func.isRequired,
      showLoginErrors: PropTypes.func.isRequired,
      showSignupErrors: PropTypes.func.isRequired,
      facebookAuthClicked: PropTypes.func.isRequired,
      facebookAuth: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    return (
      <div className={ styles.container }>
        <div className={ styles.leadContainer }>
          <Link to='home' className={ styles.backIcon }><i className='fa fa-home' /></Link>
          <p className={ styles.lead }>
            { _.capitalize(this.props.modes) } to backup and sync your progress between devices
          </p>
        </div>
        { this.renderFacebookAuth() }
        <div className={ styles.or }>Or use the form below</div>
        <a className={ styles.toggleMode } onClick={ this.toggleAuthMode }>
          switch to { this.props.modes === 'signup' ? 'login' : 'singup' }
        </a>
        { this.renderForm() }
      </div>
    )
  }

  renderFacebookAuth () {
    return (
      <FacebookLogin
        appId={ FB_ID }
        isDisabled={ this.props.isProcessing }
        fields='name,email,picture'
        icon={ <i className='fa fa-facebook' /> }
        onClick={ () => this.props.actions.facebookAuthClicked() }
        callback={ res => this.props.actions.facebookAuth(res) }
      />
    )
  }

  renderForm () {
    const { modes, name, nameError, email, emailError, password, passwordError, rePassword, serverError } = this.props
    return (
      <form onSubmit={ this.onSubmit }>
        { utils.renderIf(modes === 'signup')(
          <div className={ styles.formControl }>
            <label>Name <small>(public)</small></label>
            <input onChange={ this.onNameChange } value={ name } type='text' onBlur={ this.onNameBlur } placeholder='put your user name here' />
            { !nameError ? '' : <span className={ styles.error }>{ nameError }</span> }
          </div>
          )
        }
        <div className={ styles.formControl }>
          <label>Email</label>
          <input onChange={ this.onEmailChange } value={ email } type='email' onBlur={ this.onEmailBlur } placeholder='put your email here' />
          { !emailError ? '' : <span className={ styles.error }>{ emailError }</span> }
        </div>
        <div className={ styles.formControl }>
          <label>Password</label>
          <input onChange={ this.onPasswordChange } value={ password } type='password' onBlur={ this.onPasswordBlur } placeholder='put your password here' />
          { !passwordError ? '' : <span className={ styles.error }>{ passwordError }</span> }
        </div>
        { utils.renderIf(modes === 'signup')(
          <div className={ styles.formControl }>
            <label>Repeat Password</label>
            <input onChange={ this.onRePasswordChange } value={ rePassword } type='password' onBlur={ this.onRePasswordBlur } placeholder='put your password again here' />
          </div>
          )
        }
        <div className={ styles.error }>{ serverError }</div>
        <div className={ styles.actions }>
          { this.renderActions() }
        </div>
      </form>
    )
  }

  renderActions () {
    const { isProcessing, modes } = this.props
    if (modes === 'signup') {
      return <Button type='submit' isProcessing={ isProcessing }>Signup</Button>
    }
    return <Button type='submit' isProcessing={ isProcessing }>Login</Button>
  }

  toggleAuthMode = () => {
    this.props.actions.toggleAuthMode()
  }

  onNameChange = evt => {
    this.props.actions.updateName(evt.target.value)
  }

  onEmailChange = evt => {
    this.props.actions.updateEmail(evt.target.value)
  }

  onPasswordChange = evt => {
    this.props.actions.updatePassword(evt.target.value)
  }

  onRePasswordChange = evt => {
    this.props.actions.updateRePassword(evt.target.value)
  }

  onSubmit = evt => {
    evt.preventDefault()
    this.props.modes === 'signup' ? this.signup() : this.login()
  }

  signup = () => {
    const { nameValid, emailValid, passwordValid } = this.props
    if (!nameValid || !emailValid || !passwordValid) {
      this.props.actions.showSignupErrors()
      return
    }
    this.props.actions.signup()
  }

  login = () => {
    if (!this.props.emailValid) {
      this.props.actions.showLoginErrors()
      return
    }
    this.props.actions.login()
  }

  onNameBlur = evt => {
    this.props.actions.onNameBlur()
  }

  onEmailBlur = evt => {
    this.props.actions.onEmailBlur()
  }

  onPasswordBlur = evt => {
    this.props.actions.onPasswordBlur()
  }

  onRePasswordBlur = evt => {
    this.props.actions.onRePasswordBlur()
  }

}

function mapStateToProps (state) {
  return state.auth
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer)
