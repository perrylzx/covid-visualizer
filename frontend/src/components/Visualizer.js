import FileAttachments from "@observablehq/stdlib/src/fileAttachment";
import React from "react";
import Dataset from "../dataset/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

export default class Visualizer extends React.Component {
  render() {
    const text = FileAttachments(Dataset);
    return (
      <div>
        <h1>{text}</h1>
      </div>
    );
  }
}
