import React, { Component } from "react";
import TimeElapsed from "./TimeElapsed";
import { toggle } from "../api/connect";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCounting: false,
      runningTime: 0,
      lapTimes: []
    };
    ["update", "startTimer", "stopTimer"].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    toggle(() => {
      console.log(this.state.lapTimes);
      this.setState({ isCounting: !this.state.isCounting }, () => {
        this.state.isCounting ? this.startTimer() : this.stopTimer();
      });
      if (this.state.lapTimes) {
        this.props.callbackFromParent(this.state.lapTimes);
      }
    });
  }

  startTimer() {
    this.startTime = Date.now();
    this.timer = setInterval(this.update, 10);
  }

  update() {
    const { runningTime } = this.state;
    var delta = Date.now() - this.startTime;
    this.setState({ runningTime: runningTime + delta });
    this.startTime = Date.now();
  }

  stopTimer() {
    const { lapTimes, runningTime } = this.state;
    this.setState({
      lapTimes: lapTimes.concat(runningTime),
      runningTime: 0
    });
    clearInterval(this.timer);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { runningTime, isCounting } = this.state;
    return (
      <div id="timer-main">
        <h4>{isCounting && <TimeElapsed runningTime={runningTime} />}</h4>
        {isCounting && (
          <p>
            The restroom door has been closed for as many seconds as you see
            above. <br /> <br />
            {runningTime / 1000 < 60
              ? `Likely just a pee, so far...`
              : `uh-oh could be a poo, at this point`}
          </p>
        )}
      </div>
    );
  }
}

export default Timer;
