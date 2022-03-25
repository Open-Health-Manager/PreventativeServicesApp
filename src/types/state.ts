import { Patient } from './patient';

declare module "react-redux" {
    interface DefaultRootState {
        patient: Patient;
    }
}