import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RecommendationListState } from '../types/state';
import { SpecificRecommendation } from '../types/uspstf';

const specificRecommendationsSlice = createSlice({
    name: 'specificRecommendations',
    initialState: {
        RecommendationsList: []
    } as RecommendationListState,
    reducers: {
        addSpecificRecommendations(state, action: PayloadAction<SpecificRecommendation[]>) {
            // "Mutate" the existing state, no return value needed
            state.RecommendationsList.push(...action.payload)
        },
        deleteSpecificRecommendation(state, action: PayloadAction<{id: number}>) {
            const {id} = action.payload
            console.log(id)
            // Construct a new result array immutably
            const newSpecificRecommendations = state.RecommendationsList.filter(recommendation => recommendation.id !== id)
            // "Mutate" the existing state to save the new array
            state.RecommendationsList = newSpecificRecommendations
        },
    }
})


export const { addSpecificRecommendations, deleteSpecificRecommendation } = specificRecommendationsSlice.actions


export default specificRecommendationsSlice