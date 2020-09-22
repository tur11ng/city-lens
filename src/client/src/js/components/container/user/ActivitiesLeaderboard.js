import React, { Component } from 'react'
import Api from './Api'

export class ActivitiesLeaderboard extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    Api.activitiesLeaderboard().then((res) => {
      if (res.data.length !== 0) this.setState({ leaderboard: res.data })
    })
  }

  render () {
    return (
      <div>
        <h3>Leaderboard</h3>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Overall eco score</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>{this.state.leaderboard
              ? this.state.leaderboard[0].name
              : ''}</td>
            <td>{this.state.leaderboard
              ? this.state.leaderboard[0].ecoScore.overall
              : ''}</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>{this.state.leaderboard && this.state.leaderboard.length >= 2
              ? this.state.leaderboard[1].name
              : ''}</td>
            <td>{this.state.leaderboard && this.state.leaderboard.length >= 2
              ? this.state.leaderboard[1].ecoScore.overall
              : ''}</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>{this.state.leaderboard && this.state.leaderboard.length >= 3
              ? this.state.leaderboard[2].name
              : ''}</td>
            <td>{this.state.leaderboard && this.state.leaderboard.length >= 3
              ? this.state.leaderboard[2].ecoScore.overall
              : ''}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}