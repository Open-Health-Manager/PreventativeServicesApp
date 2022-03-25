import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Accordion, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import Header from '../../header/header'
import axios from "axios";
import '../../../types/state';
import * as USPSTF from '../../../types/uspstf';

function Summary() {

    const dispatch = useDispatch()
    const patientName = useSelector(state => state.patient.patientName)
    const patientAge =  useSelector(state => state.patient.age)
    const patientGender =  useSelector(state => state.patient.gender)
    const patientSmokingStatus =  useSelector(state => state.patient.tobaccoUsage)
    const [submitComplete, setSubmitComplete] = useState(false);


    const [preventativeServiceList, setPreventativeServiceList] = useState<USPSTF.APIResponse>({
        specificRecommendations: [],
        grades: {},
        generalRecommendations: {}
    });

    useEffect(() => {
        const fetchPreventativeServiceData = async () => {
            console.log(patientGender)
            console.log(patientAge)
            console.log(patientSmokingStatus)
            const response = await axios({
                method: "POST",
                url: "http://localhost:4002/preventatives_services",
                data: {
                    gender: patientGender,
                    age: patientAge,
                    smokingStatus: patientSmokingStatus
                },
            });
            if (response.status === 200){
                var data = response.data;
                setPreventativeServiceList(data)
                console.log("Preventative Service Call Succesful", data)
                setSubmitComplete(true);
            } else if(response.status === 404){
                console.log("Preventative Service Call not Succesful")
            }
          };
          fetchPreventativeServiceData();
    }, [patientGender, patientAge, patientSmokingStatus]);

    return (
        <Container fluid className="content-block">
         {submitComplete ? (
            <>
                <Header />
                <h1 style={{ paddingTop: "20px", paddingBottom:"20px"}}>{patientName}</h1>
                <h2 style={{ paddingBottom: "30px" }}>Get Started: Preventative Health Check</h2>

                {  preventativeServiceList?.specificRecommendations?.length > 0 ?
                <Row>
                    <Col md={6}>
                            { preventativeServiceList.specificRecommendations.map((item) => (
                                <Accordion>
                                    <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                                        <Accordion.Header>{item.title}</Accordion.Header>
                                        <Accordion.Body>
                                        {item.text}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            ))}
                    </Col>
                </Row> : ''
                }
            </>
            ) : (
            <>
                <h2>Retrieving Preventative Health Information</h2>
                <Spinner animation="border" variant="light" />
            </>
         )}

        </Container>
    )
}

export default Summary;
