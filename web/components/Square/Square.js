import React, { Component, PropTypes } from 'react'

import styles from './Square.css'

export default class Square extends Component {

  static propTypes = {
    style: PropTypes.object,
    idx: PropTypes.number.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  render () {
    return (
      <div style={ this.getContainerStyle() } className={ styles.container }>
        { this.props.children }
      </div>
    )
  }

  getContainerStyle () {
    const style = Object.assign({}, this.props.style)

    if (this.isActive()) {
      style.backgroundColor = this.props.activeSquareColor
    }

    return style
  }

  isActive () {
    return this.props.activeSquareIdx === this.props.idx
  }
}
