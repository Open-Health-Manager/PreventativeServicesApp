import { Button, Navigator, Page, BackButton, Toolbar } from 'react-onsenui';
import { useForm } from 'react-hook-form';
import SignInPage from './SignInPage';
import SignInTextField from './SignInTextField';

import './SignIn.css';

export type SignInProps = {
    navigator: Navigator<{ page: string | number }>;
    rules?: { require: boolean };
}

function SignIn(props: SignInProps) {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const submit = (data: { email: string, password: string }) => {
        console.log('sign in as ' + data.email);
    };
    return <SignInPage>
        <h1>Sign In</h1>
        <SignInTextField
            name="email"
            icon="md-email"
            type="email"
            control={control}
            placeholder="Email Address"
            />
        <SignInTextField
            name="password"
            icon="md-lock"
            type="password"
            control={control}
            placeholder="Password"
            />
        <div className="sign-in-button">
            <Button onClick={handleSubmit(submit)}>Sign In</Button>
        </div>
    </SignInPage>;
}

export default SignIn;