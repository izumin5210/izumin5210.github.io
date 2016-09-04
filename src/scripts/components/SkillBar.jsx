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

  constructor(props) {
    super(props);
    this.pos = {
      x: 0,
      y: ((props.height + (props.gutter * 2)) * props.order) + props.gutter,
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
