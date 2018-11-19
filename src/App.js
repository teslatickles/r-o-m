import React, { Component } from "react";
import Timer from "./components/Timer";
import LapTimes from "./components/LapTimes";
import { Column, Row } from "simple-flexbox";
import firebase from "firebase";
import Loading from "./components/Loading";
import "./App.css";
import chartLogo from "../src/statistics.svg";
// import footerImg from "../src/balloon.svg";
import footerLogo from "../src/responsive.gif";
import Octocat from "../src/Octocat.png";

import {
  connect,
  checkDoorStatus,
  getToday,
  getDoorCount
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

import whyDidYouUpdate from "why-did-you-update";
whyDidYouUpdate(React);
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
    // this pushes to firebase -- careful, needs to be fixed
    // this.logRef.push({
    //   lap: formattedData,
    //   date: data.length < 1 ? null : today
    // });
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
      return (
        <Row vertical="center" horizontal="center">
          <Column>
            <div className="container">
              <Loading id="loading-icon" />
            </div>
          </Column>
        </Row>
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
                  Welcome to the Restroom Occupancy Monitor
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
                    src="http://rs557.pbsrc.com/albums/ss15/aedrielyve/animated%20gifs/kawaiitoiletpaper.gif~c200"
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
                    <img
                      id="no-chart-img"
                      src={chartLogo}
                      alt="no chart data pic"
                    />
                  </>
                ) : (
                  <span id="chart">
                    <ResponsiveContainer width="95%" height={255} debounce={1}>
                      <AreaChart
                        data={arraydata}
                        margin={{ top: 21, right: 34, left: 38, bottom: 40 }}
                      >
                        <XAxis dataKey="count" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="1" />
                        {/* <Tooltip
                        animationEasing="linear"
                        viewBox={{ width: 25, height: 25 }}
                      /> */}
                        <Legend width={"95%"} />
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
                {/* <button id="footer-button">
                  <img
                    id="balloon"
                    src={footerImg}
                    alt="balloon icon for footer menu"
                  />
                </button> */}
                {/* <div>
                  <img
                    id="footer-logo"
                    src={footerLogo}
                    alt="responsive design logo at footer"
                  />
                </div> */}
                {/* this render counter is not correctly implemented for production use! needs to be in state */}
                <div id="footer-text">
                  I have been rendered {++this.counter} times
                </div>
                <div id="copyright-text">
                  copyright @ teslatickles [hunterhartline@gmail.com] 2018
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
