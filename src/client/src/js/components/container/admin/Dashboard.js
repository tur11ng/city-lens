import { ActivitiesPerMonth } from './ActivitiesPerMonth'
import React from 'react'
import { ActivitiesPerDOW } from './ActivitiesPerDOW'
import { ActivitiesPerHour } from './ActivitiesPerHour'
import { ActivitiesPerType } from './ActivitiesPerType'
import { ActivitiesPerYear } from './ActivitiesPerYear'
import { ActivitiesPerUser } from './ActivitiesPerUser'
import { Col, Container, Row } from 'react-bootstrap'

export function Dashboard () {
  return (
    <div className="text-center">
      <h1>Dashboard</h1>
      <Container fluid="md">
        <Row className="justify-content-md-center">
          <Col md="4" lg="3"><h5>Activities per hour</h5>
            <ActivitiesPerHour/></Col>
          <Col md="4" lg="3"><h5>Activities per day of week</h5>
            <ActivitiesPerDOW/></Col>
          <Col md="4" lg="3"><h5>Activities per month</h5><ActivitiesPerMonth/></Col>
          <Col md="4" lg="3"><h5>Activities per year</h5>
            <ActivitiesPerYear/></Col>
        </Row>
        <hr/>
        <Row className="justify-content-md-center">
          <Col lg="6"><h5>Activities per type</h5><ActivitiesPerType/></Col>
          <Col lg="6"><h5>Activities per user</h5><ActivitiesPerUser/></Col>
        </Row>
      </Container>
    </div>
  )
}