import React from 'react'
import Header from '../../header/header'
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from 'react-redux'

import "./CarePlan.css"; // Import styling


function CarePlan() {
    const specificRecommendationsList = useSelector(state => state.specificRecommendations.RecommendationsList)
    const patientInfo = useSelector(state => state.patient)
    
    return (
        <div>
            <Container fluid className="content-block"> 
                <Header />
                <h1>Care Plan</h1>
                    <Row>
                        <Col md={6}>
                                { specificRecommendationsList[0].filter(item => item.id === 1921).map((item) => (
                                    <div className="care_plan_container" key={item.id}>
                                        <h2>{item.title}</h2>
                                        <p className="reading_header">Latest Blood Pressure Reading</p>
                                        <p>Blood Pressure: {patientInfo.systolicBloodPressure}/{patientInfo.diastolicBloodPressure} mmHg</p>
                                        <p>Date Blood Pressure Recorded: {patientInfo.bloodPressureRecorded}</p>
                                    </div>     
                                ))}
                        </Col>
                    </Row>
            </Container>
        </div>
    )
}

export default CarePlan;