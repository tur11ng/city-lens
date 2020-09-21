import React, {Component} from "react";
import "leaflet-lasso";
import {Container, Row, Col, Button} from "react-bootstrap";
import Api from "../admin/Api";
import {DoughnutChart} from "../../presentational/charts/DoughnutChart";
import {ActivitiesPerType} from "./ActivitiesPerType";
import MostRecordsByDOWPerActivity from "./MostRecordsByDOWPerActivity";
import MostRecordsByHourPerActivity from "./MostRecordsByHourPerActivity";
import {HeatmapVisualization} from "../admin/HeatmapVisualization";

export class Visualization extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.toggleYearSelect = this.toggleYearSelect.bind(this);
        this.toggleMonthSelect = this.toggleMonthSelect.bind(this);
    }

    componentDidMount() {
        $('.selectpicker').selectpicker();
    }

    buildYear() {
        let arr = [];

        for (let i = 2000; i <= 2020; i++) {
            arr.push(<option>{i}</option>)
        }

        return arr;
    }

    buildMonth() {
        let arr = [];

        for (let i = 1; i <= 12; i++) {
            arr.push(<option>{i}</option>)
        }

        return arr;
    }

    toggleMonthSelect(e) {
        $("#fromMonth").prop('disabled', !e.target.checked);
        $("#fromMonth").selectpicker('refresh');
        $("#toMonth").prop('disabled', !e.target.checked);
        $("#toMonth").selectpicker('refresh');

        if (!e.target.checked) {
            this.setState({
                fromMonth: undefined,
                toMonth: undefined,
                fromMonth1: this.state.fromMonth,
                toMonth1: this.state.toMonth
            });
        } else {
            this.setState({fromMonth: this.state.fromMonth1, toMonth: this.state.toMonth1})
        }
    };

    toggleYearSelect(e) {
        $("#fromYear").prop('disabled', !e.target.checked);
        $("#fromYear").selectpicker('refresh');
        $("#toYear").prop('disabled', !e.target.checked);
        $("#toYear").selectpicker('refresh');

        if (!e.target.checked) {
            this.setState({
                from: undefined,
                toYear: undefined,
                fromYear1: this.state.fromYear,
                toYear1: this.state.toYear
            });
        } else {
            this.setState({fromYear: this.state.fromYear1, toYear: this.state.toYear1})
        }
    };

    toYearChanged = (e) => {
        this.setState({toYear: e.target.value});
    }

    fromYearChanged = (e) => {
        this.setState({fromYear: e.target.value});
    }

    fromMonthChanged = (e) => {
        this.setState({fromMonth: e.target.value});
    }

    toMonthChanged = (e) => {
        this.setState({toMonth: e.target.value});
    }

    render() {
        return (
            <Container fluid="md" className="text-center">
                <h1 className="text-center">Visualization</h1>
                <form>
                    <Row className="justify-content-center">
                        <Col sm="9" md="6">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1"
                                       value="option1" onChange={this.toggleYearSelect} defaultChecked/>
                                <label className="form-check-label" htmlFor="inlineCheckbox1">Filter by year</label>
                            </div>
                        </Col>
                        <Col sm="9" md="6">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox2"
                                       value="option2" onChange={this.toggleMonthSelect} defaultChecked/>
                                <label className="form-check-label" htmlFor="inlineCheckbox2">Filter by month</label>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col sm="10" md="8" lg="6">
                            <select id="fromYear" className="selectpicker" onChange={this.fromYearChanged}
                                    title="From year...">
                                {this.buildYear()}
                            </select>
                        </Col>
                        <Col sm="10" md="8" lg="6">
                            <select id="fromMonth" className="selectpicker" onChange={this.fromMonthChanged}
                                    title="From month...">
                                {this.buildMonth()}
                            </select>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col sm="10" md="8" lg="6">
                            <select id="toYear" className="selectpicker" onChange={this.toYearChanged}
                                    title="To year...">
                                {this.buildYear()}
                            </select>
                        </Col>
                        <Col sm="10" md="8" lg="6">
                            <select id="toMonth" className="selectpicker" onChange={this.toMonthChanged}
                                    title="To month...">
                                {this.buildMonth()}
                            </select>
                        </Col>
                    </Row>
                </form>
                <hr/>
                <Row className="justify-content-center">
                    <Col sm="10" md="6">
                        <ActivitiesPerType {...this.state}/>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col sm="10" md="8">
                        <MostRecordsByDOWPerActivity  {...this.state}/>
                        <MostRecordsByHourPerActivity {...this.state}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}