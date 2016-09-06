import React, { Component, PropTypes }  from "react";
import { Shape, Path }                  from "react-art";


export default class HexTile extends Component {
  static vertexAngles = [...Array(6).keys()].map(i => Math.PI * (1 / 3) * (i + 0.5));

  static propTypes = {
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    gutter: PropTypes.number.isRequired,
    color: PropTypes.number,
    stroke: PropTypes.number,
    strokeWidth: PropTypes.number,
  };

  static defaultProps = {
    color: 0x00000000,
    stroke: 0x00000000,
    strokeWidth: 0,
  };

  static calcSize(size, gutter) {
    const width = size * Math.cos(HexTile.vertexAngles[0]);
    const height = size;
    return {
      width,
      height,
      margin: (width + gutter) / 2,
    };
  }

  static calcCanvasSize(size, gutter, rows, cols, strokeWidth = HexTile.defaultProps.strokeWidth) {
    const { width, height, margin } = HexTile.calcSize(size, gutter);
    return {
      width: ((width + gutter) * cols) + margin + strokeWidth,
      height: (((height * (3 / 4)) + gutter) * rows) + (height * (1 / 4)) + strokeWidth,
    };
  }

  componentWillMount() {
    this.center = this.calcCenter();
  }

  componentWillUpdate() {
    this.center = this.calcCenter();
  }

  calcCenter() {
    const { row, col, size, gutter, strokeWidth } = this.props;
    const { width, height, margin } = HexTile.calcSize(size, gutter);
    const indent = (row % 2) * margin;
    return {
      x: ((width + gutter) * col) + indent + (width / 2) + (strokeWidth / 2),
      y: (((height * (3 / 4)) + gutter) * row) + (height / 2) + (strokeWidth / 2),
    };
  }

  makePath() {
    const path = new Path();
    let start;
    const radius = this.props.size / 2;
    HexTile.vertexAngles.forEach((t, i) => {
      const x = this.center.x + (radius * Math.cos(t));
      const y = this.center.y + (radius * Math.sin(t));
      if (i === 0) {
        path.moveTo(x, y);
        start = { x, y };
      } else {
        path.lineTo(x, y);
      }
    });
    path.lineTo(start.x, start.y);
    return path;
  }

  render() {
    return (
      <Shape
        d={this.makePath()}
        fill={this.props.color}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth}
      />
    );
  }
}
