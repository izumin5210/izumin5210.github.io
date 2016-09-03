import React, { Component, PropTypes }  from "react";
import { Shape, Path }                  from "react-art";


export default class HexTile extends Component {
  static size = 24;
  static gutter = 4;
  static margin = (HexTile.size + HexTile.gutter) / 2;
  static radius = HexTile.size / 2;
  static vertexAngles = [...Array(6).keys()].map(i => Math.PI * (1 / 3) * (i + 0.5));

  static propTypes = {
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  };

  calcCenter() {
    const { row, col } = this.props;
    const indent = (row % 2) * HexTile.margin;
    return {
      x: ((HexTile.size + HexTile.gutter) * col) + indent + HexTile.radius,
      y: (HexTile.size * row) + HexTile.radius,
    };
  }

  makePath() {
    const path = new Path();
    const pos = this.calcCenter();
    HexTile.vertexAngles.forEach((t, i) => {
      const x = pos.x + (HexTile.radius * Math.cos(t));
      const y = pos.y + (HexTile.radius * Math.sin(t));
      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });
    return path;
  }

  render() {
    return (
      <Shape d={this.makePath()} fill={0xd8d8eb} />
    );
  }
}
