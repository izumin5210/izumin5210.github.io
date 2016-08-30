import React from "react";
import {dispatcher} from "react-dispatcher-decorator";
import {Stage, CustomPIXIComponent} from "react-pixi";
import {Graphics} from "pixi.js";

import {Contribution, Contributions} from "../entities";

const ContributionCell = CustomPIXIComponent({
  customDisplayObject(props) {
    const graphics = new Graphics();
    const vertices = props.cell.vertices;
    graphics.beginFill(0xd8d8eb);
    graphics.moveTo(vertices[vertices.length - 1][0], vertices[vertices.length - 1][1]);
    for (let i = 0; i < vertices.length; i++) {
      graphics.lineTo(vertices[i][0], vertices[i][1]);
    }
    graphics.endFill();
    return graphics;
  }
});

@dispatcher
export default class ContributionGraph extends React.Component {
  componentDidMount() {
    this.context.dispatch("contributions:fetch");
  }

  render() {
    const cellSize = 24;
    const cellGutter = 4;
    const cellMargin = (cellSize + cellGutter) / 2;
    const r = cellSize / 2;
    const weekCount = 33;
    const cells = this.props.contributions.slice(this.props.contributions.size - weekCount * 7).map((contribution, idx) => {
      const i = idx % 7;
      const j = Math.floor(idx / 7);

      const cx = cellSize * j + (j > 0 ? (cellGutter * j) : 0) + (i % 2) * cellMargin + r;
      const cy = cellSize * i + r;
      const vertices = [1 / 6, 1/ 2, 5 / 6, 7 / 6, 3 / 2, 11 / 6].map(t => [
          cx + r * Math.cos(Math.PI * t), cy + r * Math.sin(Math.PI * t)
      ]);
      return {
        vertices: vertices,
        count: contribution.count,
        date: contribution.date
      };
    });
    return (
      <Stage
        width={(cellSize + cellGutter) * Math.ceil(weekCount) + cellMargin - cellGutter}
        height={cellSize * 7}
        antialias={true}
        transparent={true}
        backgroundcolor={0x333333}
      >
        { cells.map(cell => <ContributionCell key={`contributed-on-${cell.date}`} cell={cell} />) }
      </Stage>
    );
  }
}

ContributionGraph.propTypes = {
  contributions: React.PropTypes.instanceOf(Contributions).isRequired
};
