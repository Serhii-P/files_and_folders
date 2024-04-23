import React, { Component } from "react";

export default class File extends Component {
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
