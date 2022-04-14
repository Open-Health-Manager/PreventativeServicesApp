import React, { useState, useEffect } from 'react';
import { Card, Page, List, ListItem, Toolbar} from "react-onsenui";
import { useSelector } from 'react-redux'
import '../../../types/state';
import { FaExclamationTriangle } from 'react-icons/fa';


import "./CarePlan.css"; // Import styling

function CarePlan() {

    const patientInfo = useSelector(state => state.patient)
    const bloodPressureReadingString = patientInfo.systolicBloodPressure + "/" + patientInfo.diastolicBloodPressure + " mmHg"
    const [bloodPressureCheck, setBloodPressureCheck] = useState(false);

    const [diastolicStatus, setDiastolicStatus] = useState('')
    const [systolicStatus, setSystolicStatus] = useState('')
   
    const [healthyStatus, setHealthyStatus] = useState('')
    const [cautiousStatus, setCautiousStatus] = useState('')
    const [dangerousStatus, setDangerousStatus] = useState('')

    const convertedBloodPressureRecorded = Date.parse(new Date(patientInfo.bloodPressureRecorded!).toLocaleDateString('en-US'))
    const previousYearCheck = Date.parse(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString('en-US'))
    const currentYearCheck =  Date.parse(new Date().toLocaleDateString('en-US'))

    useEffect(() => {
        const checkBloodPressureStatus = () => {
            if((patientInfo.age! >= 18 && patientInfo.age! <= 59)){
                if((Number(patientInfo.systolicBloodPressure!)) && (Number(patientInfo.diastolicBloodPressure!))){
                    if((Number(patientInfo.systolicBloodPressure!) >= 90 && Number(patientInfo.systolicBloodPressure!) <= 139)){
                        var state = "healthy"
                        setSystolicStatus(state)
                    }
                    if((Number(patientInfo.systolicBloodPressure!) >= 140 && Number(patientInfo.systolicBloodPressure!) <= 179)){
                        var state = "cautious"
                        setSystolicStatus(state)
                    } 
                    if((Number(patientInfo.systolicBloodPressure!) >= 180) ){
                        var state = "dangerous"
                        setSystolicStatus(state)
                    } 
                    if((Number(patientInfo.diastolicBloodPressure!) >= 60 && Number(patientInfo.diastolicBloodPressure!) <= 89)){
                        var state = "healthy"
                        setDiastolicStatus(state)
                    }
                    if((Number(patientInfo.diastolicBloodPressure!) >= 90 && Number(patientInfo.diastolicBloodPressure!) <= 109)){
                        var state = "cautious"
                        setDiastolicStatus(state)
                    }
                    if((Number(patientInfo.diastolicBloodPressure!) >= 110)){
                        var state = "dangerous"
                        setDiastolicStatus(state)
                    }
                }
            } else if((patientInfo.age! >= 60)){
                if((Number(patientInfo.systolicBloodPressure!)) && (Number(patientInfo.diastolicBloodPressure!))){
                    if((Number(patientInfo.systolicBloodPressure!) >= 90 && Number(patientInfo.systolicBloodPressure!) <= 149)){
                        var state = "healthy"
                        setSystolicStatus(state)
                    }
                    if((Number(patientInfo.systolicBloodPressure!) >= 150 && Number(patientInfo.systolicBloodPressure!) <= 179)){
                        var state = "cautious"
                        setSystolicStatus(state)
                    } 
                    if((Number(patientInfo.systolicBloodPressure!) >= 180) ){
                        var state = "dangerous"
                        setSystolicStatus(state)
                    } 
                    if((Number(patientInfo.diastolicBloodPressure!) >= 60 && Number(patientInfo.diastolicBloodPressure!) <= 89)){
                        var state = "healthy"
                        setDiastolicStatus(state)
                    }
                    if((Number(patientInfo.diastolicBloodPressure!) >= 90 && Number(patientInfo.diastolicBloodPressure!) <= 109)){
                        var state = "cautious"
                        setDiastolicStatus(state)
                    }
                    if((Number(patientInfo.diastolicBloodPressure!) >= 110)){
                        var state = "dangerous"
                        setDiastolicStatus(state)
                    }
                }
            }
        }
        checkBloodPressureStatus()
    }, []);

    useEffect(() => {
        const prioritizeBloodPRessureStatus = () => {
            console.log(systolicStatus)
            console.log(diastolicStatus)
            
            if(systolicStatus == "healthy" && diastolicStatus == "healthy"){
                console.log("Your blood pressure is within Healthy ranges")
                var statusText = "healthy"
                setHealthyStatus(statusText)
            }
            if(systolicStatus == "healthy" && diastolicStatus == "cautious"){
                console.log("Your blood pressure is within cautious ranges")
                var statusText = "cautious"
                setCautiousStatus(statusText)
            }
            if(systolicStatus == "cautious" && diastolicStatus == "healthy"){
                console.log("Your blood pressure is within cautious ranges")
                var statusText = "cautious"
                setCautiousStatus(statusText)
            }
            if(systolicStatus == "cautious" && diastolicStatus == "cautious"){
                console.log("Your blood pressure is within cautious ranges")
                var statusText = "cautious"
                setCautiousStatus(statusText)
            }
            if(systolicStatus == "cautious" && diastolicStatus == "dangerous"){
                console.log("Your blood pressure is within dangerous ranges")
                var statusText = "dangerous"
                setDangerousStatus(statusText)
            }
            if(systolicStatus == "dangerous" && diastolicStatus == "cautious"){
                console.log("Your blood pressure is within dangerous ranges")
                var statusText = "dangerous"
                setDangerousStatus(statusText)
            }
            if(systolicStatus == "dangerous" && diastolicStatus == "dangerous"){
                console.log("Your blood pressure is within Dangerous ranges")
                var statusText = "dangerous"
                setDangerousStatus(statusText)
            }
            if(systolicStatus == "healthy" && diastolicStatus == "dangerous"){
                console.log("Your blood pressure is within dangerous ranges")
                var statusText = "dangerous"
                setDangerousStatus(statusText)
            }
            if(systolicStatus == "dangerous" && diastolicStatus == "healthy"){
                console.log("Your blood pressure is within dangerous ranges")
                var statusText = "dangerous"
                setDangerousStatus(statusText)
            }
        }
        prioritizeBloodPRessureStatus()
    }, [systolicStatus, diastolicStatus])


    useEffect(() => {
        const checkBloodPressureRecord = () => {

            console.log(convertedBloodPressureRecorded)
            console.log(previousYearCheck)
            console.log(currentYearCheck)
    
            if((convertedBloodPressureRecorded >= previousYearCheck) && (convertedBloodPressureRecorded <= currentYearCheck)){
                console.log("Does not need blood pressure check")
                setBloodPressureCheck(false)
            } else {
                console.log("Due for Blood Pressure Check")
                setBloodPressureCheck(true)
            }    
        }
        checkBloodPressureRecord()
    }, [convertedBloodPressureRecorded]);

    return (
        <Page
            renderToolbar={() => <Toolbar><div className="center">Care Plan</div></Toolbar>}>
        {bloodPressureCheck ? (
            <Card>
                   <ListItem expandable modifier="nodivider">
                        <div className="left">Get Blood Pressure Checked</div>
                        <div className="expandable-content">
                            <p><FaExclamationTriangle/> due for a blood pressure check</p>
                            <p className="reading_header">Latest Blood Pressure Reading</p>
                            <ListItem>Blood Pressure: {bloodPressureReadingString} </ListItem>
                            <ListItem>Date Blood Pressure Recorded: {patientInfo.bloodPressureRecorded}</ListItem>
                            { healthyStatus && 
                                <div> 
                                    <p> Your blood pressure is within <span className="healthStatusText">{healthyStatus}</span> ranges </p>
                                    <p> Recheck your BP in 365 days </p>
                                </div> 
                            }
                            { cautiousStatus && 
                                <div> 
                                    <p> Your blood pressure is within <span className="cautiousStatusText">{cautiousStatus}</span> ranges </p>
                                    <p> Recheck BP again in the next 72 hours </p>
                                </div> 
                            }
                            { dangerousStatus && 
                                <div> 
                                    <p> Your blood pressure is within <span className="dangerousStatusText">{dangerousStatus}</span> ranges </p>
                                    <p> Recheck BP again immediately </p>
                                </div> 
                            }
                            <p>We Recommend Checking your Blood Pressure Annually</p>
                        </div>
                  </ListItem>
            </Card>
            ) : (
            <Card>                   
                    <ListItem expandable modifier="nodivider">
                        <div className="left">Get Blood Pressure Checked</div>
                        <div className="expandable-content">
                            <p className="reading_header">Latest Blood Pressure Reading</p>
                            <ListItem>Blood Pressure: {bloodPressureReadingString} </ListItem>
                            <ListItem>Date Blood Pressure Recorded: {patientInfo.bloodPressureRecorded}</ListItem>
                            { healthyStatus && 
                                <div> 
                                    <p> Your blood pressure is within <span className="healthStatusText">{healthyStatus}</span> ranges </p>
                                    <p> Recheck your BP in 365 days </p>
                                </div> 
                            }
                            { cautiousStatus && 
                                <div> 
                                    <p> Your blood pressure is within <span className="cautiousStatusText">{cautiousStatus}</span> ranges </p>
                                    <p> Recheck BP again in the next 72 hours </p>
                                </div> 
                            }
                            { dangerousStatus && 
                                <div> 
                                    <p> Your blood pressure is within <span className="dangerousStatusText">{dangerousStatus}</span> ranges </p>
                                    <p> Recheck BP again immediately </p>
                                </div> 
                            }
                        </div>
                    </ListItem>
            </Card>
             )}
     </Page>
    )
}

export default CarePlan;