import * as d3 from "d3";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

var unparsedCountryList = [];
var dateRange = [];
var caseRange = [];
var pathData = [];

// TODO(PERRY): make this drawchart function display new paths for each country selected from CounterSelector.js dropdown
/* TODO(PERRY): there are multiple states for some countries, right now backend drops the state column and this component receives only selected countries and matches it to the first row from the dataset. eg;
 when you select china from the dropdown, it finds Anhui, China. fix this bug*/
export default class CovidVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { covidCases: [], selectedCountries: [], listOfCountries: [] };
  }
  // format the data
  parseTime = d3.timeParse("%m/%e/%y");

  drawChart() {
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    console.log(pathData);
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

    this.node = this.node
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scale the range of the data
    x.domain(d3.extent(dateRange));
    y.domain([0, d3.max(caseRange)]);

    // add the singapore path
    this.node
      .append("path")
      .data([pathData[0]])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke-width", "2px")
      .style("stroke", "steelblue")
      .style("fill", "none");

    // Add the X Axis
    this.node
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("color", "white")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    this.node.append("g").call(d3.axisLeft(y)).style("color", "white");
  }

  // fetches the selected country from the dropdown and parses it for data
  selectMultipleCountries(eventkey) {
    this.state.selectedCountries.push(this.state.listOfCountries[eventkey]);
    this.state.covidCases.forEach((country) => {
      if (country.hasOwnProperty(this.state.listOfCountries[eventkey])) {
        unparsedCountryList.push(country[this.state.listOfCountries[eventkey]]);
      }
    });
    for (let i = 0; i < unparsedCountryList.length; i++) {
      var countryData = [];
      for (let [key, value] of Object.entries(unparsedCountryList[i])) {
        key = this.parseTime(key);
        dateRange.push(key);
        caseRange.push(value);
        const datesToCases = { date: key, cases: value };
        countryData.push(datesToCases);
      }
    }
    pathData.push(countryData);
    this.drawChart();
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
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // appending svg to ref and a group element
    this.node = d3
      .select(this.myRef.current)
      .append("svg")
      .style("border-style", "solid")
      .style("background-color", "black")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
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
