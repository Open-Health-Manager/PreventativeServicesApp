import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from "react-hook-form";
import { BackButton, Button, Page, List, ListItem, Input, ProgressCircular, Toolbar, Select, Navigator } from "react-onsenui";
import axios from "axios";
import { getPatientID, getDOB, getGender, getPatientAge, getPatientName, getPatientHeight, getPatientWeight, getWeightRecorded, getDiastolicBloodPressure, getSystolicBloodPressure, getBloodPressureRecorded, getPregnancyStatus, getTobaccoUsage, getSexualActivity, getStatusState, getPatientUserName} from '../../../store/patientSlice'

import { Patient } from '../../../types/patient';
//import "./PatientInfo.css"; // Import styling

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
    status: string;
}

export type PatientInfoProps = {
    navigator?: Navigator;
};

function PatientInfo(props: PatientInfoProps) {
    const dispatch = useDispatch()
    
    const patientName = useSelector(state => state.patient.patientUserName)
    const gender = useSelector(state => state.patient.gender)
    const dob = useSelector(state => state.patient.dob)
    const systolicBloodPressure = useSelector(state => state.patient.systolicBloodPressure)
    const diastolicBloodPressure = useSelector(state => state.patient.diastolicBloodPressure)
    const bloodPressureRecorded = useSelector(state => state.patient.bloodPressureRecorded)
    const patientWeight = useSelector(state => state.patient.patientWeight)
    const weightRecorded = useSelector(state => state.patient.weightRecorded)
    const height = useSelector(state => state.patient.patientHeight)
    const smokingStatus = useSelector(state => state.patient.tobaccoUsage)

    const { control, handleSubmit } = useForm({
        defaultValues: {
            patientName: patientName!,
            gender: gender!,
            dob: dob!,
            systolicBloodPressure: systolicBloodPressure!,
            diastolicBloodPressure: diastolicBloodPressure!,
            bloodPressureRecorded: bloodPressureRecorded!,
            weight: patientWeight!,
            weightRecorded: weightRecorded!,
            height: height!,
            smokingStatus: smokingStatus!,
            pregnancyStatus: "N",
            sexualActivityStatus: "N",
            status: "updated"
        }
    });
    const [disabled, setDisable] = useState(true);
    const onSubmit = (data: PatientFormValues) => {
        console.log(data)
        dispatch(getStatusState(data.status))
        dispatch(getPatientUserName(data.patientName))
        dispatch(getDOB(data.dob))
        dispatch(getGender(data.gender))
        dispatch(getPatientHeight(data.height))
        dispatch(getPatientWeight(data.weight))
        dispatch(getWeightRecorded(data.weightRecorded))
        dispatch(getDiastolicBloodPressure(Number(data.diastolicBloodPressure)))
        dispatch(getSystolicBloodPressure(Number(data.systolicBloodPressure)))
        dispatch(getBloodPressureRecorded(data.bloodPressureRecorded))
        dispatch(getPregnancyStatus(data.pregnancyStatus))
        dispatch(getTobaccoUsage(data.smokingStatus))
        dispatch(getSexualActivity(data.sexualActivityStatus))
        console.log(props.navigator)
        if (props.navigator)
            props.navigator.pushPage({ id: 'summary' });
    }

    return (
        <Page
            renderToolbar={() => <Toolbar><div className="left"><BackButton/></div><div className="center">Preventative Health Check</div></Toolbar>}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className="pageDescription">The information below is needed to get the most personalized list of recommendations from the US Preventative Services Task Force.</p>
                    <p className="pageDescription">All fields are optional.</p>
                    <List>
                        <ListItem>
                            <div className="left">Date of Birth</div>
                            <div className="right">
                                <Controller name="dob" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="DOB" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Sex at Birth</div>
                            <div className="right">
                                <Controller name="gender" control={control}
                                    render={({field}) =>
                                        <Select disabled={disabled} {...field}>
                                            <option value="">Select...</option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                        </Select>
                                    } />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Height</div>
                            <div className="right">
                                <Controller name="height" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="height" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Weight</div>
                            <div className="right">
                                <Controller name="weight" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="weight" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Date Weight Recorded</div>
                            <div className="right">
                                <Controller name="weightRecorded" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="weightRecorded" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Diastolic Blood Pressure</div>
                            <div className="right">
                                <Controller name="diastolicBloodPressure" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="diastolicBloodPressure" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Systolic Blood Pressure</div>
                            <div className="right">
                                <Controller name="systolicBloodPressure" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="systolicBloodPressure" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Blood Pressure Recorded</div>
                            <div className="right">
                                <Controller name="bloodPressureRecorded" control={control} rules={{required: true}} render={({field}) => <Input type="text" placeholder="bloodPressureRecorded" disabled={disabled} {...field}/>} />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Pregnancy Status</div>
                            <div className="right">
                                <Controller name="pregnancyStatus" control={control}
                                    render={({field}) =>
                                        <Select disabled={disabled} {...field}>
                                            <option value="">Select...</option>
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                        </Select>
                                    } />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Tobacco Use</div>
                            <div className="right">
                                <Controller name="smokingStatus" control={control}
                                    render={({field}) =>
                                        <Select disabled={disabled} {...field}>
                                            <option value="">Select...</option>
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                        </Select>
                                    } />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left">Sexually Active</div>
                            <div className="right">
                                <Controller name="sexualActivityStatus" control={control}
                                    render={({field}) =>
                                        <Select disabled={disabled} {...field}>
                                            <option value="">Select...</option>
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                        </Select>
                                    } />
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className="left"><Button onClick={((submit) => { return () => { console.log('submitting'); submit(); }})(handleSubmit(onSubmit))}>Update</Button></div>
                            <div className="right"><Button onClick={() => setDisable((d) => !d)}>Edit Form</Button></div>
                        </ListItem>
                    </List>
                </form>
        </Page>
    )
}

export default PatientInfo;
