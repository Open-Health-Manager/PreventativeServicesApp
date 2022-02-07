import React from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import axios from "axios";


import "./Search.css"; // Import styling


function Search() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    
    const onSubmit = data => {
        console.log("data", data);

        axios({
            method: "POST",
            url: "http://localhost:4002/observation",
            data: data
        }).then((response)=>{
        console.log(response);
            if (response.data.status === 200){
                console.log("Patient Read");
            } else if(response.data.status != 200){
                console.log("Patient not Found")
            }
        });
    }
    

    return (
        <Container fluid className="content-block">
            <Row style={{ paddingTop: "20px" }}>
                <Col md={6}>
                    <h1>FHIR Patient ID Search</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" className="form-control" name="patientID"{...register("patientID", { required: true, minLength: 2 })}/>
                        {errors.patientID && <p className="error-text">patientID is required</p>}
                        <Button variant='form' type="button" onClick={handleSubmit(onSubmit)}>Submit</Button>
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default Search;
