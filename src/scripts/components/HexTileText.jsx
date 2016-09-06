import React, { PropTypes } from "react";
import { Group, Text }      from "react-art";

import HexTile from "./HexTile";


export default class HexTileText extends HexTile {

  static propTypes = Object.assign({},
    HexTile.propTypes,
    {
      alignment: PropTypes.string.isRequired,
      font: PropTypes.object.isRequired,
      textColor: PropTypes.number.isRequired,
      children: PropTypes.string.isRequired,
    }
  );

  calcPosition() {
    const { font, children } = this.props;
    const lineCount = children.split("\n").length;
    return {
      x: this.center.x,
      y: this.center.y - ((font.fontSize / 2) * lineCount),
    };
  }

  render() {
    const { alignment, font, textColor, children } = this.props;
    return (
      <Group>
        { super.render() }
        <Text
          fill={textColor}
          font={font}
          alignment={alignment}
          {...this.calcPosition()}
        >
          { children }
        </Text>
      </Group>
    );
  }
}

