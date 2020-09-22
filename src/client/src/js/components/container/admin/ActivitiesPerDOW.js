import React, { Component } from 'react'
import Api from './Api'
import { BarChart } from '../../presentational/charts/BarChart'
import { DOW } from '../../../shared/Helpers'

export class ActivitiesPerDOW extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dataLabels: [],
      dataPoints: [],
      datasetLabel: 'Activities per day of week',
    }
  }

  componentDidMount () {
    Api.activitiesPerDOW().then((res) => {
      let data = new Array(7).fill(0)
      for (let e of res.data) {
        data[e.dayOfWeek - 1] = e.count
      }
      this.setState({ dataLabels: DOW, dataPoints: data })
    })
  }

  render () {
    return (<BarChart dataLabels={this.state.dataLabels}
                      dataPoints={this.state.dataPoints}
                      datasetLabel={this.state.datasetLabel}/>)
  }
}