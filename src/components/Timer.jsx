import React, { Component } from "react";
import TimeElapsed from "./TimeElapsed";
import { timerUpdate } from "../api/connect";
import "../styles/timer.css";

class Timer extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isCounting: false,
            runningTime: 0,
            lapTimes: []
        };
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._isMounted) {
            timerUpdate((isCounting, runTime) => {
                let newLapTimes = [];
                if (isCounting) {
                    this.setState({
                        isCounting: isCounting,
                        runningTime: runTime
                    });
                } else {
                    newLapTimes.push(this.state.runningTime);
                    this.setState({
                        isCounting: isCounting,
                        runningTime: runTime,
                        lapTimes: newLapTimes
                    });
                    this.props.callbackFromParent(this.state.lapTimes[this.state.lapTimes.length - 1]);
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        timerUpdate((isCounting, runTime) => {
            this.setState({
                isCounting: false,
                runningTime: 0
            });
        });
    }

    render() {
        const { runningTime, isCounting } = this.state;
        return (
            <div id="timer-main">
                <h4 id="time-display">
                    {isCounting && <TimeElapsed runningTime={runningTime} />}
                </h4>
                {isCounting && (
                    <p>
                        Restroom door has been closed for duration above. <br />{" "}
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
