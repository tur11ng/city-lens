import React, { Component } from 'react'
import Api from './Api'
import * as turf from '@turf/turf'
import { Heatmap } from '../../presentational/Heatmap'

export class HeatmapVisualization extends Component {
  constructor (props) {
    super(props)
    this.state = { params: props }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      Api.activities(this.props).then((res) => {
        let data = []
        turf.featureEach(turf.featureCollection(res.data), (feature) => {
          data.push({
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            count: 1,
          })
        })
        this.setState({ data: data })
      })
    }
  }

  componentDidMount () {

  }

  render () {
    return (<Heatmap data={this.state.data}/>)
  }
}