import React from "react";
import { dispatcher } from "react-dispatcher-decorator";
import { Stage, CustomPIXIComponent } from "react-pixi";
import { Graphics } from "pixi.js";

import { Contributions } from "../entities";

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
  },
});

@dispatcher
export default class ContributionGraph extends React.Component {
  componentDidMount() {
    this.context.dispatch("contributions:fetch");
  }

  cellSize = 24;
  cellGutter = 4;
  cellMargin = (this.cellSize + this.cellGutter) / 2;
  cellRadius = this.cellSize / 2;
  weekCount = 33;
  daysPerWeek = 7;
  corners = 6;
  vertexAngles = [...Array(this.corners).keys()].map(i => (2 / this.corners) * (i + 0.5));
  stageWidth = ((this.cellSize + this.cellGutter) * this.weekCount)
    + (this.cellMargin - this.cellGutter);
  stageHeight = this.cellSize * this.daysPerWeek;

  calcCellCenter(row, col) {
    const indent = (row % 2) * this.cellMargin;
    return {
      x: ((this.cellSize + this.cellGutter) * col) + indent + this.cellRadius,
      y: (this.cellSize * row) + this.cellRadius,
    };
  }

  generateVertices(row, col) {
    const pos = this.calcCellCenter(row, col);
    return this.vertexAngles.map(t => [
      pos.x + (this.cellRadius * Math.cos(Math.PI * t)),
      pos.y + (this.cellRadius * Math.sin(Math.PI * t)),
    ]);
  }

  render() {
    const cellStartedAt = this.props.contributions.size - (this.weekCount * 7);
    const cells = this.props.contributions.slice(cellStartedAt).map((contribution, idx) => {
      const i = idx % this.daysPerWeek;
      const j = Math.floor(idx / this.daysPerWeek);
      return {
        vertices: this.generateVertices(i, j),
        count: contribution.count,
        date: contribution.date,
      };
    });
    return (
      <Stage
        width={this.stageWidth}
        height={this.stageHeight}
        antialias
        transparent
        backgroundcolor={0x333333}
      >
        { cells.map(cell => <ContributionCell key={`contributed-on-${cell.date}`} cell={cell} />) }
      </Stage>
    );
  }
}

ContributionGraph.propTypes = {
  contributions: React.PropTypes.instanceOf(Contributions).isRequired,
};
