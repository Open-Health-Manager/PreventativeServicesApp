import { Navigator, Page, BackButton, Toolbar } from 'react-onsenui';

export type SignInProps = {
    navigator: Navigator<{ page: string | number }>;
}

function SignIn(props: SignInProps) {
    return <Page
        renderToolbar={() => <Toolbar><div className="left"><BackButton/></div></Toolbar>}
    >Sign In</Page>;
}

export default SignIn;