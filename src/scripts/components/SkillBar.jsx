import React, { Component, PropTypes }  from "react";
import { Group, Shape, Path, Text }     from "react-art";

import { PrimarySkill } from "../entities";

export default class SkillBar extends Component {
  static propTypes = {
    order: PropTypes.number.isRequired,
    skill: PropTypes.instanceOf(PrimarySkill).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    gutter: PropTypes.number.isRequired,
    fontSize: PropTypes.number.isRequired,
    fontFamily: PropTypes.string.isRequired,
  };

  calcPos() {
    const { height, gutter, order } = this.props;
    return {
      x: 0,
      y: ((height + (gutter * 2)) * order) + gutter,
    };
  }

  makePath() {
    const { width, height, skill } = this.props;
    const path = new Path();
    const topLeft = this.pos;
    const rightBottom = {
      x: width * skill.score,
      y: this.pos.y + height,
    };
    path.moveTo(topLeft.x, topLeft.y);
    path.lineTo(rightBottom.x, topLeft.y);
    path.lineTo(rightBottom.x, rightBottom.y);
    path.lineTo(topLeft.x, rightBottom.y);
    return path;
  }

  render() {
    this.pos = this.calcPos();
    const { width, height, skill, fontSize, fontFamily } = this.props;
    return (
      <Group>
        <Shape
          stroke="#d8d8eb"
          strokeWidth={2}
          d={this.makePath()}
        />
        <Text
          fill="#d8d8eb"
          font={{ fontSize, fontFamily }}
          height={height}
          alignment="right"
          x={(width * skill.score) - 16}
          y={this.pos.y + ((height - fontSize) / 2)}
        >
          { skill.name }
        </Text>
      </Group>
    );
  }
}
