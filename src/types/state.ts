import { Patient } from './patient';
import { SpecificRecommendation } from './uspstf';

export type RecommendationListState = {
    RecommendationsList: SpecificRecommendation[];
};

declare module "react-redux" {
    interface DefaultRootState {
        patient: Patient;
        specificRecommendations: RecommendationListState;
    }
}