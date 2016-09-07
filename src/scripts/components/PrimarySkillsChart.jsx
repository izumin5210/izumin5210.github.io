import React, { Component, PropTypes }  from "react";
import { Surface, Group, Shape, Path }  from "react-art";
import { dispatcher }                   from "react-dispatcher-decorator";

import { PrimarySkills } from "../entities";
import SkillBar from "./SkillBar";


@dispatcher
export default class PrimarySkillsChart extends Component {
  static propTypes = {
    skills: PropTypes.instanceOf(PrimarySkills).isRequired,
  };

  static chartParams = {
    width: 960,
    height: 54,
    gutter: 27,
    fontSize: 20,
    fontFamily: "Inconsolata",
  };

  componentWillMount() {
    this.context.dispatch("PrimarySkills:fetch");
  }

  calcSurfaceSize() {
    const { height, gutter } = PrimarySkillsChart.chartParams;
    return {
      width: 960,
      height: (height + (gutter * 2)) * this.props.skills.size,
    };
  }

  makeStartLinePath() {
    const path = new Path();
    path.moveTo(0, 0);
    path.lineTo(0, this.surfaceSize.height);
    return path;
  }

  render() {
    this.surfaceSize = this.calcSurfaceSize();
    const bars = this.props.skills.map((skill, i) => (
      <SkillBar
        key={`PrimarySkill-${i}`}
        order={i}
        skill={skill}
        {...PrimarySkillsChart.chartParams}
      />
    ));
    return (
      <Surface
        {...this.surfaceSize}
        className="PrimarySkills__chart"
      >
        <Shape stroke="#d8d8eb" strokeWidth={2} d={this.makeStartLinePath()} />
        <Group>
          { bars }
        </Group>
      </Surface>
    );
  }
}

