import React from 'react'

export function FAQ (props) {

  return (
    <div className="container text-center">
      <h1 className="text-center">Frequently Asked Questions</h1>
      <h2>General questions</h2>
      <div className="accordion" id="accordionExample">
        <div className="card">
          <div className="card-header" id="headingOne">
            <h2 className="mb-0">
              <button className="btn btn-link" type="button"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true" aria-controls="collapseOne">
                What is the goal of the application?
              </button>
            </h2>
          </div>

          <div id="collapseOne" className="collapse show"
               aria-labelledby="headingOne"
               data-parent="#accordionExample">
            <div className="card-body">
              This is a <a
              href="https://en.wikipedia.org/wiki/Crowdsourcing">crowdsourcing</a> application.
              It is based on users voluntarily sharing their activity data. From
              the user's perspective,
              it
              aggregates their data and
              offers a nice environment to visualize and show various statistics
              of them.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header" id="headingTwo">
            <h2 className="mb-0">
              <button className="btn btn-link collapsed" type="button"
                      data-toggle="collapse"
                      data-target="#collapseTwo" aria-expanded="false"
                      aria-controls="collapseTwo">
                Is account registration required?
              </button>
            </h2>
          </div>
          <div id="collapseTwo" className="collapse"
               aria-labelledby="headingTwo"
               data-parent="#accordionExample">
            <div className="card-body">
              Account <a href="/register">registration</a> is required in order
              to use the service.
            </div>
          </div>
        </div>
        <h2>Data upload</h2>
        <div className="card">
          <div className="card-header" id="headingThree">
            <h2 className="mb-0">
              <button className="btn btn-link collapsed" type="button"
                      data-toggle="collapse"
                      data-target="#collapseThree" aria-expanded="false"
                      aria-controls="collapseThree">
                What preprocessing is being done to my data before upload?
              </button>
            </h2>
          </div>
          <div id="collapseThree" className="collapse"
               aria-labelledby="headingThree"
               data-parent="#accordionExample">
            <div className="card-body">
              Your data are being converted to <a
              href="https://geojson.org/">GeoJSON</a> format and
              depending
              on the size of the file you are uploading each time
              they are being sampled. After, only a simple representative sample
              (of the sample) is shown
              on
              the map where using a lasso tool you can choose some areas to
              exclude being uploaded.
            </div>
          </div>
        </div>
        <h2>Data storage</h2>
        <div className="card">
          <div className="card-header" id="headingFour">
            <h2 className="mb-0">
              <button className="btn btn-link collapsed" type="button"
                      data-toggle="collapse"
                      data-target="#collapseFour" aria-expanded="false"
                      aria-controls="collapseFour">
                How are my data stored?
              </button>
            </h2>
          </div>
          <div id="collapseFour" className="collapse"
               aria-labelledby="headingFour"
               data-parent="#accordionExample">
            <div className="card-body">
              Your data are stored in plain text. Except
              from the admin and you, no one else can access them.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header" id="headingFive">
            <h2 className="mb-0">
              <button className="btn btn-link collapsed" type="button"
                      data-toggle="collapse"
                      data-target="#collapseFive" aria-expanded="false"
                      aria-controls="collapseFive">
                Can I delete my data?
              </button>
            </h2>
          </div>
          <div id="collapseFive" className="collapse"
               aria-labelledby="headingThree"
               data-parent="#accordionExample">
            <div className="card-body">
              No, for the time being only admin can delete other users' data.
            </div>
          </div>
        </div>
      </div>
    </div>)
}