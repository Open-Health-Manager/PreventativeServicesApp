import { createSlice } from '@reduxjs/toolkit'

const patientSlice = createSlice({
    name: 'patient',
    initialState: {
        patientUserName: "",
        patientID: "",
        patientName: "",
        dob: "",
        age: "",
        gender: "",
        patientHeight: "",
        patientWeight: "",
        weightRecorded: "",
        diastolicBloodPressure: "",
        systolicBloodPressure: "",
        bloodPressureRecorded: "",
        pregnancyStatus: "",
        tobaccoUsage: "",
        sexuallyActive: "",
        status: "initialState"
    },
    reducers: {
        getPatientUserName: (state, action) => { state.patientUserName = action.payload },
        getPatientID: (state, action) => { state.patientID = action.payload },
        getPatientAge: (state, action) => { state.age = action.payload},
        getPatientName: (state, action) => { state.patientName = action.payload},
        getDOB: (state, action) => { state.dob = action.payload },
        getGender: (state, action) => { state.gender = action.payload },
        getPatientHeight: (state, action) => { state.patientHeight = action.payload },
        getPatientWeight: (state, action) => { state.patientWeight = action.payload },
        getWeightRecorded: (state, action) => { state.weightRecorded = action.payload },
        getDiastolicBloodPressure: (state, action) => { state.diastolicBloodPressure = action.payload },
        getSystolicBloodPressure: (state, action ) => { state.systolicBloodPressure = action.payload },
        getBloodPressureRecorded: (state, action) => { state.bloodPressureRecorded = action.payload },
        getPregnancyStatus: (state, action) => { state.pregnancyStatus = action.payload },
        getTobaccoUsage: (state, action) => { state.tobaccoUsage = action.payload },
        getSexualActivity: (state, action) => { state.sexuallyActive = action.payload }, 
        getStatusState: (state, action) => { state.status = action.payload }, 
    }
})

export const { getPatientUserName, getPatientID, getPatientAge, getPatientName, getDOB, getGender, getPatientHeight, getPatientWeight, getWeightRecorded, getDiastolicBloodPressure, getSystolicBloodPressure, getBloodPressureRecorded, getPregnancyStatus, getTobaccoUsage, getSexualActivity, getStatusState } = patientSlice.actions

export default patientSlice