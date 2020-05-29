import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import CountrySelector from "./components/CountrySelector";
import CovidVisualizer from "./components/CovidVisualizer";

function App() {
  return (
    <div>
      <CountrySelector />
      <CovidVisualizer />
    </div>
  );
}

export default App;
