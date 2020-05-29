import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./CountrySelector.css";

export default class CountrySelector extends React.Component {
  render() {
    return (
      <Dropdown className="dropdown">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Singapore
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Singapore</Dropdown.Item>
          <Dropdown.Item href="#/action-2">US</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
