import React, { Component } from 'react'
import { BarChart } from '../../presentational/charts/BarChart'
import Api from './Api'

export class ActivitiesPerYear extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dataLabels: [],
      dataPoints: [],
      datasetLabel: 'Activities per year',
    }
  }

  componentDidMount () {
    Api.activitiesPerYear().then((res) => {
      this.setState({
        dataLabels: res.data.map(r => r.year),
        dataPoints: res.data.map(r => r.count),
      })
    })
  }

  render () {
    return (<BarChart dataLabels={this.state.dataLabels}
                      dataPoints={this.state.dataPoints}
                      datasetLabel={this.state.datasetLabel}/>)
  }
}