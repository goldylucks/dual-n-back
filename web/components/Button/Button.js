import React, { Component, PropTypes } from 'react'
import styles from './Button.css'

export default class Button extends Component {

  static propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  }

  render () {
    const { isProcessing, onClick, children } = this.props
    return (
      <div className={ styles.container }>
        <button
          type='button'
          className={ styles.button }
          disabled={ isProcessing }
          onClick={ onClick }
        >
          { children }
        </button>
        { isProcessing ? <span className={ styles.spinner } /> : null }
      </div>
    )
  }

}
