import React, { Component } from 'react'
import { BarChart } from '../../presentational/charts/BarChart'
import Api from './Api'
import { MONTHS } from '../../../shared/Helpers'

export class EcoScore extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dataLabels: [],
      dataPoints: [],
      datasetLabel: 'Eco score per month',
      overall: 0,
      options: {
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: MONTHS[new Date().getMonth()],
              borderColor: 'red',
              label: {
                content: 'TODAY',
                enabled: true,
                position: 'top',
              },
            },
          ],
        },
      },
    }
  }

  componentDidMount () {
    Api.ecoScore().then((res) => {
      console.log(res)
      this.setState({
        dataLabels: MONTHS,
        dataPoints: res.data.ecoScore.history,
        overall: res.data.ecoScore.overall,
      })
    })
  }

  render () {
    //TODO eco score to % percent
    return (<div>
      <h3>History</h3>
      <BarChart dataLabels={this.state.dataLabels}
                dataPoints={this.state.dataPoints}
                datasetLabel={this.state.datasetLabel}
                options={this.state.options}/>
      <h5>Eco score: {this.state.overall}</h5>
    </div>)

  }
}