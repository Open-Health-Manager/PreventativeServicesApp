import { useState } from 'react';
import { Checkbox, Button, Input, Page, Toolbar, BackButton, Navigator } from 'react-onsenui';

import { ComicRoute } from './ComicPage';

export type SignaturePageProps = {
    navigator: Navigator<ComicRoute>;
};

function SignaturePage(props: SignaturePageProps) {
    // This doesn't use react-form-hook since it's less of a form and more of a set of inputs that determine if the
    // agreement can be accepted.
    const [legalName, setLegalName] = useState('');
    const [checked, setChecked] = useState(false);
    const isValid = legalName && checked;
    return <Page
        renderToolbar={() =>
            <Toolbar><div className="left"><BackButton/></div></Toolbar>
        }>
            <h1>Signature</h1>
            <p>
                <Input type="text" placeholder="Type your full name to sign" float value={legalName} onChange={(event) => { setLegalName(event.target.value) }}/>
            </p>
            <p>
                <Checkbox checked={checked} onChange={(event) => {
                    if (event.target) {
                        const checkbox = event.target as HTMLInputElement;
                        setChecked(checkbox.checked);
                    }
                }}/> By checking this box, I understand and agree to the terms of the <a href="#" target="_blank">Patient Data Use Agreement</a> and acknowledge that typing my name above represents my electronic signature.</p>
            <p><Button>Disagree</Button><Button onClick={() => {
                // If valid, allow the user to proceed
                props.navigator.pushPage({page: 'createAccount'});
            }} disabled={!isValid}>Agree</Button></p>
        </Page>;
}

export default SignaturePage;