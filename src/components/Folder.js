import React, { Component } from "react";

class Folder extends Component {
  toggleFolder = () => {
    const { path, toggleFolder } = this.props;
    toggleFolder(path);
  };

  render() {
    const { entry, isExpanded, renderEntry, path } = this.props;

    if (!entry) {
      return null;
    }

    const { name, children } = entry;

    return (
      <li>
        <span className="node" onClick={this.toggleFolder}>
          {isExpanded ? "🔽" : "➡️"} {name}
        </span>
        {isExpanded && (
          <ul>{children.map((child) => renderEntry(child, path))}</ul>
        )}
      </li>
    );
  }
}

export default Folder;
