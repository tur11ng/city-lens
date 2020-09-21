import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {EcoScore} from "./EcoScore";
import {ActivitiesInfo} from "./ActivitiesInfo";
import {ActivitiesLeaderboard} from "./ActivitiesLeaderboard";

export function Dashboard() {
    return (
        <div className="text-center">
            <h1>Dashboard</h1>
            <Container fluid="md">
                <Row className="justify-content-sm-center">
                    <Col sm="10" lg="3"><EcoScore /></Col>
                    <Col sm="10" lg="3"><ActivitiesInfo /></Col>
                    <Col sm="10" lg="3"><ActivitiesLeaderboard /></Col>
                </Row>
                <hr/>
                <Row className="justify-content-md-center">
                </Row>
            </Container>
        </div>
    )
}