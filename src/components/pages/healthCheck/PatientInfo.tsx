import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, Button, Spinner } from "react-onsenui";
import axios from "axios";
import { getPatientID, getDOB, getGender, getPatientAge, getPatientName, getPatientHeight, getPatientWeight, getWeightRecorded, getDiastolicBloodPressure, getSystolicBloodPressure, getTobaccoUsage} from '../../../store/patientSlice'



import "./PatientInfo.css"; // Import styling


function PatientInfo() {
    const dispatch = useDispatch()
    const history = useHistory()
    const patientUserName = useSelector(state => state.patient.patientUserName)
    const [submitComplete, setSubmitComplete] = useState(false);

    const [patientID, setPatientID] = useState('');
    const [gender, setGender] = useState('');
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState<number>(null);
    const [dob, setDOB] = useState('');

    const [weight, setWeight] = useState('');
    const [weightRecorded, setWeightRecored] = useState('');

    const [height, setHeight] = useState('');

    const [systolicbloodpressure, setSystolicBloodPressure] = useState('');
    const [diastolicbloodpressure, setDiastolicBloodPressure] = useState('');
    const [bloodpressureRecored, setBloodPressureRecored] = useState('');

    const [smokingStatus, setSmokingStatus] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            const submission = {
                userName: patientUserName
            }
            console.log(submission)
            const response = await axios({
                method: "POST",
                url: "http://localhost:4002/search_username",
                data: submission
            });
            if (response.status === 200){
                var data = response.data;
                console.log("Patient was Found", data)
                var dataPatientID = data.entry[0].resource.id;
                var dataGender = data.entry[0].resource.gender;
                var dataDOB = data.entry[0].resource.birthDate;
                var dataName = data.entry[0].resource.name[0].given[0]
                setPatientName(dataName)
                setPatientID(dataPatientID)
                setGender(dataGender);
                setAge(calculate_age(dataDOB))
                setDOB(new Date(dataDOB).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
                await getBloodPressure(dataPatientID)
                await getWeight(dataPatientID)
                await getHeight(dataPatientID)
                await smoking_status(dataPatientID)
                setSubmitComplete(true);
            } else if(response.status === 404){
                console.log("Patient not Found")
            }
          };
          fetchPatientData();
    }, [patientUserName]);


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

    //Retrieve Patients Blood Pressure via PatientID
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

    //Retrieve Patients Weight via PatientID
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
            var weight = (data.data.entry[0].resource.valueQuantity.value * 2.205).toFixed(2)
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

    //Retrieve Patients Height via PatientID
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
            setHeight('')
            console.log("Height not taken");
            return
        }
    }


    //Retrieve Patients Smoking Status via PatientID
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
                var no_smoking_status = "N"
                setSmokingStatus(no_smoking_status)
                console.log("Smoking Status retrieval succesful");
            } else {
                var has_smoking_status = "Y"
                setSmokingStatus(has_smoking_status)
                console.log("Smoking Status retrieval succesful");
            }
        } else {
            var no_smoking_status_entry = "N"
            setSmokingStatus(no_smoking_status_entry)
            console.log("Smoking Status retrieval succesful");
        }
    }

    const goForward = () => {
        dispatch(getPatientID(patientID))
        dispatch(getDOB(dob))
        dispatch(getGender(gender))
        dispatch(getPatientAge(age))
        dispatch(getPatientHeight(height))
        dispatch(getPatientWeight(weight))
        dispatch(getPatientName(patientName))
        dispatch(getWeightRecorded(weightRecorded))
        dispatch(getDiastolicBloodPressure(diastolicbloodpressure))
        dispatch(getSystolicBloodPressure(systolicbloodpressure))
        dispatch(getTobaccoUsage(smokingStatus))
        history.push("/health/summary");
    }


    return (
        <Container fluid className="content-block">
        {submitComplete ? (
            <>
                <h1>Preventative Health Check</h1>
                <p className="pageDescription">The information below is needed to get the most personalized list of recommendations from the US Preventative Services Task Force.</p>
                <p className="pageDescription">All fields are optional.</p>
                <h2>Date of Birth: {dob}</h2>
                <h2>Sex Assigned at Birth: {gender}</h2>
                <h2>Height: {height} </h2>
                <h2>Weight: {weight} </h2>
                <h2>Date Weight Recorded: {weightRecorded} </h2>
                <h2>Blood pressure: {systolicbloodpressure}/{diastolicbloodpressure} mmHg</h2>
                <h2>Date Blood Pressure Recorded: {bloodpressureRecored} </h2>
                <h2>Tobacco Usage: {smokingStatus} </h2>
                <Button variant='form' onClick={() => goForward()}>Next</Button>
            </>
          ) : (
            <>
                 <h2>Retrieving Patient Info</h2>
                 <Spinner animation="border" variant="light" />
            </>
         )}
        </Container>
    )
}

export default PatientInfo;
