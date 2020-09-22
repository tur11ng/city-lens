import React, { Component } from 'react'
import Api from './Api'

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export class ActivitiesInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      lastUpload: '',
      uploadIntervalFrom: '',
      uploadIntervalTo: '',
    }
  }

  componentDidMount () {
    Api.activitiesLastUpload().then((res) => {
      console.log(res)
      this.setState({ lastUpload: res.data.lastUpload })
    })

    Api.activitiesInterval().then((res) => {
      console.log(res)
      this.setState({
        uploadIntervalFrom: res.data[0].start,
        uploadIntervalTo: res.data[0].end,
      })
    })
  }

  formatDate (str) {
    return new Date(str).toLocaleString('en-US', options)
  }

  render () {
    return (
      <div>
        <h3>Info</h3>
        <h5>Last upload was on {this.formatDate(this.state.lastUpload)}</h5>
        <h5>Activities interval from {this.formatDate(
          this.state.uploadIntervalFrom)} to {this.formatDate(
          this.state.uploadIntervalTo)}</h5>
      </div>
    )
  }
}