import * as d3 from "d3";
import React from "react";

// TODO(PERRY): make this drawchart function display new paths for each country selected from CounterSelector.js dropdown

export default class CovidVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { covidCases: [] };
  }
  drawChart() {
    const dateRange = [];
    const caseRange = [];
    const pathData = [];

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // format the data
    const parseTime = d3.timeParse("%m/%e/%y");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // format data and push dates and case numbers to array
    this.state.covidCases.forEach((country) => {
      if (country.hasOwnProperty("Singapore")) {
        this.Singapore = country.Singapore;
        for (let [key, value] of Object.entries(this.Singapore)) {
          key = parseTime(key);
          dateRange.push(key); // for now, dates and cases array is only for setting the domain
          caseRange.push(value); // what
          const datesToCases = { date: key, cases: value }; // this is the data which we use to draw the path
          pathData.push(datesToCases);
        }
      }
    });
    // define the 1st line
    const valueline = d3
      .line()
      // this uses the d3.scaleTime function in the variable x on the array of dates
      .x((d) => {
        return x(d.date);
      })
      .y((d) => {
        return y(d.cases);
      });

    // appending svg to ref and a group element
    const node = d3
      .select(this.myRef.current)
      .append("svg")
      .style("border-style", "solid")
      .style("background-color", "black")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scale the range of the data
    x.domain(d3.extent(dateRange));
    y.domain([0, d3.max(caseRange)]);

    // add the singapore path
    node
      .append("path")
      .data([pathData])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke-width", "2px")
      .style("stroke", "steelblue")
      .style("fill", "none");

    // Add the X Axis
    node
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("color", "white")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    node.append("g").call(d3.axisLeft(y)).style("color", "white");
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
