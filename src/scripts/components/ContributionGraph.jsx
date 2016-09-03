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
    this.context.dispatch("contributions:fetch");
  }

  render() {
    const { rows, cols } = this.props;
    const startIdx = this.props.contributions.size - (cols * rows);
    const tiles = this.props.contributions.slice(startIdx).map((contribution, i) => (
      <HexTile
        key={`contributed-on-${contribution.date}`}
        row={i % rows}
        col={Math.floor(i / rows)}
        count={contribution.count}
      />
    ));
    return (
      <Surface width={this.width} height={this.height} >
        { tiles }
      </Surface>
    );
  }
}
