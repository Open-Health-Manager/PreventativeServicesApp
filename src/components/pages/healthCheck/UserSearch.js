import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { getPatientUserName } from '../../../store/patientSlice'

import { Container, Row, Col, Button } from "react-bootstrap";

function UserSearch() {
    const dispatch = useDispatch()
    const history = useHistory()
    const patientUserName = useSelector(state => state.patient.patientUserName)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { patientUserName },
        mode: 'onTouched',
    });

    const onSubmit = (data) => {
        dispatch(getPatientUserName(data.patientUserName))
        history.push("/health/patient")
    }

    return (
        <Container fluid className="content-block">
            <Row style={{ paddingTop: "20px" }}>
                    <Col md={6}>
                        <h1>Health Check Search</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input className="form-control" type="text" id="patientUserName" name="patientUserName" {...register("patientUserName", { required: true })}/>
                            {errors.patientUserName && <p className="error-text">user name is required</p>}
                            <Button variant='form' type="submit">Submit</Button>
                        </form>
                    </Col>
            </Row>
        </Container>
    )
}

export default UserSearch;
