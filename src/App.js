import React, { Component } from "react";
import Timer from "./components/Timer";
import LapTimes from "./components/LapTimes";
import { Column, Row } from "simple-flexbox";
import firebase from "firebase";
import Loading from "./components/Loading";
// import chartLogo from "../src/statistics.svg";
import Octocat from "../src/Octocat.png";
import "./App.css";

import {
    connect,
    checkDoorStatus,
    getToday
} from "../src/api/connect";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
    ReferenceLine
} from "recharts";

const fireBaseConfig = {
    credential: '',
    databaseURL: 'https://r-o-m-database.firebaseio.com/'
};
firebase.initializeApp(fireBaseConfig);

class App extends Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            today: null,
            connectedUsers: 0,
            pCount: 0,
            doorOpen: null,
            lapsFromTimer: [],
        };
        this.logRef = firebase.database().ref("log");
    }

    componentDidMount() {
        connect(result => {
            this.setState({
                connectedUsers: result
            });
        });
        checkDoorStatus(result => {
            this.setState({
                doorOpen: result
            });
        });
        getToday(result => {
            this.setState({
                today: result
            });
        });

        this.logRef.once('value', snap => {
            let items = [];
            snap.forEach((child) => {
                let lap = child.val();
                lap.key = child.key;

                items.push(lap.lap);
            })
            this.setState({
                lapsFromTimer: items
            });
        }).catch(err => console.log(err));
    }

    componentWillUnmount() {
        this.logRef.off();
        checkDoorStatus(result => {
            this.setState({
                doorOpen: result
            });
        });
        getToday(result => {
            this.setState({
                today: result
            });
        });
    }

    getDataFromTimer = (data, callSetState) => {
        const { today } = this.state;
        const formattedData = data !== 0 ? data : null;

        // attempt to handle duplicate writes of timer to Firestore
        this.logRef.off();
        this.logRef.push({
            lap: formattedData,
            date: data.length < 1 ? null : today
        }).then(() => this.logRef.off())
            .catch(err => console.log(err));

        this.setState({
            lapsFromTimer: this.state.lapsFromTimer.concat(formattedData)
        });
    };

    render() {
        const {
            connectedUsers,
            today,
            doorOpen,
            pCount,
            lapsFromTimer
        } = this.state;
        let arraydata = [];
        lapsFromTimer.reduce(
            (x, current, i) =>
            (arraydata[i] = {
                ...x,
                [`count`]: i + 1,
                [`time`]: current / 1000
            }),
            {}
        );
        const divStyle = {
            overflowY: 'hidden'
        };

        if (!connectedUsers) {
            return (
                <div style={divStyle}>
                    <a href="https://github.com/teslatickles/r-o-m/">
                        <Row vertical="center" horizontal="center">
                            <Column>
                                <div className="container-variant-loading">
                                    <Loading id="loading-icon" />
                                </div>
                            </Column>
                        </Row>
                    </a>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <header className="App-header">
                        There are currently {connectedUsers} people viewing this app!
          </header>
                    <Row vertical="center" horizontal="center">
                        <Column>
                            <span>
                                <div id="welcome-msg">
                                    Restroom Occupancy Monitor
                </div>
                            </span>
                        </Column>
                    </Row>
                    <Row vertical="center" horizontal="center">
                        <Column>
                            <span>
                                <div id="door-state">
                                    {doorOpen ? (
                                        <h3>
                                            You Are Free To Try To <span id="pee">Pee </span>
                      or <span id="poop">Poop</span>
                                        </h3>
                                    ) : (
                                            <h3>Your pee and poop will have to remain in you</h3>
                                        )}
                                </div>
                            </span>
                        </Column>
                    </Row>
                    <Row vertical="center" horizontal="center">
                        <Column vertical="end">
                            <span id="tp-timer-tx">
                                {!doorOpen ? (
                                    <Timer
                                        className="timerUI"
                                        callbackFromParent={this.getDataFromTimer}
                                    />
                                ) : (
                                        <img
                                            id="tp-img"
                                            src="https://i0.wp.com/media.giphy.com/media/KyEvGfLt6ZjhlLmxFz/giphy.gif"
                                            alt="stylized icon of tp"
                                        />
                                    )}
                            </span>
                        </Column>
                    </Row>
                    <Row vertical="center" horizontal="center">
                        <Column>
                            <h4 id="chart-title">Restroom Results</h4>
                        </Column>
                    </Row>
                    <br />
                    <Row vertical="center" horizontal="start">
                        <Column>
                            <div className="chart-div">
                                {this.state.lapsFromTimer < 1 ? (
                                    <>
                                        <h5 id="no-chart-txt">
                                            There is currently no data to display!
                    </h5>
                                        {/* <img
                                            id="no-chart-img"
                                            src={chartLogo}
                                            alt="no chart data pic"
                                        /> */}
                                    </>
                                ) : (
                                        <span id="chart">
                                            <ResponsiveContainer width="95%" height={255} debounce={1}>
                                                <AreaChart
                                                    data={arraydata}
                                                    margin={{ top: 21, right: 34, left: 38, bottom: 10 }}
                                                >
                                                    <XAxis dataKey="count" />
                                                    <YAxis />
                                                    <CartesianGrid strokeDasharray="1" />
                                                    {/* <Tooltip
                                                        animationEasing="linear"
                                                        viewBox={{ width: 10, height: 10 }}
                                                    /> */}
                                                    <Legend width={365} />
                                                    <ReferenceLine
                                                        y={60}
                                                        label="Likely a poop"
                                                        stroke="#3e4e34"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="time"
                                                        stroke="#edd16b"
                                                        activeDot={{ r: 4 }}
                                                        fillOpacity={0.55}
                                                        fill="#fab1a0"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </span>
                                    )}
                            </div>
                        </Column>
                    </Row>
                    <Row vertical="center" horizontal="center">
                        <Column>
                            {!lapsFromTimer ? (
                                <h3>`Loading...`</h3>
                            ) : (
                                    <span>
                                        <LapTimes
                                            className="App-laps"
                                            date={today}
                                            pCount={pCount}
                                            lapTimes={lapsFromTimer}
                                        />
                                    </span>
                                )}
                        </Column>
                    </Row>
                    <Row vertical="center" horizontal="center">
                        <Column id="footer">
                            <footer id="App-footer">
                                <span id="links-span">
                                    <a href="https://gobot.com/">
                                        <img
                                            id="ramen-pack"
                                            src="https://iotinvent.uk/wp-content/uploads/2018/02/PCB-icon.png"
                                            alt="Personal website link"
                                        />
                                    </a>
                                    <a href="https://github.com/teslatickles/r-o-m">
                                        <img id="octocat" src={Octocat} alt="github link" />
                                    </a>
                                    <a href="https://gobot.com/">
                                        <img
                                            id="ramen-pack"
                                            src="https://iotinvent.uk/wp-content/uploads/2018/02/PCB-icon.png"
                                            alt="Personal website link"
                                        />
                                    </a>
                                </span>

                                {/* this render counter is not correctly implemented for production use! needs to be in state */}
                                <div id="footer-text">
                                    I have been rendered {++this.counter} times
                                </div>
                            </footer>
                        </Column>
                    </Row>
                </div>
            );
        }
    }
}

export default App;
