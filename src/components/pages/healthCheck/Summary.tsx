import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { List, ListItem, Page, ProgressCircular, Button, Toolbar, Navigator } from "react-onsenui";
import axios from "axios";
import { addSpecificRecommendations, deleteSpecificRecommendation } from '../../../store/specificRecommendationsSlice';
import { getPatientID, getDOB, getGender, getPatientAge, getPatientName, getPatientHeight, getPatientWeight, getWeightRecorded, getDiastolicBloodPressure, getSystolicBloodPressure, getBloodPressureRecorded, getTobaccoUsage } from '../../../store/patientSlice'
import { SpecificRecommendation } from '../../../types/uspstf';


//import "./Summary.css"; // Import styling

import '../../../types/state';

export type SummaryProperties = {
    navigator: Navigator<{id: string}>;
};


function Summary(props: SummaryProperties) {

    const dispatch = useDispatch()
    const patientUserName = useSelector(state => state.patient.patientUserName)
    const patientName = useSelector(state => state.patient.patientName)
    const patientAge = useSelector(state => state.patient.age)
    const status = useSelector(state => state.patient.status)

    const RecommendationsList = useSelector(state => state.specificRecommendations.RecommendationsList)
    const [submitComplete, setSubmitComplete] = useState(false);

    const [userLookupError, setUserLookupError] = useState('');

    const [specificRecommendationsList, setSpecificRecommendationsList] = useState<SpecificRecommendation[]>([]);


    useEffect(() => {
        if(status! == "initialState"){
            fetchPreventativeServiceData()
        } else {
        setSubmitComplete(true)
        }
    }, [])


    const prioritizeList = (data: { specificRecommendations: SpecificRecommendation[] }) => {
            const specificRecommendations = data.specificRecommendations
            console.log("initialize specificRecommendations", specificRecommendations)

            const prioritizeSet = new Set([1921]);

            const newArr = specificRecommendations.sort((a, b) =>
                // Basically: if B is priority and A is not, it is smaller
                // If A is priority and B is not, it is smaller
                // Otherwise, leave alone
                // So in the priority set, 0, not, 1
                (prioritizeSet.has(a.id) ? 0 : 1) - (prioritizeSet.has(b.id) ? 0 : 1)
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
            dispatch(addSpecificRecommendations(specificRecommendations))
        }

        const fetchPreventativeServiceData = async () => {
            // Blank the lookup error for now
            setUserLookupError('');
            console.log(`Looking up user "${patientUserName}"`);
            const submission = {
                userName: patientUserName
            }
            const response = await axios({
                method: "POST",
                url: "http://localhost:4002/search_username",
                data: submission
            });
            if (response.status === 200 && response.data.entry?.length > 0) {
                const patient = response.data.entry[0]?.resource;
                if (!patient) {
                    console.log('Patient not found');
                    return;
                }
                const patientID = patient.id;
                const gender = patient.gender;
                const dob = patient.birthDate;
                const formattedDOB = new Date(dob).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'})
                // Name is optional
                let dataName = 'Unknown';
                if (Array.isArray(patient.name) && patient.name.length > 0) {
                    if (Array.isArray(patient.name[0].given) && patient.name[0].given.length > 0 && typeof patient.name[0].given[0] === 'string') {
                        dataName = patient.name[0].given[0];
                        dispatch(getPatientName(dataName))
                    }
                }
                dispatch(getPatientID(patientID))
                dispatch(getDOB(formattedDOB))
                dispatch(getGender(gender))
                console.log(new Date(dob).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'}))
                try {
                    // Do the stuff we can do in parallel in parallel
                    await Promise.all([
                        getBloodPressure(patientID),
                        getBMI(patientID),
                        getHeight(patientID),
                        getWeight(patientID)
                    ]);
                const preventative_services_data = await preventatives_services(gender, calculate_age(dob), await smoking_status(patientID));
                prioritizeList(preventative_services_data)
                } catch (ex) {
                    console.log('exception loading data:');
                }
                setSubmitComplete(true)
            } else if ((response.status === 200 && !('entry' in response.data && response.data.entry.length > 0)) || response.status === 404) {
                console.log("Patient not found");
                setUserLookupError(`User ${patientUserName} not found.`);
            } else {
                setUserLookupError('An unknown error happened while looking up patient data.');
            }
        }


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
        dispatch(getPatientAge(age_now))
        return age_now;
    }

    //make query to search for smoking status of Patient
    const smoking_status = async (patientID: string) => {
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
                var smoking_staus = "N"
                dispatch(getTobaccoUsage(smoking_staus))
                return "N"
            } else {
                var smoking_staus = "Y"
                dispatch(getTobaccoUsage(smoking_staus))
                return "Y"
            }
        } else {
            var smoking_staus = "N"
            dispatch(getTobaccoUsage(smoking_staus))
            return "N"
        }
    }

    //make query to preventative services to provide list of potential services for patient to front-end client
    const preventatives_services = async (gender: string, age: number, smokingStatus: string) => {
        console.log(gender);
        console.log(age);
        console.log(smokingStatus);
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
        console.log("preventative services success");
        return data;
    }

    const getBMI = async (patientID: string) => {
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
            console.log("BMI retrieval succesful");
        } else {
            console.log("BMI not taken");
            return
        }
    }

    const getHeight = async (patientID: string) => {
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
            dispatch(getPatientHeight(feet_and_inches))
            console.log("Height retrieval succesful");
        } else {
            console.log("Height not taken");
            return
        }
    }

    const getWeight = async (patientID: string) => {
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
            var weightRecorded = new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'})
            dispatch(getPatientWeight(weight))
            dispatch(getWeightRecorded(weightRecorded))
            console.log("Weight retrieval succesful");
        } else {
            console.log("Weight not taken");
            return
        }
    }

    const getBloodPressure = async (patientID: string) => {
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
            var bloodPressureRecorded = new Date(data.data.entry[0].resource.issued).toLocaleDateString("en-us", {year: 'numeric', month: 'long', day: 'numeric'})
            dispatch(getDiastolicBloodPressure(diastolic))
            dispatch(getSystolicBloodPressure(systolic))
            dispatch(getBloodPressureRecorded(bloodPressureRecorded))
            console.log("Blood pressure retrieval succesful");
        } else {
            console.log("Blood pressure not taken");
            return
        }
    }

    const filterItem = (id: number) => {
        console.log(id)
        const filteredItem = specificRecommendationsList.filter(item => item.id !== id)
        setSpecificRecommendationsList(filteredItem)
        dispatch(deleteSpecificRecommendation({id}))
    }

    const goToPatientPage = () => {
        console.log(props.navigator);
        props.navigator.pushPage({id: 'patient'});
    }

    return (
        <Page renderToolbar={() => <Toolbar><div className="center">{patientName}</div></Toolbar>}>
         {submitComplete ? (
            <>
                <h2 style={{ paddingBottom: "5px", paddingLeft: "15px" }}>Get Started: Preventative Health Check</h2>

                {  RecommendationsList?.length > 0 ?
                    <List>
                        { RecommendationsList.map((item) => (
                            <ListItem expandable key={item.id}>
                                <div className="left">{item.title}</div>
                                <div className="expandable-content">
                                    <p>Based on: </p>
                                    <p><Button onClick={() => goToPatientPage()}>current patient data  &gt;</Button></p>
                                    {item.text}
                                    <p><Button onClick={() => filterItem(item.id)}>Ignore</Button></p>
                                </div>
                            </ListItem>
                            ))}
                    </List> : ''
                }
            </>
            ) : (
            <>
                <h2>Retrieving Preventative Health Information</h2>
                <ProgressCircular indeterminate/>
            </>
         )}

        </Page>
    )
}

export default Summary;

