import React, { Component } from 'react'
import { Preprocessor } from '../../../shared/Preprocessor'
import * as turf from '@turf/turf'
import 'leaflet-lasso'
import pointsWithinPolygon from '@turf/points-within-polygon'
import Api from './Api'

const position = [21.753150, 38.230462]
const position1 = [38.230462, 21.753150]

const axios = require('axios')
let map = null

export class Upload extends Component {

  constructor (props) {
    super(props)
    this.state = {
      file: '',
      geoJSONLayer: null,
      geoJSON: null,
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)

    this.fileReader = new FileReader()
    this.fileReader.onload = e => {
      let preprocessor = new Preprocessor()
      let result = preprocessor.parse(JSON.parse(e.target.result))
      let geoJSON = turf.sample(result, result.features.length * 0.01)

      let center = position
      let radius = 10
      let options = { steps: 10, units: 'kilometers' }
      let circle = turf.circle(center, radius, options)
      let markerWithin = pointsWithinPolygon(geoJSON, circle)

      let geoJSONLayer = L.geoJSON().addTo(map)
      geoJSONLayer.addData(markerWithin)
      this.setState({ geoJSON: markerWithin, geoJSONLayer: geoJSONLayer })
    }
  }

  onChange (e) {
    this.setState({ file: e.target.files[0] }, () => {
      this.fileReader.readAsText(this.state.file)
    })
  }

  onFormSubmit (e) {
    e.preventDefault()
    Api.uploadActivities(this.state.geoJSON).then(r => console.log('OK'))
  }

  componentDidMount () {
    map = L.map('map').setView(position1, 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      selectArea: true, // will enable it by default
    }).addTo(map)

    map.selectArea.enable()

    map.on('areaselected', (e) => {
      let bbox = e.bounds.toBBoxString().split(',')
      bbox.forEach((value) => parseInt(value, 10))
      let polygon = turf.bboxPolygon(bbox)

      let markerWithin = this.state.geoJSON

      for (let i = markerWithin.features.length - 1; i >= 0; i--) {
        if (turf.booleanPointInPolygon(
          markerWithin.features[i].geometry.coordinates, polygon)) {
          markerWithin.features.splice(i, 1)
        }
      }

      this.state.geoJSONLayer.remove()
      let geoJSONLayer = L.geoJSON().addTo(map)
      geoJSONLayer.addData(markerWithin)

      this.setState({ geoJSON: markerWithin, geoJSONLayer: geoJSONLayer })
    })
  }

  render () {
    return (
      <div className="text-center">
        <form onSubmit={this.onFormSubmit}
              className="custom-file justify-content-md-center mt-2">
          <h1>Upload</h1>
          <p>This is a community based project. It means that it is based on
            users voluntarily sharing their
            data.
            You can help keep the system updated by uploading your
            own recent activity. If you don't know how to export your checkout
            FAQ</p>
          <hr/>
          <h3>1. Choose file</h3>
          <p>Depending on the size of your file, your file will be sampled
            before upload.</p>
          <input
            id="file"
            type="file"
            name="selectedFile"
            onChange={this.onChange}
          />
          <hr/>
          <h3>2. Select areas to exclude</h3>
          <p>Using the lasso tool on the top right of the map you can select
            multiple areas to be excluded
            from the data being uploaded. Depending on the size of your file,
            only a small (and hopefully
            representative) sample of the data is shown on the map</p>
          <div className="mt-3" id="map"/>
          <hr/>
          <button type="submit" className="btn btn-success col-md-auto">Upload
          </button>
        </form>
      </div>
    )
  }
}