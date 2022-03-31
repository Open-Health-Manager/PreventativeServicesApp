import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { Button, Row, Col, Page, ProgressCircular } from "react-onsenui";
import axios from "axios";
import { getPatientID, getDOB, getGender, getPatientAge, getPatientName, getPatientHeight, getPatientWeight, getWeightRecorded, getDiastolicBloodPressure, getSystolicBloodPressure, getBloodPressureRecorded, getPregnancyStatus, getTobaccoUsage, getSexualActivity} from '../../../store/patientSlice'

import { Patient } from '../../../types/patient';
import "./PatientInfo.css"; // Import styling

type PatientFormValues = {
    patientName: string;
    gender: string;
    dob: string;
    systolicBloodPressure: string;
    diastolicBloodPressure: string;
    bloodPressureRecorded: string;
    weight: string;
    weightRecorded: string;
    height: string;
    smokingStatus: string;
    pregnancyStatus: string;
    sexualActivityStatus: string;
}

function PatientInfo() {
    const dispatch = useDispatch()
    const history = useHistory()
    const patientUserName = useSelector(state => state.patient.patientUserName)
    const [submitComplete, setSubmitComplete] = useState(false);

    const [patientID, setPatientID] = useState('');
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState<number | null>(null);

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            patientName: '',
            gender: '',
            dob: '',
            systolicBloodPressure: '',
            diastolicBloodPressure: '',
            bloodPressureRecorded: '',
            weight: '',
            weightRecorded: '',
            height: '',
            smokingStatus: '',
            pregnancyStatus: "N",
            sexualActivityStatus: "N"
        }
    });
    const [disabled, setDisable] = useState(true);
    const onSubmit = (data: PatientFormValues) => {
        console.log(data)
        dispatch(getPatientID(patientID))
        dispatch(getDOB(data.dob))
        dispatch(getGender(data.gender))
        dispatch(getPatientAge(age))
        dispatch(getPatientName(patientName))
        dispatch(getPatientHeight(data.height))
        dispatch(getPatientWeight(data.weight))
        dispatch(getWeightRecorded(data.weightRecorded))
        dispatch(getDiastolicBloodPressure(data.diastolicBloodPressure))
        dispatch(getSystolicBloodPressure(data.systolicBloodPressure))
        dispatch(getBloodPressureRecorded(data.bloodPressureRecorded))
        dispatch(getPregnancyStatus(data.pregnancyStatus))
        dispatch(getTobaccoUsage(data.smokingStatus))
        dispatch(getSexualActivity(data.sexualActivityStatus))
        history.push("/health/summary");
    }


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
                setValue('patientName', dataName)
                setPatientID(dataPatientID)
                setValue('gender', dataGender)
                setAge(calculate_age(dataDOB))
                setValue("dob", new Date(dataDOB).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
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
     const calculate_age = (dob1: string) => {
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
    const getBloodPressure = async (patientID: number) => {
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
            setValue('systolicBloodPressure', systolic)
            setValue('diastolicBloodPressure', diastolic)
            setValue('bloodPressureRecorded', new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            console.log("Blood pressure retrieval succesful");
        } else {
            setValue('systolicBloodPressure', '')
            setValue('diastolicBloodPressure', '')
            setValue('bloodPressureRecorded', '')
            console.log("Blood pressure not taken");
            return
        }
    }

    //Retrieve Patients Weight via PatientID
    const getWeight = async (patientID: number) => {
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
            setValue('weight', weight)
            setValue('weightRecorded', new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
            console.log("Weight retrieval succesful");
        } else {
            setValue('weight', '')
            setValue('weightRecorded', '')
            console.log("Weight not taken");
            return
        }
    }

    //Retrieve Patients Height via PatientID
    const getHeight = async (patientID: number) => {
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
            setValue('height', feet_and_inches)
            console.log("Height retrieval succesful");
        } else {
            setValue('height', '')
            console.log("Height not taken");
            return
        }
    }


    //Retrieve Patients Smoking Status via PatientID
    const smoking_status = async (patientID: number) => {
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
                setValue('smokingStatus', no_smoking_status)
                console.log("Smoking Status retrieval succesful");
            } else {
                var has_smoking_status = "Y"
                setValue('smokingStatus', has_smoking_status)
                console.log("Smoking Status retrieval succesful");
            }
        } else {
            var no_smoking_status_entry = "N"
            setValue('smokingStatus', no_smoking_status_entry)
            console.log("Smoking Status retrieval succesful");
        }
    }

    /*
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
        dispatch(getBloodPressureRecorded(bloodpressureRecored))
        dispatch(getTobaccoUsage(smokingStatus))
        history.push("/health/summary");
    }
    */

    return (
        <Page>
        {submitComplete ? (
            <>
                {/*
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
                */}
                <form onSubmit={handleSubmit(onSubmit)}>
                        <h1>Preventative Health Check</h1>
                        <p className="pageDescription">The information below is needed to get the most personalized list of recommendations from the US Preventative Services Task Force.</p>
                        <p className="pageDescription">All fields are optional.</p>
                        <Row>
                            <Col>
                                <h2>Date of Birth</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("dob", { required: true })}
                                placeholder="dob"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Sex at Birth</h2>
                            </Col>
                            <Col>
                                <select {...register("gender")} disabled={disabled}>
                                    <option value="">Select...</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Height</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("height", { required: true })}
                                placeholder="height"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Weight</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("weight", { required: true })}
                                placeholder="weight"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Date Weight Recorded</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("weightRecorded", { required: true })}
                                placeholder="weightRecorded"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Diastolic Blood Pressure</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("diastolicBloodPressure", { required: true })}
                                placeholder="diastolicBloodPressure"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Systolic Blood Pressure</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("systolicBloodPressure", { required: true })}
                                placeholder="systolicBloodPressure"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Blood Pressure Recorded</h2>
                            </Col>
                            <Col>
                                <input
                                {...register("bloodPressureRecorded", { required: true }) }
                                placeholder="bloodPressureRecorded"
                                disabled={disabled}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Pregnant</h2>
                            </Col>
                            <Col>
                                <select {...register("pregnancyStatus")} disabled={disabled}>
                                    <option value="">Select...</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Tobacco Use</h2>
                            </Col>
                            <Col>
                                <select {...register("smokingStatus")} disabled={disabled}>
                                    <option value="">Select...</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h2>Sexually Active</h2>
                            </Col>
                            <Col>
                                <select {...register("sexualActivityStatus")} disabled={disabled}>
                                    <option value="">Select...</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "20px"}}>
                            <Col>
                           <Button /*variant='form' type="submit"*/> Next </Button>
                            </Col>
                            <Col>
                                <Button /*variant='edit'*/ onClick={() => setDisable((d) => !d)}>
                                    Edit Form
                                </Button>
                            </Col>
                        </Row>
                </form>
            </>
          ) : (
            <>
                 <h2>Retrieving Patient Info</h2>
                 <ProgressCircular indeterminate />
            </>
         )}
        </Page>
    )
}

export default PatientInfo;
