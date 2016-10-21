import React, { Component, PropTypes } from 'react'

export default class Square extends Component {

  static propTypes = {
    style: PropTypes.object,
    idx: PropTypes.number.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    activeSquareColor: PropTypes.string.isRequired,
  }

  render () {
    return (
      <div style={ this.getContainerStyle() } />
    )
  }

  getContainerStyle () {
    const _style = Object.assign({}, this.props.style, style)

    if (this.isActive()) {
      _style.backgroundColor = this.props.activeSquareColor
    }

    return _style
  }

  isActive () {
    return this.props.activeSquareIdx === this.props.idx
  }
}

const style = {
  backgroundColor: 'blue',
  width: 100,
  height: 100,
}
