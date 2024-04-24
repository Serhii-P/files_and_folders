import React, { Component } from "react";
import Folder from "./Folder";
import File from "./File";
import { debounce } from "lodash";
import { memoize } from "../helpers/memoize";

class FileBrowser extends Component {
  state = {
    searchTerm: "",
    expandedFolders: new Set(),
    visibilityCache: {},
    searchValue: "",
  };

  debouncedSearch = debounce((searchTerm) => {
    this.setState({ searchTerm }, () => {
      if (searchTerm) {
        this.updateExpandedFoldersForSearch();
      } else {
        this.setState({ expandedFolders: new Set() });
      }
    });
  }, 500);

  toggleFolder = (path) => {
    this.setState((prevState) => {
      const expandedFolders = new Set(prevState.expandedFolders);
      if (expandedFolders.has(path)) {
        expandedFolders.delete(path);
      } else {
        expandedFolders.add(path);
      }
      return { expandedFolders };
    });
  };

  handleSearch = (event) => {
    const searchTerm = event.target.value;
    this.setState({ searchValue: searchTerm });
    this.debouncedSearch(searchTerm);
  };

  updateExpandedFoldersForSearch = () => {
    const { searchTerm } = this.state;
    const { data } = this.props;

    if (searchTerm) {
      const pathsToExpand = data.flatMap((entry) =>
        this.getPathsToExpand(entry, "")
      );
      this.setState({ expandedFolders: new Set(pathsToExpand) });
    } else {
      this.setState({ expandedFolders: new Set() });
    }
  };

  getPathsToExpand = memoize((entry, path) => {
    const fullPath = path ? `${path}/${entry.name}` : entry.name;
    let paths = [];

    if (entry.type === "FOLDER") {
      for (const child of entry.children) {
        paths = paths.concat(this.getPathsToExpand(child, fullPath));
      }
      if (paths.length > 0) {
        paths.push(fullPath);
      }
    } else if (entry.type === "FILE" && this.isVisible(entry)) {
      paths.push(path);
    }

    return paths;
  });

  isVisible = (entry) => {
    const { searchTerm } = this.state;
    if (!searchTerm) {
      return true;
    }

    if (entry.type === "FILE") {
      return entry.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return (
      entry.children.some((child) => this.isVisible(child)) ||
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  isExpanded = (path) => {
    const { expandedFolders } = this.state;
    return expandedFolders.has(path);
  };

  renderEntry = (entry, path = "") => {
    const fullPath = path ? `${path}/${entry.name}` : entry.name;
    const isExpanded = this.isExpanded(fullPath);
    const isVisible = this.isVisible(entry);

    if (!isVisible) {
      return null;
    }

    if (entry.type === "FILE") {
      return <File key={fullPath} name={entry.name} mimeType={entry.mime} />;
    }

    return (
      <Folder
        key={fullPath}
        entry={entry}
        isExpanded={isExpanded}
        toggleFolder={this.toggleFolder}
        renderEntry={this.renderEntry}
        path={fullPath}
      />
    );
  };
  render() {
    const { data } = this.props;
    const { searchValue } = this.state;

    const renderedEntries = data.map((entry, index) =>
      this.isVisible(entry) ? this.renderEntry(entry, "") : null
    );

    const allNull = renderedEntries.every((element) => element === null);

    return (
      <div className="browser-col">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={this.handleSearch}
          className="search-bar"
        />
        <ul>{!allNull ? renderedEntries : <li>No match found</li>}</ul>
      </div>
    );
  }
}

export default FileBrowser;
