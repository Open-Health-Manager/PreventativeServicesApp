import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { getPatientUserName } from '../../../store/patientSlice'

import { Page, Button } from "react-onsenui";

type UserSearchForm = {
    patientUserName: string;
};

function UserSearch() {
    const dispatch = useDispatch()
    const history = useHistory()
    const patientUserName = useSelector(state => state.patient.patientUserName)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { patientUserName },
        mode: 'onTouched',
    });

    const onSubmit = (data: UserSearchForm) => {
        dispatch(getPatientUserName(data.patientUserName))
        history.push("/health/patient")
    }

    return (
        <Page>
            <h1>Health Check Search</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className="form-control" type="text" id="patientUserName" {...register("patientUserName", { required: true })}/>
                {errors.patientUserName && <p className="error-text">user name is required</p>}
                <Button /*variant='form' type="submit"*/>Submit</Button>
            </form>
        </Page>
    )
}

export default UserSearch;
