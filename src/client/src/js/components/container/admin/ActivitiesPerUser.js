import React, {Component} from "react";
import Api from "./Api";
import {BarChart} from "../../presentational/charts/BarChart";
import {DoughnutChart} from "../../presentational/charts/DoughnutChart";

export class ActivitiesPerUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLabels: [],
            dataPoints: [],
            datasetLabel: 'Activities per user'
        };
    }

    componentDidMount() {
        Api.activitiesPerUser().then((res) => {
            console.log(res);
            this.setState({dataLabels: res.data.map(r => r.name), dataPoints: res.data.map(r => r.count)});
        });
    }

    render() {
        return (<DoughnutChart dataLabels={this.state.dataLabels} dataPoints={this.state.dataPoints} datasetLabel={this.state.datasetLabel}/>);
    }
}