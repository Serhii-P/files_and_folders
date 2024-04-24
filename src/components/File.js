import React, { Component, memo } from "react";

class File extends Component {
  render() {
    const { name, mimeType } = this.props;
    return (
      <li>
        <span>
          {name} ({mimeType})
        </span>
      </li>
    );
  }
}

export default memo(File);
