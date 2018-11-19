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

  //   shouldComponentUpdate(nextProps) {
  //     if (this.props.value !== nextProps.value) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

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
      sum = sum / pCount;
      return sum;
    }, 0);
    // console.log(pCount, avgTime);
    const columns = [
      {
        getFooterProps: (state, rowInfo, column) => {
          return {
            style: {
              color: rowInfo.row.name === "Total: 1" ? "red" : null
            }
          };
        },
        Header: `Restroom Data for ${this.props.date}`,
        columns: [
          {
            Header: "Session",
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
                <strong>Average: {(avgTime / 1000).toFixed(2)}</strong>
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
            noDataText="oh no, cannot find data"
            defaultPageSize={5}
            data={this.state.data}
            columns={columns}
          />
        </div>
      </div>
    );
  }
}

export default LapTimes;
