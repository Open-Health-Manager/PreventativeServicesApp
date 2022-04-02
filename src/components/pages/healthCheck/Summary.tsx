import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { List, ListItem, Page, ProgressCircular, Button, Toolbar } from "react-onsenui";
import axios from "axios";
import { addSpecificRecommendations, deleteSpecificRecommendation } from '../../../store/specificRecommendationsSlice';
import { SpecificRecommendation } from '../../../types/uspstf';

//import "./Summary.css"; // Import styling

import '../../../types/state';

function Summary() {

    const dispatch = useDispatch()
    const patientName = useSelector(state => state.patient.patientName)
    const patientAge =  useSelector(state => state.patient.age)
    const patientGender =  useSelector(state => state.patient.gender)
    const patientSmokingStatus =  useSelector(state => state.patient.tobaccoUsage)
    const RecommendationsList = useSelector(state => state.specificRecommendations.RecommendationsList)
    const [submitComplete, setSubmitComplete] = useState(false);

    const [specificRecommendationsList, setSpecificRecommendationsList] = useState<SpecificRecommendation[]>([]);

    useEffect(() => {
        const prioritizeList = (data: { specificRecommendations: SpecificRecommendation[] }) => {
            const specificRecommendations = data.specificRecommendations
            console.log("initialize specificRecommendations", specificRecommendations)

            const prioritizeSet = new Set([1921]);

            const newArr = specificRecommendations.sort((a, b) =>
                // Basically: if B is priority and A is not, it is smaller
                // If A is priority and B is not, it is smaller
                // Otherwise, leave alone
                // So in the priority set, 0, not, 1
                (prioritizeSet.has(b.id) ? 0 : 1) - (prioritizeSet.has(a.id) ? 0 : 1)
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
            console.log(patientGender)
            console.log(patientAge)
            console.log(patientSmokingStatus)
            const response = await axios({
                method: "POST",
                url: "http://localhost:4002/preventatives_services",
                data: {
                    gender: patientGender,
                    age: patientAge,
                    smokingStatus: patientSmokingStatus
                },
            });
            if (response.status === 200){
                var data = response.data;
                prioritizeList(data);
                console.log("Preventative Service Call Succesful", data)
                setSubmitComplete(true);
            } else if(response.status === 404){
                console.log("Preventative Service Call not Succesful")
            }
          };
          fetchPreventativeServiceData();
    }, [patientGender, patientAge, patientSmokingStatus, dispatch]);

    const filterItem = (id: number) => {
        console.log(id)
        const filteredItem = specificRecommendationsList.filter(item => item.id !== id)
        setSpecificRecommendationsList(filteredItem)
        dispatch(deleteSpecificRecommendation({id}))
    }

    return (
        <Page
            renderToolbar={() => <Toolbar><div className="center">{patientName}</div></Toolbar>}>
         {submitComplete ? (
            <>
                <h2 style={{ paddingBottom: "30px" }}>Get Started: Preventative Health Check</h2>

                {  RecommendationsList?.length > 0 ?
                    <List>
                        { RecommendationsList.map((item) => (
                            <ListItem expandable key={item.id}>
                                <div className="left">{item.title}</div>
                                <div className="expandable-content">
                                    {item.text}
                                    <p><Button /*variant='ignore' type="submit"*/ onClick={() => filterItem(item.id)}>Ignore</Button></p>
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
