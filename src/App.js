import React, { Component } from "react";
import Timer from "../src/components/Timer";
import LapTimes from "./components/LapTimes";
import { connect, checkDoorStatus } from "../src/api/connect";
import firebase from "firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import "./App.css";

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

    this.state = {
      connectedUsers: 0,
      pCount: 0,
      doorOpen: Boolean,
      lapsFromTimer: []
    };
    connect(result => {
      this.setState({
        connectedUsers: result
      });
    });
    this.logRef = firebase.database().ref("log");
  }

  getDataFromTimer = data => {
    this.setState({
      lapsFromTimer: data
    });

    // this.logRef.push({ name: arraydata.name, time: arraydata.time });
  };

  componentDidMount() {
    checkDoorStatus(result => {
      this.setState({
        doorOpen: result
      });
      if (!this.state.doorOpen) {
        this.setState({
          pCount: this.state.pCount + 1
        });
      }
    });
  }

  render() {
    let arraydata = [];
    const { connectedUsers, doorOpen, lapsFromTimer } = this.state;
    console.log(arraydata);
    lapsFromTimer.reduce(
      (x, current, i) =>
        (arraydata[i] = { ...x, [`name`]: i + 1, [`time`]: current / 1000 }),
      {}
    );
    return (
      <div className="App">
        <header className="App-header">
          {doorOpen ? `Bathroom door is OPEN ` : `Bathroom door is CLOSED`} --
          There are currently {connectedUsers} people viewing this app!
        </header>
        <div id="door-state">
          {this.state.doorOpen ? (
            <h3>
              You are free to try to <span id="pee">pee</span>
              ... or <span id="poop">poop</span>
            </h3>
          ) : (
            <h3>Your pee and poop will have to remain in you</h3>
          )}
        </div>
        <div id="chart">
          <LineChart
            width={700}
            height={300}
            data={arraydata}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <ReferenceLine y={60} label="Likely a poop" stroke="#fdcb6e" />
            <Line
              type="monotone"
              dataKey="time"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <LapTimes lapTimes={lapsFromTimer} />
          <Timer callbackFromParent={this.getDataFromTimer} />
        </div>
      </div>
    );
  }
}

export default App;
