import React, { Component } from 'react'
import Api from './Api'

export class Management extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    $('.selectpicker').selectpicker()
  }

  cleanUp = (e) => {
    Api.deleteDatabase().then((res) => {console.log('Database deleted;')})
  }

  render () {
    return (<div className="text-center">
      <h1>Management</h1>
      <h3>Clean up database</h3>
      <p>By cleaning up the database all the users and their data will be
        deleted except from your admin
        account.</p>
      <button type="button" className="btn btn-danger" data-toggle="modal"
              data-target="#exampleModal">
        Clean up
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal
                title</h5>
              <button type="button" className="close" data-dismiss="modal"
                      aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure that you want to delete all the data from the
                database?
              </p>
              <p>
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary"
                      data-dismiss="modal">Close
              </button>
              <button type="button" className="btn btn-danger"
                      onClick={this.cleanUp}>Clean up
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr/>
    </div>)
  }
}