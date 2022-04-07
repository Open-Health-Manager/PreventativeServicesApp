import { Checkbox, Page, Toolbar, BackButton } from 'react-onsenui';

function SignaturePage() {
    return <Page
    renderToolbar={() =>
        <Toolbar><div className="left"><BackButton/></div></Toolbar>
    }>
        <h1>Signature</h1>
        <p><input type="text" placeholder="Type your full name to sign"></input></p>
        <p><Checkbox></Checkbox> By checking this box, I understand and agree to the terms of the Patient Data Use Agreement and acknowledge that typing my name above represents my electronic signature.</p>
    </Page>
}

export default SignaturePage;