import React, { useState } from 'react'; 
import { Accordion, Container, Row, Col, Button } from "react-bootstrap";
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
    const [dob, setDOB] = useState('');

    const [weight, setWeight] = useState('');
    const [weightRecorded, setWeightRecored] = useState('');

    const [height, setHeight] = useState('');
    const [bmi, setBMI] = useState('');

    const [systolicbloodpressure, setSystolicBloodPressure] = useState('');
    const [diastolicbloodpressure, setDiastolicBloodPressure] = useState('');
    const [bloodpressureRecored, setBloodPressureRecored] = useState('');

    const [smokingStatus, setSmokingStatus] = useState('');
    const [colonoscopy_procedure, setColonoscopy_Procedure] = useState('');

    const onSubmit = async (data) => {
        console.log(data.userName)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/search_username",
            data: data
        });
        if (response.status === 200){
            var data = response.data;
            console.log("Patient was Found", data)
            var patientID = data.entry[0].resource.id
            var gender = data.entry[0].resource.gender;
            var dob = data.entry[0].resource.birthDate;
            console.log(patientID)
            console.log(gender)
            setDOB(new Date(dob).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            await getBloodPressure(patientID)
            await getBMI(patientID)
            await getHeight(patientID)
            await getWeight(patientID)
            await preventatives_services(gender, calculate_age(dob), await smoking_status(patientID), await colonoscopy_check(patientID));
        } else if(response.status === 404){
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
        if(colonoscopy_procedure_entry !== 0){
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
        console.log(data)
        var smoking_status_entry = data.data.total;
        if(smoking_status_entry !== 0){
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

    const getBMI = async (patientID) => {
        console.log(patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/retrieve_bmi",
            data: {
                patientID: patientID
            },
        })
        var data = response.data;
        var BMI_entry = data.data.total
        if(BMI_entry !== 0){
            console.log(data.data.entry[0].resource.valueQuantity.value)
            var bmiValue = data.data.entry[0].resource.valueQuantity.value
            setBMI(bmiValue)
            console.log("BMI retrieval succesful");
        } else {
            console.log("BMI not taken");
            return
        }
    }

    const getHeight = async (patientID) => {
        console.log(patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/retrieve_height",
            data: {
                patientID: patientID
            },
        })
        var data = response.data;
        var height_entry = data.data.total;
        if(height_entry !== 0){
            var height = Math.round(data.data.entry[0].resource.valueQuantity.value / 2.54)
            var feet = Math.floor(height/12)
            var inches = (height - (feet * 12))
            var feet_and_inches = feet + " ft" + " " + inches + " inches"
            console.log(feet_and_inches)
            setHeight(feet_and_inches)
            console.log("Height retrieval succesful");
        } else {
            console.log("Height not taken");
            return
        }
    }

    const getWeight = async (patientID) => {
        console.log(patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/retrieve_weight",
            data: {
                patientID: patientID
            },
        })
        var data = response.data;
        var weight_entry = data.data.total;
        if(weight_entry !== 0){
            console.log((data.data.entry[0].resource.valueQuantity.value * 2.205).toFixed(2))
            console.log(new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            var weight = data.data.entry[0].resource.valueQuantity.value.toFixed(2)
            setWeightRecored(new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            setWeight(weight)
            console.log("Weight retrieval succesful");
        } else {
            console.log("Weight not taken");
            return
        }
    }

    const getBloodPressure = async (patientID) => {
        console.log(patientID)
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/retrieve_blood_pressure",
            data: {
                patientID: patientID
            },
        })
        var data = response.data;
        var blood_pressure_entry = data.data.total;
        if(blood_pressure_entry !== 0){
            console.log(new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            var systolic = data.data.entry[0].resource.component[0].valueQuantity.value
            var diastolic = data.data.entry[0].resource.component[1].valueQuantity.value
            setSystolicBloodPressure(systolic)
            setDiastolicBloodPressure(diastolic)
            setBloodPressureRecored(new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            console.log("Blood pressure retrieval succesful");
        } else {
            console.log("Blood pressure not taken");
            return
        }
    }
    

    return (
        <Container fluid className="content-block">
            <Row style={{ paddingTop: "20px" }}>
                <Col md={6}>
                    <h1>Preventative Health Check</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" className="form-control" {...register("userName", { required: true })}/>
                        {errors.patientID && <p className="error-text">user name is required</p>}
                        <Button variant='form' type="submit">Submit</Button>
                    </form>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    { dob && <h1 style={{paddingTop:"30px"}}>Patient Info:</h1> }
                    { dob && <h3>Date of Birth: {dob} </h3> }
                    { gender && <h3>Sex assigned at Birth: {gender} </h3> }
                    { age && <h3>Age: {age} </h3> }
                    { height && <h3>Height: {height} </h3> }
                    { weight && <h3>Weight: {weight} lbs</h3> }
                    { weightRecorded && <h3>Date Weight Recorded: {weightRecorded}</h3> }
                    { bmi && <h3>BMI: {bmi} kg/m2</h3> }
                    { systolicbloodpressure && diastolicbloodpressure && <h3>Blood pressure: {systolicbloodpressure}/{diastolicbloodpressure} mmHg</h3> }
                    { bloodpressureRecored && <h3>Date Blood Pressure Recorded: {bloodpressureRecored}</h3> }
                    { smokingStatus && <h3>Smoking Status: {smokingStatus} </h3> }
                </Col>
            </Row> 
            {  preventativeServiceList?.specificRecommendations?.length > 0 && colonoscopy_procedure == "Y" ?
            <Row>
                 <Col md={6}>
                        <h1 style={{paddingTop:"10px"}}>Preventative Services List</h1> 

                        <h2>My Care Plan</h2> 
                         {preventativeServiceList.specificRecommendations.filter(item => item.title !== "Colorectal Cancer: Screening -- Adults aged 50 to 75 years").map((item) => (
                             <Accordion>
                             <Accordion.Item eventKey={item}>
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
            {  preventativeServiceList?.specificRecommendations?.length > 0 && colonoscopy_procedure == "N" ?
            <Row>
                 <Col md={6}>
                        <h1 style={{paddingTop:"10px"}}>Preventative Services List</h1> 

                        <h2>My Care Plan</h2> 
                        { preventativeServiceList.specificRecommendations.map((item) => (
                            <Accordion>
                                <Accordion.Item eventKey={item}>
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
            {/*preventativeServiceList?.generalRecommendations &&
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
            */}
            {/*preventativeServiceList?.categories &&
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
            */}
            {/*preventativeServiceList?.tools &&
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
            */}
            {/*preventativeServiceList?.risks &&
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
            */}
            {/*preventativeServiceList?.grades &&
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
            */}
        </Container>
    )
}

export default Search;
