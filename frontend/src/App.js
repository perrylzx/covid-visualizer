import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import CovidVisualizer from "./components/CovidVisualizer";
import Introduction from "./components/Introduction";

function App() {
  return (
    <div>
      <Introduction />
      <CovidVisualizer />
    </div>
  );
}

export default App;
