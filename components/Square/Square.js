import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';

export default class Square extends Component {

  static propTypes = {
    idx: PropTypes.number.isRequired,
    activeSquareIdx: PropTypes.number.isRequired,
    activeSquareColor: PropTypes.string.isRequired
  }

  // state = {
  //   style: {}
  // }

  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.activeSquareIdx === this.props.idx) {
  //     this.setState({
  //       style: {
  //         background: nextProps.activeSquareColor
  //       }
  //     });
  //     return;
  //   }

  //   this.setState({
  //     style: {}
  //   });
  // }

  render () {
    return (
      <View style={ this.getContainerStyle() } />
    );
  }

  getContainerStyle () {
    const _style = Object.assign({}, this.props.style, style);

    if (this.props.activeSquareIdx === this.props.idx) {
      _style.background = this.props.activeSquareColor;
    }

    return _style;
  }
}

const style = {
  backgroundColor: 'blue',
  width: 100,
  height: 100,
};
