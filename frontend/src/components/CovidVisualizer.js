import * as d3 from "d3";
import React from "react";

export default class CovidVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {};
  }
  //todo (perry) : path not being drawn. only svg and x and y axis being rendered. find out why
  drawChart() {
    const dates = [];
    const cases = [];
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    //format the data
    const parseTime = d3.timeParse("%m/%e/%y");
    // define the 1st line
    const valueline = d3
      .line()
      // this uses the d3.scaleTime function in the variable x on the array of dates
      .x((d) => {
        return x(dates);
      })
      .y((d) => {
        return y(cases);
      });

    this.state.covidCases.forEach((country) => {
      if (country.hasOwnProperty("Singapore")) {
        this.Singapore = country.Singapore;
        for (let [key, value] of Object.entries(this.Singapore)) {
          key = parseTime(key);
          dates.push(key);
          cases.push(value);
        }
      }
    });
    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // scale the range of the data
    x.domain(
      d3.extent(this.Singapore, (d) => {
        return dates;
      })
    );
    y.domain([
      0,
      d3.max(this.Singapore, (d) => {
        for (let [key, value] of Object.entries(this.Singapore)) {
          console.log("hereererer" + this.Singapore[key]);
          return Math.max(value);
        }
      }),
    ]);
    // appending svg to ref and a group element
    const node = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //add the singapore path
    node
      .append("path")
      .data([this.Singapore])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke-width", "2px")
      .style("stroke", "steelblue")
      .style("fill", "none");
    // Add the X Axis
    node
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    node.append("g").call(d3.axisLeft(y));
  }

  async componentDidMount() {
    await fetch("http://localhost:3001/download")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({ covidCases: res });
      });
    this.drawChart();
  }
  render() {
    return <div ref={this.myRef}></div>;
  }
}
