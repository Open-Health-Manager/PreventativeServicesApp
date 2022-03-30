import React, { useState } from 'react';
import { Input, Page, List, ListHeader, ListItem, Button, ProgressCircular } from "react-onsenui";
import { Controller, useForm } from 'react-hook-form';
import axios from "axios";
import * as USPSTF from '../../../types/uspstf';

//import "./Search.css"; // Import styling

type SearchFormInput = {
    userName: string;
};

function Search() {

    const { control, handleSubmit, formState: { errors } } = useForm<SearchFormInput>({
        mode: 'onTouched',
        defaultValues: {
            userName: ''
        }
    });

    const [userLookupError, setUserLookupError] = useState('');
    const [loading, setLoading] = useState(false);

    const [preventativeServiceList, setPreventativeServiceList] = useState<USPSTF.APIResponse>({
        specificRecommendations: [],
        grades: {},
        generalRecommendations: {}
    });

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
        // Blank the lookup error for now
        setUserLookupError('');
        setLoading(true);
        console.log(`Looking up user "${data.userName}"`);
        const response = await axios({
            method: "POST",
            url: "http://localhost:4002/search_username",
            data: data
        });
        if (response.status === 200 && response.data.entry?.length > 0) {
            const responseData = response.data;
            console.log("Patient was Found", responseData)
            const patientID = responseData.entry[0].resource.id
            const gender = responseData.entry[0].resource.gender;
            const dob = responseData.entry[0].resource.birthDate;
            console.log(`Patient ID = ${patientID}`)
            console.log(`Gender = ${gender}`)
            setDOB(new Date(dob).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            try {
                // Do the stuff we can do in parallel in parallel
                await Promise.all([
                    getBloodPressure(patientID),
                    getBMI(patientID),
                    getHeight(patientID),
                    getWeight(patientID)
                ]);
                await preventatives_services(gender, calculate_age(dob), await smoking_status(patientID), await colonoscopy_check(patientID));
            } catch (ex) {
                console.log('exception loading data:');
            }
        } else if ((response.status === 200 && !('entry' in response.data && response.data.entry.length > 0)) || response.status === 404) {
            console.log("Patient not found");
            setUserLookupError(`User ${data.userName} not found.`);
        } else {
            setUserLookupError('An unknown error happened while looking up patient data.');
        }
        setLoading(false);
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
            setBMI('')
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
            var feet_and_inches = feet + " ft " + inches + " inches"
            console.log(feet_and_inches)
            setHeight(feet_and_inches)
            console.log("Height retrieval succesful");
        } else {
            setHeight('')
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
            setWeight('')
            setWeightRecored('')
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
            setSystolicBloodPressure('')
            setDiastolicBloodPressure('')
            setBloodPressureRecored('')
            console.log("Blood pressure not taken");
            return
        }
    }

    const havePatientData = !!(dob || gender || age || height || weight || weightRecorded || bmi || (systolicbloodpressure && diastolicbloodpressure) || bloodpressureRecored || smokingStatus);

    return (
        <Page>
            <h1>Preventative Health Check</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <List>
                    <ListItem>
                        <Controller name="userName" control={control} render={({field}) => <Input type="text" autocomplete="username" autocapitalize="off" disabled={loading} placeholder="Username" float {...field}/>} />
                        {errors.userName && <div className="list-item__subtitle">user name is required</div>}
                        <div className="list-item__subtitle">{userLookupError}</div>
                    </ListItem>
                    { loading ?
                        <ListItem><div className="left"><ProgressCircular indeterminate/></div><div className="center">Loading patient data...</div></ListItem>
                        : <ListItem><div className="right"><Button modifier="cta" onClick={handleSubmit(onSubmit)}>Lookup</Button></div></ListItem>
                    }
                </List>
            </form>
            { havePatientData ?
                <List>
                    <ListHeader>Patient Info:</ListHeader>
                    { dob && <ListItem>Date of Birth: {dob}</ListItem> }
                    { gender && <ListItem>Sex assigned at Birth: {gender}</ListItem> }
                    { age && <ListItem>Age: {age} </ListItem> }
                    { height && <ListItem>Height: {height} </ListItem> }
                    { weight && <ListItem>Weight: {weight} lbs</ListItem> }
                    { weightRecorded && <ListItem>Date Weight Recorded: {weightRecorded}</ListItem> }
                    { bmi && <ListItem>BMI: {bmi} kg/m2</ListItem> }
                    { (systolicbloodpressure && diastolicbloodpressure) && <ListItem>Blood pressure: {systolicbloodpressure}/{diastolicbloodpressure} mmHg</ListItem> }
                    { bloodpressureRecored && <ListItem>Date Blood Pressure Recorded: {bloodpressureRecored}</ListItem> }
                    { smokingStatus && <ListItem>Smoking Status: {smokingStatus} </ListItem> }
                </List>
            : false }
            { preventativeServiceList?.specificRecommendations?.length > 0 && colonoscopy_procedure === "Y" ?
                <>
                    <h1>Preventative Services List</h1>
                    <List>
                        <ListHeader>My Care Plan</ListHeader>
                         {preventativeServiceList.specificRecommendations.filter(item => item.title !== "Colorectal Cancer: Screening -- Adults aged 50 to 75 years").map((item) => (
                             <ListItem expandable key={item.id}>
                                 <div className="left">{item.title}</div>
                                 <div className="expandable-content">{item.text}</div>
                             </ListItem>
                      ))}
                    </List>
                </> : ''
            }
            {  preventativeServiceList?.specificRecommendations?.length > 0 && colonoscopy_procedure === "N" ?
            <>
                <h1>Preventative Services List</h1>
                <List>
                    <ListHeader>My Care Plan</ListHeader>
                        { preventativeServiceList.specificRecommendations.map((item) => (
                            <ListItem expandable key={item.id}>
                                <div className="left">{item.title}</div>
                                <div className="expandable-content">{item.text}</div>
                            </ListItem>
                         ))}
                </List>
            </> : ''
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
        </Page>
    )
}

export default Search;
