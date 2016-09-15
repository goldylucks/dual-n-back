import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';

export default class Square extends Component {

  static propTypes = {
    idx: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
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
    const style = Object.assign({}, this.props.style, {
      backgroundColor: 'blue',
    });

    if (this.props.activeSquareIdx === this.props.idx) {
      style.background = this.props.activeSquareColor;
    }

    return style;
  }
}
