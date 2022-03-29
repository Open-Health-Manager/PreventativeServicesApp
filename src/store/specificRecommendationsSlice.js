import { createSlice } from '@reduxjs/toolkit'

const specificRecommendationsSlice = createSlice({
    name: 'specificRecommendations',
    initialState: {
        RecommendationsList: []
    },
    reducers: {
        addSpecificRecommendations(state, action) {
            // "Mutate" the existing state, no return value needed
            state.RecommendationsList.push(action.payload)
        },
        deleteSpecificRecommendation(state, action) {
            const {id} = action.payload
            console.log(id)
            // Construct a new result array immutably 
            const newSpecificRecommendations = state.RecommendationsList[0].filter(RecommendationsList => RecommendationsList.id !== id)
            // "Mutate" the existing state to save the new array
            state.RecommendationsList[0] = newSpecificRecommendations
        },
    }
})


export const { addSpecificRecommendations, deleteSpecificRecommendation } = specificRecommendationsSlice.actions


export default specificRecommendationsSlice