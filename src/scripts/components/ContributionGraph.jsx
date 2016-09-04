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

  constructor(props) {
    super(props);
    const { size, gutter, margin } = HexTile;
    const { rows, cols } = props;
    this.width = ((size + gutter) * cols) + (margin - gutter);
    this.height = size * rows;
  }

  componentDidMount() {
    this.context.dispatch("Contributions:fetch");
  }

  render() {
    const { rows, cols } = this.props;
    const startIdx = this.props.contributions.size - (cols * rows);
    const contributions = this.props.contributions.slice(startIdx);
    const maxCount = Math.max.apply(null, contributions.map(c => c.count).toArray());
    const tiles = contributions.map((contribution, i) => (
      <HexTile
        key={`contributed-on-${contribution.date}`}
        row={i % this.props.rows}
        col={Math.floor(i / this.props.rows)}
        count={contribution.count}
        maxCount={maxCount}
      />
    ));
    return (
      <Surface
        width={this.width}
        height={this.height}
        className="ContributionGraph"
      >
        { tiles }
      </Surface>
    );
  }
}
