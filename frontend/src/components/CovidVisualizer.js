import * as d3 from "d3";
import React from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "react-bootstrap/Spinner";
import "./CovidVisualizer.css";

var unparsedCountryList = [];
var dateRange = [];
var caseRange = [];
var countryCaseData = [];
var color = d3.schemeCategory10;

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// TODO(PERRY): make this drawchart function display new paths for each country selected from CounterSelector.js dropdown
/* TODO(PERRY): there are multiple states for some countries, right now backend drops the state column and this component receives only selected countries and matches it to the first row from the dataset. eg;
 when you select china from the dropdown, it finds Anhui, China. fix this bug*/
// TODO(PERRY)(bug): upon selecting a country, it calls the drawchart function which appends new paths, x and y axis every time. fix it so that selecting new countries merely updates the x and y axis with new domains and appends path properly
export default class CovidVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      covidCases: [],
      selectedCountries: [],
      listOfCountries: [],
      firstCountrySelected: false,
      selectedCountryIndex: 0,
      dataLoaded: false,
    };
  }

  parseTime = d3.timeParse("%m/%e/%y");

  drawChart() {
    // the reason for removing the svg is to redraw the graph on every country selection so as to scale the data according to the y axis
    d3.select(".mainGraph").remove();
    let svg = d3
      .select(".graphContainer")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "mainGraph");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    const countryLineData = d3
      .line()
      .x((d) => {
        return x(d.date);
      })
      .y((d) => {
        return y(d.cases);
      });

    // scale the range of the data
    x.domain(d3.extent(dateRange));
    y.domain([0, d3.max(caseRange)]);

    // appending a g element to group y axis, x axis, data, etc
    svg = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the X Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    this.yAxis = svg.append("g").call(d3.axisLeft(y));

    // adding a group element for each path
    let countryPath = svg
      .selectAll(".countryPath")
      .data(countryCaseData)
      .enter()
      .append("g")
      .attr("class", "countryPath");

    // add the path
    countryPath
      .append("path")
      .attr("class", "line")
      .attr("d", countryLineData)
      .style("stroke-width", "2px")
      .style("stroke", function (d, i) {
        return color[i];
      })
      .attr("fill", "none");
  }

  // fetches the selected country from the dropdown and parses the data to a d3 readable format
  selectCountries(eventkey) {
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
    console.log(caseRange);
    countryCaseData.push(countryData);
    this.drawChart();
  }

  async componentDidMount() {
    await fetch("https://covid-vizua.herokuapp.com/download")
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
          dataLoaded: true,
        });
      });
    // appending an empty svg container for where the main visualization will be appended to in the drawChart function
    d3.select(this.myRef.current)
      .append("svg")
      .style("border-style", "solid")
      .style("border-width", "1px")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "graphContainer");
  }

  render() {
    return (
      <div id="graph" ref={this.myRef}>
        {this.state.dataLoaded ? (
          <div id="button-group">
            <DropdownButton
              id="dropdown-basic-button"
              onSelect={this.selectCountries.bind(this)}
              title="Country"
            >
              {this.state.listOfCountries.map((country, i) => (
                <Dropdown.Item key={i} eventKey={i}>
                  {country}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <div>
              <Button
                onClick={function () {
                  countryCaseData = [];
                  caseRange = [];
                  unparsedCountryList = [];
                  d3.select(".mainGraph").remove();
                }}
                id="reset-button"
                variant="primary"
              >
                Reset
              </Button>{" "}
            </div>
          </div>
        ) : (
          <Spinner id="spinner" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        {/* this dropdown sends the index of the chosen country to the selectCountries function */}
      </div>
    );
  }
}
