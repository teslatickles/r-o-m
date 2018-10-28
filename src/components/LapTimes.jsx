import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../styles/laptimes.css";

let tableData = [];

class LapTimes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laps: [],
      data: []
    };
  }

  componentDidMount() {
    this.setState({
      data: tableData
    });
  }

  render() {
    const { pCount, lapTimes } = this.props;
    lapTimes.map(
      (current, i) =>
        (tableData[i] = {
          [`count`]: i + 1,
          [`time`]: current / 1000
        })
    );
    // console.log(this.props.lapTimes);
    const avgTime = lapTimes.reduce((sum, lapTime) => {
      sum += lapTime;
      return sum / pCount;
    }, 0);
    const columns = [
      {
        Header: "Restroom Data for:",
        columns: [
          {
            Header: "Session #:",
            accessor: "count",
            Footer: (
              <span>
                <strong>Total: {pCount}</strong>
              </span>
            )
          },
          {
            Header: "Time",
            accessor: "time",
            id: d => d.time,
            Footer: (
              <span>
                <strong>Average: {avgTime}</strong>
              </span>
            )
          }
        ]
      }
    ];
    console.log(this.state.data);
    return (
      <div>
        <div id="scroll-tbl">
          <ReactTable
            className="-striped -highlight"
            data={this.state.data}
            columns={columns}
          />
        </div>
      </div>
    );
  }
}

export default LapTimes;
