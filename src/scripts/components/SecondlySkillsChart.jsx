import React, { Component, PropTypes }  from "react";
import { Surface }                      from "react-art";
import { dispatcher }                   from "react-dispatcher-decorator";

import HexTileText from "./HexTileText";

import { SecondlySkills } from "../entities";


@dispatcher
export default class SecondlySkillsChart extends Component {

  static propTypes = {
    skills: PropTypes.instanceOf(SecondlySkills).isRequired,
  };

  static tileParams = {
    size: 160,
    gutter: 0,
  };

  componentWillMount() {
    this.context.dispatch("SecondlySkills:fetch");
  }

  makeTile(text, row, col) {
    return (
      <HexTileText
        key={`SecondlySkill-(${row},${col})`}
        row={row}
        col={col}
        stroke={0xd8d8eb}
        strokeWidth={2}
        alignment="center"
        font={{ fontSize: 20, fontFamily: "Inconsolata" }}
        textColor={0xd8d8eb}
        {...SecondlySkillsChart.tileParams}
      >
        {text}
      </HexTileText>
    );
  }

  render() {
    const names = this.props.skills.map(s => s.name).toArray().concat(["..."]);
    const { size, gutter } = SecondlySkillsChart.tileParams;
    const cols = 8;
    const rows = Math.ceil(names.length / cols);
    const tiles = names.map((name, i) => this.makeTile(name, Math.floor(i / cols), i % cols));
    return (
      <Surface
        className="SecondlySkills__chart"
        {...HexTileText.calcCanvasSize(size, gutter, rows, cols, 2)}
      >
        { tiles }
      </Surface>
    );
  }
}
