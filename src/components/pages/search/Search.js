import React, { useState, useEffect } from 'react'; 
import { Container, Row, Col, Button } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import axios from "axios";


import "./Search.css"; // Import styling


function Search() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const [patientID, setPatientID] = useState('');
    const [currentAge, setCurrentAge] = useState('');
    const [smokingStatus, setSmokingStatus] = useState('');
    const [preventativeServiceList, setPreventativeServiceList] = useState('');

    const onSubmit = data => {
        setPatientID(data.patientID)
        console.log(patientID)
        axios({
            method: "POST",
            url: "http://localhost:4002/patient",
            data: data
        }).then((response)=>{
            if (response.data.status === 200){
                console.log("Patient was Found")
                var data = response.data;
                var gender = data.data.gender;
                var dob = data.data.birthDate;
                console.log(gender)
                console.log(dob)
                setCurrentAge(calculate_age(dob));
                smoking_status(patientID)
                preventatives_services(gender, currentAge, smokingStatus);
            } else if(response.data.status === 404){
                console.log("Patient not Found")
            }
        });
    }

    //calculates the current age from data of birth 
    const calculate_age = (dob1) => {
        var today = new Date();
        var birthDate = new Date(dob1);  // create a date object directly from `dob1` argument
        var age_now = today.getFullYear() - birthDate.getFullYear(); 
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age_now--;
        }
        return age_now;
    }

    //make query to search for smoking status of Patient 
    const smoking_status = async (patientID) => {
        console.log(patientID)
        await axios({
            method: "POST",
            url: "http://localhost:4002/smoking_status",
            data: {
                patientID: patientID
            },
        }).then((response)=>{           
                var data = response.data;
                var entry = data.data.total;
                if(entry != 0){
                    var smoking_status = data.data.entry[0].resource.valueCodeableConcept.coding[0].code
                    console.log(smoking_status)
                    if (smoking_status === "266919005" || smoking_status === "266927001" || smoking_status === "8517006") {
                        setSmokingStatus("N")
                        console.log(smokingStatus)
                    }
                } else {
                        setSmokingStatus("N")
                        console.log(smokingStatus)
                }
        });
    }

    //make query to preventative services to provide list of potential services for patient to front-end client 
    const preventatives_services = async (gender, age, smokingStatus) => {
        console.log(gender);
        console.log(age);   
        await axios({
            method: "POST",
            url: "http://localhost:4002/preventatives_services",
            data: {
                gender: gender,
                age: age,
                smokingStatus: smokingStatus
            },
        }).then((response)=>{           
                var data = response.data;
                setPreventativeServiceList(data)
                console.log(preventativeServiceList);
                console.log("preventative services success");
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
