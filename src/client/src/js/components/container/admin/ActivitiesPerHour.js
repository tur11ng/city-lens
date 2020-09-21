import React, {Component} from "react";
import Api from "./Api";
import {BarChart} from "../../presentational/charts/BarChart";
import {HOURS} from "../../../shared/Helpers";

export class ActivitiesPerHour extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLabels: [],
            dataPoints: [],
            datasetLabel: 'Activities per hour'
        };
    }

    componentDidMount() {
        Api.activitiesPerHour().then((res) => {
            let data = new Array(24).fill(0);
            for (let e of res.data) {
                data[e.hour - 1] = e.count;
            }
            this.setState({dataLabels: HOURS, dataPoints: data});
        });
    }

    render() {
        return (<BarChart dataLabels={this.state.dataLabels} dataPoints={this.state.dataPoints} datasetLabel={this.state.datasetLabel}/>);
    }
}