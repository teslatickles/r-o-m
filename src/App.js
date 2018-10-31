import React, { Component } from "react";
import Timer from "./components/Timer";
import LapTimes from "./components/LapTimes";
import { Column, Row } from "simple-flexbox";
import firebase from "firebase";
import Loading from "./components/Loading";
import "./App.css";
import chartLogo from "../src/statistics.svg";
import {
  connect,
  checkDoorStatus,
  getToday,
  getDoorCount
} from "../src/api/connect";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA595Cjxncp2PTuJWMiwiBoInUdTLsxy0o",
  authDomain: "r-o-m-database.firebaseapp.com",
  databaseURL: "https://r-o-m-database.firebaseio.com",
  projectId: "r-o-m-database",
  storageBucket: "r-o-m-database.appspot.com",
  messagingSenderId: "751184942048"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.counter = 0;
    this.state = {
      today: null,
      connectedUsers: 0,
      pCount: 0,
      doorOpen: null,
      lapsFromTimer: [
        35.55 * 1000,
        55.75 * 1000,
        98.85 * 1000,
        32 * 1000,
        45.23 * 1000,
        54.43 * 1000,
        119.21 * 1000
      ]
    };
    this.logRef = firebase.database().ref("log");
  }

  componentDidMount() {
    connect(result => {
      this.setState({
        connectedUsers: result
      });
      //   console.log(result);
    });
    checkDoorStatus(result => {
      this.setState({
        doorOpen: result
      });
      //   console.log(result);
    });
    getToday(result => {
      this.setState({
        today: result
      });
      console.log(result);
    });
    getDoorCount(result => {
      this.setState({
        pCount: result
      });
      //   console.log(result);
    });
    this.logRef.on("child_added", snapshot => {
      const lap = snapshot.val();
      lap.key = snapshot.key;
      // concat(lap) or lap.lap ??
      this.setState({
        lapsFromTimer: this.state.lapsFromTimer.concat(lap.lap)
      });
    });
  }

  // fixed date w/o time being pushed before/with first session laptime/date data
  getDataFromTimer = data => {
    const { today } = this.state;
    console.log(this.state.today);
    const formattedData = data.length < 1 ? null : data.slice(-1).pop();
    this.logRef.push({
      lap: formattedData,
      date: data.length < 1 ? null : today
    });
    console.log("help:", data, data.slice(-1).pop());
  };

  render() {
    const {
      connectedUsers,
      today,
      doorOpen,
      pCount,
      lapsFromTimer
    } = this.state;
    var arraydata = [];
    lapsFromTimer.reduce(
      (x, current, i) =>
        (arraydata[i] = {
          ...x,
          [`count`]: i + 1,
          [`time`]: current / 1000
        }),
      {}
    );
    if (!connectedUsers) {
      return <Loading />;
    } else {
      return (
        <div className="container">
          <header className="App-header">
            There are currently {connectedUsers} people viewing this app!
          </header>
          <Row vertical="center" horizontal="center">
            <Column>
              <span>
                <div id="door-state">
                  {doorOpen ? (
                    <h3>
                      You are free to try to <span id="pee">pee</span>
                      ... or <span id="poop">poop</span>
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
                    src="https://png.icons8.com/ios/1600/toilet-paper.png"
                    alt="stylized icon of tp"
                  />
                )}
              </span>
            </Column>
          </Row>
          <Row vertical="center" horizontal="start">
            <div className="chart-div">
              {this.state.lapsFromTimer < 1 ? (
                <>
                  <h5 id="no-chart-txt">
                    There is currently no data to display!
                  </h5>
                  <img
                    id="no-chart-img"
                    src={chartLogo}
                    alt="no chart data pic"
                  />
                </>
              ) : (
                <span id="chart">
                  <ResponsiveContainer width="90%" height={255} debounce={1}>
                    <LineChart
                      data={arraydata}
                      margin={{ top: 15, right: 10, left: 10, bottom: 15 }}
                    >
                      <XAxis dataKey="count" />
                      <YAxis />
                      <CartesianGrid strokeDasharray=" 5" />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine
                        y={60}
                        label="Likely a poop"
                        stroke="#6ab04c"
                      />
                      <Line
                        type="monotone"
                        dataKey="time"
                        stroke="#8884d8"
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </span>
              )}
            </div>
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
          {/* <footer>I have been rendered {++this.counter} times</footer> */}
        </div>
      );
    }
  }
}

export default App;
