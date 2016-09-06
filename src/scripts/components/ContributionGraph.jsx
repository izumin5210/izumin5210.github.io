import React, { Component, PropTypes }  from "react";
import { Surface }                      from "react-art";
import { dispatcher }                   from "react-dispatcher-decorator";

import HexTile from "./HexTile";

import { Contributions } from "../entities";


@dispatcher
export default class ContributionGraph extends Component {

  static propTypes = {
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    contributions: PropTypes.instanceOf(Contributions).isRequired,
  };

  static colors = [
    0xd8d8eb,
    0xd7b5d7,
    0xe192c2,
    0xff66b2,
  ];

  static tileParams = {
    size: 24,
    gutter: 4,
  };

  componentWillMount() {
    this.context.dispatch("Contributions:fetch");
  }

  makeColor(count, maxCount) {
    const colors = ContributionGraph.colors;
    const colorIdx = Math.ceil((count / (maxCount + 1)) * colors.length);
    return colors[(colorIdx === colors.length) ? colors.length - 1 : colorIdx];
  }

  render() {
    const { size, gutter } = ContributionGraph.tileParams;
    const { rows, cols } = this.props;
    const startIdx = this.props.contributions.size - (cols * rows);
    const contributions = this.props.contributions.slice(startIdx);
    const maxCount = Math.max.apply(null, contributions.map(c => c.count).toArray());
    const tiles = contributions.map((contribution, i) => (
      <HexTile
        key={`contributed-on-${contribution.date}`}
        row={i % rows}
        col={Math.floor(i / rows)}
        color={this.makeColor(contribution.count, maxCount)}
        {...ContributionGraph.tileParams}
      />
    ));
    return (
      <Surface
        className="ContributionGraph"
        {...HexTile.calcCanvasSize(size, gutter, rows, cols)}
      >
        { tiles }
      </Surface>
    );
  }
}
