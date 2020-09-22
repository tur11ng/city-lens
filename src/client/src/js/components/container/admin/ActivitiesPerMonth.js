import React, { Component } from 'react'
import Api from './Api'
import { BarChart } from '../../presentational/charts/BarChart'
import { MONTHS } from '../../../shared/Helpers'

export class ActivitiesPerMonth extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dataLabels: [],
      dataPoints: [],
      datasetLabel: 'Activities per month',
    }
  }

  componentDidMount () {
    Api.activitiesPerMonth().then((res) => {
      let data = new Array(12).fill(0)
      for (let e of res.data) {
        data[e.month - 1] = e.count
      }
      this.setState({ dataLabels: MONTHS, dataPoints: data })
    })
  }

  render () {
    return (<BarChart dataLabels={this.state.dataLabels}
                      dataPoints={this.state.dataPoints}
                      datasetLabel={this.state.datasetLabel}/>)
  }
}