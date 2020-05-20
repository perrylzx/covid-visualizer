import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "react-bootstrap/Button";

export default class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { covidCases: [] };
  }
  // this handleclick function finds the specific country
  handleClick = () => {
    fetch("http://localhost:3000/download")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({ covidCases: res });
      })
      .then(() => {
        var i;
        for (i = 0; i < this.state.covidCases.length; i++) {
          if (this.state.covidCases[i]["Country/Region"] === "US") {
            console.log(this.state.covidCases[i]);
          }
        }
      });
  };

  componentDidMount() {
    this.handleClick();
  }

  render() {
    return (
      <Button onClick={this.handleClick} variant="primary">
        Primary
      </Button>
    );
  }
}
