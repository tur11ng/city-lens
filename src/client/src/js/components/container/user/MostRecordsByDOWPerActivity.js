import React, {Component} from "react";
import Api from "./Api";
import * as turf from "@turf/turf";
import {DOW} from "../../../shared/Helpers";

export default class MostRecordsByDOWPerActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            Api.mostRecordsByDOWPerActivity(this.props).then((res) => {
                const items = []
                console.log(res);
                for (let value of res.data) {
                    items.push(
                        <tr>
                            <td>{value.type}</td>
                            <td>{DOW[value.dayOfWeek-1]}</td>
                            <td>{value.count}</td>
                        </tr>
                    );
                }
                this.setState({items: items}, () => console.log(this.state));
            });
        }
    }

    render() {
        return (<div>
            <h5>Most records by day of week per activity</h5>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Type of Activity</th>
                    <th scope="col">Day of week with the most records</th>
                    <th scope="col">Number of activities</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.items}
                </tbody>
            </table>
        </div>);
    }
}