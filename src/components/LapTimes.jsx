import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../styles/laptimes.css";

class LapTimes extends Component {
    constructor(props) {
        super(props);
        this.tableData = [];
        this.state = {
            laps: [],
            data: []
        };
    }

    componentDidMount() {
        this.setState({
            data: this.tableData
        });
    }

    render() {
        const { lapTimes } = this.props;
        let lapTotalTimes = 0.0;
        let avgTime = 0.0;

        lapTimes.map(
            (current, i) =>
            (this.tableData[i] = {
                [`count`]: i + 1,
                [`time`]: (current / 1000).toFixed(2)
            })
        );

        lapTimes.forEach(lapTime => lapTotalTimes += lapTime);
        avgTime = (lapTotalTimes / lapTimes.length) / 1000;

        const columns = [
            {
                Header: `${this.props.date}`,
                columns: [
                    {
                        Header: "Session",
                        accessor: "count",
                        Footer: (
                            <span>
                                <strong>Total: {this.tableData.length}</strong>
                            </span>
                        )
                    },
                    {
                        Header: "Time",
                        accessor: "time",
                        id: d => d.time,
                        Footer: (
                            <span>
                                <strong>Average: {(avgTime).toFixed(2)}</strong>
                            </span>
                        )
                    }
                ]
            }
        ];

        return (
            <div>
                <div id="scroll-tbl">
                    <ReactTable
                        className="-striped -highlight"
                        noDataText="oh no, cannot find data"
                        defaultPageSize={10}
                        data={this.state.data}
                        columns={columns}
                    />
                </div>
            </div>
        );
    }
}

export default LapTimes;
