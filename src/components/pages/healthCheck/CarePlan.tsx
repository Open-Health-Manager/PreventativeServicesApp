import React from 'react'
import Header from '../../header/header'
import { Page, List, ListHeader, ListItem } from "react-onsenui";
import { useSelector } from 'react-redux'
import '../../../types/state';

function CarePlan() {
    const specificRecommendationsList = useSelector(state => state.specificRecommendations.RecommendationsList)
    const patientInfo = useSelector(state => state.patient)

    return (
        <Page>
            <Header />
            <h1>Care Plan</h1>
            <List>
                { specificRecommendationsList.filter(item => item.id === 1921).map((item) => (
                    <>
                    <ListHeader>{item.title}</ListHeader>
                    <ListItem>Latest Blood Pressure Reading</ListItem>
                    <ListItem>Blood Pressure: {patientInfo.systolicBloodPressure}/{patientInfo.diastolicBloodPressure} mmHg</ListItem>
                    <ListItem>Date Blood Pressure Recorded: {patientInfo.bloodPressureRecorded}</ListItem>
                    </>
                ))}
            </List>
        </Page>
    )
}

export default CarePlan;