import { Component } from "react";
import FileBrowser from "./components/FileBrowser";
import data from "./dummy_data/data.json";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Browse Files</h1>

        <div className="folders-wrapper">
          {data && <FileBrowser data={data} />}
        </div>
      </div>
    );
  }
}

export default App;
