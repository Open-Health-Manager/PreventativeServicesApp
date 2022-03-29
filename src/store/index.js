import { configureStore } from '@reduxjs/toolkit'
import patientSlice from './patientSlice'
import specificRecommendationsSlice from './specificRecommendationsSlice'

const store = configureStore({
    reducer: { patient: patientSlice.reducer, specificRecommendations: specificRecommendationsSlice.reducer }
})

export default store