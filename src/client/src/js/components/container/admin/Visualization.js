import React, { Component } from 'react'
import 'leaflet-lasso'
import { Col, Container, Row } from 'react-bootstrap'
import { HeatmapVisualization } from './HeatmapVisualization'
import Api from './Api'

const download = require('downloadjs')

export class Visualization extends Component {

  constructor (props) {
    super(props)
    this.state = {}

    this.toggleYearSelect = this.toggleYearSelect.bind(this)
    this.toggleDOWSelect = this.toggleDOWSelect.bind(this)
    this.toggleHourSelect = this.toggleHourSelect.bind(this)
  }

  componentDidMount () {
    $('.selectpicker').selectpicker()
  }

  buildYear () {
    let arr = []

    for (let i = 2000; i <= 2020; i++) {
      arr.push(<option>{i}</option>)
    }

    return arr
  }

  buildDay () {
    let arr = []

    for (let i = 1; i <= 7; i++) {
      arr.push(<option>{i}</option>)
    }

    return arr
  }

  buildHour () {
    let arr = []

    for (let i = 1; i <= 24; i++) {
      arr.push(<option>{i}</option>)
    }

    return arr
  }

  toggleYearSelect (e) {
    $('#fromYear').prop('disabled', !e.target.checked)
    $('#fromYear').selectpicker('refresh')
    $('#toYear').prop('disabled', !e.target.checked)
    $('#toYear').selectpicker('refresh')

    if (!e.target.checked) {
      this.setState({
        fromYear: undefined,
        toYear: undefined,
        fromYear1: this.state.fromYear,
        toYear1: this.state.toYear,
      })
    } else {
      this.setState(
        { fromYear: this.state.fromYear1, toYear: this.state.toYear1 })
    }
  };

  toggleDOWSelect (e) {
    $('#fromDOW').prop('disabled', !e.target.checked)
    $('#fromDOW').selectpicker('refresh')
    $('#toDOW').prop('disabled', !e.target.checked)
    $('#toDOW').selectpicker('refresh')

    if (!e.target.checked) {
      this.setState({
        fromDOW: undefined,
        toDOW: undefined,
        fromDOW1: this.state.fromDOW,
        toDOW1: this.state.toDOW,
      })
    } else {
      this.setState({ fromDOW: this.state.fromDOW1, toDOW: this.state.toDOW1 })
    }
  };

  toggleHourSelect (e) {
    $('#fromHour').prop('disabled', !e.target.checked)
    $('#fromHour').selectpicker('refresh')
    $('#toHour').prop('disabled', !e.target.checked)
    $('#toHour').selectpicker('refresh')

    if (!e.target.checked) {
      this.setState({
        fromHour: undefined,
        toHour: undefined,
        fromHour1: this.state.fromHour,
        toHour1: this.state.toHour,
      })
    } else {
      this.setState(
        { fromHour: this.state.fromHour1, toHour: this.state.toHour1 })
    }
  };

  render () {
    return (
      <Container fluid="md" className="text-center">
        <h1 className="text-center">Visualization</h1>
        <form>
          <Row className="justify-content-center">
            <Col>
              <select id="activitiesTypes" className="selectpicker" multiple
                      data-actions-box="true"
                      onChange={this.activitiesTypesChanged}
                      title="Select activities...">
                <option>STILL</option>
                <option>ON_FOOT</option>
                <option>WALKING</option>
                <option>ON_BICYCLE</option>
                <option>ON_VEHICLE</option>
                <option>TILTING</option>
                <option>EXITING_VEHICLE</option>
              </select>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm="9" md="4">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox"
                       id="inlineCheckbox1"
                       value="option1" onChange={this.toggleYearSelect}
                       defaultChecked/>
                <label className="form-check-label" htmlFor="inlineCheckbox1">Filter
                  by year</label>
              </div>
            </Col>
            <Col sm="9" md="4">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox"
                       id="inlineCheckbox2"
                       value="option2" onChange={this.toggleDOWSelect}
                       defaultChecked/>
                <label className="form-check-label" htmlFor="inlineCheckbox2">Filter
                  by day of
                  week</label>
              </div>
            </Col>

            <Col sm="9" md="4">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox"
                       id="inlineCheckbox3" value="option3"
                       onChange={this.toggleHourSelect} defaultChecked/>
                <label className="form-check-label" htmlFor="inlineCheckbox3">Filter
                  by hour</label>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm="9" md="4">
              <select id="fromYear" className="selectpicker"
                      onChange={this.fromYearChanged}
                      title="From year...">
                {this.buildYear()}
              </select>
            </Col>
            <Col sm="9" md="4">
              <select id="fromDOW" className="selectpicker"
                      onChange={this.fromDOWChanged}
                      title="From week...">
                {this.buildDay()}
              </select>
            </Col>
            <Col sm="9" md="4">
              <select id="fromHour" className="selectpicker"
                      onChange={this.fromHourChanged}
                      title="From hour...">
                {this.buildHour()}
              </select>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm="9" md="4">
              <select id="toYear" className="selectpicker"
                      onChange={this.toYearChanged}
                      title="To year...">
                {this.buildYear()}
              </select>
            </Col>
            <Col sm="9" md="4">
              <select id="toDOW" className="selectpicker"
                      onChange={this.toDOWChanged} title="To week...">
                {this.buildDay()}
              </select>
            </Col>
            <Col sm="9" md="4">
              <select id="toHour" className="selectpicker"
                      onChange={this.toHourChanged}
                      title="To hour...">
                {this.buildHour()}
              </select>
            </Col>
          </Row>
        </form>
        <hr/>
        <form>
          <Row className="justify-content-center">
            <select id="exportFormat" className="selectpicker"
                    title="Select export format..."
                    onChange={this.onExportFormatChange}>
              <option>XML</option>
              <option>JSON</option>
              <option>CSV</option>
            </select>
          </Row>
        </form>
        <hr/>
        <HeatmapVisualization {...this.state}/>
      </Container>
    )
  }

  onExportFormatChange = (e) => {
    Api.activities({ ...this.state, export: true }).then((res) => {
      console.log(res)
      download(res.data, 'data.'.concat($('#exportFormat').val()), 'text/plain')
    })
  }

  activitiesTypesChanged = (e) => {
    this.setState({ activitiesTypes: $('#activitiesTypes').val() })
  }
  toYearChanged = (e) => {
    this.setState({ toYear: e.target.value })
  }

  fromYearChanged = (e) => {
    this.setState({ fromYear: e.target.value })
  }

  fromDOWChanged = (e) => {
    this.setState({ fromDOW: e.target.value })
  }

  toDOWChanged = (e) => {
    this.setState({ toDOW: e.target.value })
  }

  toHourChanged = (e) => {
    this.setState({ toHour: e.target.value })
  }

  fromHourChanged = (e) => {
    this.setState({ fromHour: e.target.value })
  }
}