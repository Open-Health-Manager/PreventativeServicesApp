import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form';
import { getPatientUserName } from '../../../store/patientSlice'

import { Page, Toolbar, List, ListItem, Input, Button, Navigator } from "react-onsenui";


type UserSearchForm = {
    patientUserName?: string;
};

export type UserSearchProperties = {
    navigator?: Navigator;
};

function UserSearch(props: UserSearchProperties) {
    const dispatch = useDispatch()

    const patientUserName = useSelector(state => state.patient.patientUserName)
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { patientUserName },
        mode: 'onTouched',
    });

    const onSubmit = (data: UserSearchForm) => {
        dispatch(getPatientUserName(data.patientUserName))
        console.log(props.navigator);
        props.navigator?.pushPage({id: 'summary'});
    }

    return (
        <Page
            renderToolbar={() => <Toolbar>
                <div className="center">Health Check Search</div>
            </Toolbar>}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <List>
                    <ListItem key="username">
                        <Controller name="patientUserName" control={control} render={({field}) => <Input type="text" autoComplete="username" autoCapitalize="off" placeholder="Username" float {...field}/>} />
                        <div className="list-item__subtitle">{errors.patientUserName ? 'User name is required' : ''}</div>
                    </ListItem>
                    <ListItem key="submit">
                        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
                    </ListItem>
                </List>
            </form>
        </Page>
    )
}

export default UserSearch;
