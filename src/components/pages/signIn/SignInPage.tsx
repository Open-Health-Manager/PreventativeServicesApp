import React from 'react';
import { Page, Toolbar, BackButton } from 'react-onsenui';

export type SignInPageProps = {
    // Currently no properties
};

// This provides the default widget stylings for both the sign in and sign up pages.
function SignInPage(props: React.PropsWithChildren<SignInPageProps>) {
    return <Page
        className="sign-in-page"
        renderToolbar={() => <Toolbar modifier="noshadow"><div className="left"><BackButton/></div></Toolbar>}
    >
        <div className="sign-in-form">{props.children}</div>
    </Page>;
}

export default SignInPage;