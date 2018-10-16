import React, { Component } from "react";
import TimeElapsed from "./TimeElapsed";
import "../styles/laptimes.css";

class LapTimes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laps: []
    };
  }
  render() {
    const rows = this.props.lapTimes.map((lapTime, index) => (
      <tr key={++index}>
        <td id="count">{index}</td>
        <td id="laptime">
          <TimeElapsed runningTime={lapTime} />
        </td>
      </tr>
    ));
    const avgTime = this.props.lapTimes.reduce((sum, lapTime, i) => {
      ++i;
      sum += lapTime;
      return sum / i + 1;
    }, 0);
    return (
      <div id="scroll-tbl">
        <table id="laptimes-table">
          <thead>
            <tr>
              <th id="order-heading">#</th>
              <th id="times-heading">Time</th>
            </tr>
          </thead>
          <tbody id="table-rows">{rows}</tbody>
        </table>
        <div id="avg-head">
          <h5>Average P* Time:</h5>
        </div>
        <div id="lap-average">
          <TimeElapsed runningTime={avgTime} />
        </div>
      </div>
    );
  }
}

export default LapTimes;
