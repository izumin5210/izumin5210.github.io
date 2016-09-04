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

  constructor(props) {
    super(props);
    // FIXME
    this.chartParams = {
      width: 960,
      height: 54,
      gutter: 27,
      fontSize: 20,
      fontFamily: "Inconsolata",
    };
  }

  componentDidMount() {
    this.context.dispatch("PrimarySkills:fetch");
  }

  makeStartLinePath() {
    const path = new Path();
    path.moveTo(0, 0);
    path.lineTo(0, this.surfaceHeight);
    return path;
  }

  render() {
    const { height, gutter } = this.chartParams;
    this.surfaceWidth = 960;
    this.surfaceHeight = (height + (gutter * 2)) * this.props.skills.size;
    const bars = this.props.skills.map((skill, i) => (
      <SkillBar
        key={`PrimarySkill-${i}`}
        order={i}
        skill={skill}
        {...this.chartParams}
      />
    ));
    return (
      <Surface
        width={this.surfaceWidth}
        height={this.surfaceHeight}
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

