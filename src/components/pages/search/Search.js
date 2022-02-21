import React, { useState, useEffect } from 'react'; 
import { Container, Row, Col, Button } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import axios from "axios";


import "./Search.css"; // Import styling


function Search() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const [preventativeServiceList, setPreventativeServiceList] = useState([]);
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [smokingStatus, setSmokingStatus] = useState('');
    const [colonoscopy_procedure, setColonoscopy_Procedure] = useState('');

    const onSubmit = async (data) => {
        console.log(data.patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/patient",
            data: data
        });
        if (response.data.status === 200){
            console.log("Patient was Found", response.data)
            var gender = response.data.data.gender;
            var dob = response.data.data.birthDate;
            console.log(gender)
            console.log(dob)
            await preventatives_services(gender, calculate_age(dob), await smoking_status(data.patientID), await colonoscopy_check(data.patientID));
        } else if(response.data.status === 404){
            console.log("Patient not Found")
        }
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

    //make query to check for previous colonoscopy of Patient
    const colonoscopy_check = async (patientID) => {
        console.log(patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/colonoscopy_check",
            data: {
                patientID: patientID
            },
        })
        var data = response.data;
        var colonoscopy_procedure_entry = data.data.total;
        console.log(data);
        if(colonoscopy_procedure_entry != 0){
            return "Y"
        } else {
            return "N"
        }
    }


    //make query to search for smoking status of Patient 
    const smoking_status = async (patientID) => {
        console.log(patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/smoking_status",
            data: {
                patientID: patientID
            },
        })           
        var data = response.data;
        var smoking_status_entry = data.data.total;
        if(smoking_status_entry != 0){
            var smoking_status = data.data.entry[0].resource.valueCodeableConcept.coding[0].code
            console.log(smoking_status)
            if (smoking_status === "266919005" || smoking_status === "266927001" || smoking_status === "8517006") {
                return "N"
            } else {
                return "Y"
            }
        } else {
            return "N"
        }
    }

    //make query to preventative services to provide list of potential services for patient to front-end client 
    const preventatives_services = async (gender, age, smokingStatus, colonoscopyCheck) => {
        setGender(gender);
        setAge(age);
        setSmokingStatus(smokingStatus);
        setColonoscopy_Procedure(colonoscopyCheck)
        console.log(gender);
        console.log(age);   
        console.log(smokingStatus);
        console.log(colonoscopyCheck)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/preventatives_services",
            data: {
                gender: gender,
                age: age,
                smokingStatus: smokingStatus
            },
        })         
        var data = response.data;
        console.log(data)
        setPreventativeServiceList(data)
        console.log("preventative services success");
    }
    

    return (
        <Container fluid className="content-block">
            <Row style={{ paddingTop: "20px" }}>
                <Col md={6}>
                    <h1>FHIR Patient ID Search</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" className="form-control" {...register("patientID", { required: true, minLength: 2 })}/>
                        {errors.patientID && <p className="error-text">patientID is required</p>}
                        <Button variant='form' type="submit">Submit</Button>
                    </form>
                </Col>
            </Row>
            { gender && age && smokingStatus &&
            <Row>
                <Col md={6}>
                    <h1 style={{paddingTop:"30px"}}>Patient Info:</h1>
                    <h3>Gender: {gender} </h3>
                    <h3>Age: {age} </h3>
                    <h3>Smoking Status: {smokingStatus} </h3>
                </Col>
            </Row> 
            }
            {  preventativeServiceList?.specificRecommendations?.length > 0 && colonoscopy_procedure == "Y" ?
            <Row>
                 <Col md={6}>
                        <h1 style={{paddingTop:"10px"}}>Preventative Services List</h1> 

                        <h2>Specific Recommendations</h2> 
                        <ul> {preventativeServiceList.specificRecommendations.filter(item => item.title !== "Colorectal Cancer: Screening -- Adults aged 50 to 75 years").map(item => <li key={item.id}>{item.title}</li>)}</ul>
                </Col>
            </Row> : ''
            }
            {  preventativeServiceList?.specificRecommendations?.length > 0 && colonoscopy_procedure == "N" ?
            <Row>
                 <Col md={6}>
                        <h1 style={{paddingTop:"10px"}}>Preventative Services List</h1> 

                        <h2>Specific Recommendations</h2> 
                        <ul> {preventativeServiceList.specificRecommendations.map(item => <li key={item.id}>{item.title}</li>)}</ul>
                </Col>
            </Row> : ''
            }
            { preventativeServiceList?.generalRecommendations &&
            <Row>
                 <Col md={6}>
                        <h2>General Recommendations</h2> <ul>
                        { 
                          Object.keys(preventativeServiceList.generalRecommendations).map((item) => (
                                <li key={item}>{preventativeServiceList.generalRecommendations[item].title}</li>
                          ))
                        }
                        </ul>
                </Col>
            </Row> 
            }
            { preventativeServiceList?.categories &&
            <Row>
                 <Col md={6}>
                        <h2>Categories</h2> <ul>
                        { 
                          Object.keys(preventativeServiceList.categories).map((item) => (
                                <li key={item}>{preventativeServiceList.categories[item].name}</li>
                          ))
                        }
                        </ul>
                </Col>
            </Row> 
            }
            { preventativeServiceList?.tools &&
            <Row>
                 <Col md={6}>
                        <h2>Tools</h2> <ul>
                        { 
                          Object.keys(preventativeServiceList.tools).map((item) => (
                                <li key={item}>{preventativeServiceList.tools[item].title}</li>
                          ))
                        }
                        </ul>
                </Col>
            </Row> 
            }
            { preventativeServiceList?.risks &&
            <Row>
                 <Col md={6}>
                        <h2>Risks</h2> <ul>
                        { 
                          Object.keys(preventativeServiceList.risks).map((item) => (
                                <li key={item}>{preventativeServiceList.risks[item].name}</li>
                          ))
                        }
                        </ul>
                </Col>
            </Row> 
            }
            { preventativeServiceList?.grades &&
            <Row>
                 <Col md={6}>
                        <h2>grades</h2> <ul>
                        { 
                          Object.keys(preventativeServiceList.grades).map((item) => (
                                <li key={item}>{item}: {preventativeServiceList.grades[item]}</li>
                          ))
                        }
                        </ul>
                </Col>
            </Row> 
            }
        </Container>
    )
}

export default Search;
