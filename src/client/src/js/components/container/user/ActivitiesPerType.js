import React, {Component} from "react";
import Api from "./Api";
import {DoughnutChart} from "../../presentational/charts/DoughnutChart";

export class ActivitiesPerType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLabels: [],
            dataPoints: [],
            datasetLabel: 'Activities per type'
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            Api.activitiesPerType(this.props).then((res) => {
                this.setState({dataLabels: res.data.map(r => r.type), dataPoints: res.data.map(r => r.count)});
            });
        }
    }

    render() {
        return (<DoughnutChart dataLabels={this.state.dataLabels} dataPoints={this.state.dataPoints}
                               datasetLabel={this.state.datasetLabel}/>);
    }
}