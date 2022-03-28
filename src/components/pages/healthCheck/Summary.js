import React, { useState, useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'
import { Accordion, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import Header from '../../header/header'
import axios from "axios";


import "./Summary.css"; // Import styling


function Summary() {

    const dispatch = useDispatch()
    const patientName = useSelector(state => state.patient.patientName)
    const patientAge =  useSelector(state => state.patient.age)
    const patientGender =  useSelector(state => state.patient.gender)
    const patientSmokingStatus =  useSelector(state => state.patient.tobaccoUsage)
    const [submitComplete, setSubmitComplete] = useState(false);

    const [specificRecommendationsList, setSpecificRecommendationsList] = useState([]);

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
                prioritizeList(data);
                console.log("Preventative Service Call Succesful", data)
                setSubmitComplete(true);
            } else if(response.status === 404){
                console.log("Preventative Service Call not Succesful")
            }      
          };
          fetchPreventativeServiceData();
    }, [patientGender, patientAge, patientSmokingStatus]);

    const prioritizeList = (data) => {
        const specificRecommendations = data.specificRecommendations
        console.log("initialize specificRecommendations", specificRecommendations)
        
        const prioritizeSet = new Set([1921]);

        const newArr = specificRecommendations.sort((a, b) => 
            prioritizeSet.has(b.id) - prioritizeSet.has(a.id)
        );
        
        console.log(newArr) // Note that the original array has been sorted in-place

        //Find index of specific array object in specificRecommendations using findIndex method.    
        const objIndex = specificRecommendations.findIndex((obj => obj.id == 1921));

        //Log object from specificRecommendations to console
        console.log("Before update: ", specificRecommendations[objIndex])

        //Update object's title and text property.
        specificRecommendations[objIndex].title = "Get Blood Pressure Checked"
        specificRecommendations[objIndex].text = "Hypertension is a major contributing risk factor for heart attack, stroke, and chronic risk disease. \n Screening for and treatment of hypertension reduces the likelihood of heart attack, stroke, and chronic kidney disease."

        //Log updated object from specificRecommendations to console again.
        console.log("After update: ", specificRecommendations[objIndex])        

        console.log("updated specificRecommendations", specificRecommendations)

        setSpecificRecommendationsList(specificRecommendations)
    }


    const filterItem = (id) => {
        console.log(id)
        const filteredItem = specificRecommendationsList.filter(item => item.id !== id)
        setSpecificRecommendationsList(filteredItem)
    } 
    
    return (
        <Container fluid className="content-block">
         {submitComplete ? (
            <>
                <Header />
                <h1 style={{ paddingTop: "20px", paddingBottom:"20px"}}>{patientName}</h1>
                <h2 style={{ paddingBottom: "30px" }}>Get Started: Preventative Health Check</h2>

                {  specificRecommendationsList?.length > 0 ?
                <Row>
                    <Col md={6}>
                            { specificRecommendationsList.map((item) => (
                                <Accordion>
                                    <Accordion.Item eventKey={item.id} key={item.id}>
                                        <Accordion.Header>{item.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="accordion_container">
                                                <p>{item.text}</p>
                                                <div className="center_button">
                                                    <Button variant='ignore' type="submit" onClick={() => filterItem(item.id)}>Ignore</Button>
                                                </div>
                                            </div>
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
