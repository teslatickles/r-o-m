import React, { Component } from "react";
import "../styles/timeelapsed.css";

class TimeElapsed extends Component {
  formatTime() {
    const seconds = this.props.runningTime / 1000;
    return {
      min: Math.floor(seconds / 60).toString(),
      sec: Math.floor(seconds % 60).toString(),
      msec: (seconds % 1).toFixed(2).substring(2)
    };
  }

  render() {
    const units = this.formatTime();
    return (
      <div className="time-elapsed">
        {units.min > 0 && <span id="minutes">{units.min} : </span>}
        <span id="seconds">{units.sec}.</span>
        <span id="milseconds">{units.msec}</span>
      </div>
    );
  }
}

export default TimeElapsed;
