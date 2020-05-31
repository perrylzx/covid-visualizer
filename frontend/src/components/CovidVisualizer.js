import * as d3 from "d3";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

// TODO(PERRY): make this drawchart function display new paths for each country selected from CounterSelector.js dropdown
/* TODO(PERRY): there are multiple states for some countries, right now backend drops the state column and this component receives only selected countries and matches it to the first row from the dataset. eg;
 when you select china from the dropdown, it finds Anhui, China. fix this bug*/
export default class CovidVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { covidCases: [], selectedCountries: [], listOfCountries: [] };
  }

  selectMultipleCountries(eventkey) {
    this.state.selectedCountries.push(this.state.listOfCountries[eventkey]);
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
          caseRange.push(value);
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
        /*         temporary fix as i did not foresee multiple country data rows due to multiple states so for the time being i will remove duplicates from the list of countries.
 this will have a bug where the graph will display the path for the first row that matches the country from the dataset even when it has multiple states*/
        const countryListSet = new Set(res[0]);
        const countryListArray = [...countryListSet];
        this.setState({
          covidCases: res[1],
          listOfCountries: countryListArray,
        });
      });
    this.drawChart();
  }
  render() {
    return (
      <div ref={this.myRef}>
        <DropdownButton
          onSelect={this.selectMultipleCountries.bind(this)}
          id="dropdown-basic-button"
          title="Country"
        >
          {this.state.listOfCountries.map((country, i) => (
            <Dropdown.Item key={i} eventKey={i}>
              {country}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
    );
  }
}
