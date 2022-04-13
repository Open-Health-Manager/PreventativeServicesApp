import {  Navigator, Button } from 'react-onsenui';
import { useForm } from 'react-hook-form';
import SignInPage from './SignInPage';
import SignUpTextField from './SignInTextField';

// Import the sign in styles
import './SignIn.css';

export type SignUpProps = {
    navigator: Navigator<{ page: string | number }>;
}

// This page is substantially similar to the signin page, with a few differences. It uses the same "theme" though.
function SignUp(props: SignUpProps) {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: ''
        }
    });
    const submit = (data: { fullName: string, email: string}) => {
        console.log('Submit!', data)
    }
    return <SignInPage>
        <h1>Sign Up</h1>
        <SignUpTextField
            name="fullName"
            icon="md-account"
            control={control}
            placeholder="Full Name"
            />
        <SignUpTextField
            name="email"
            icon="md-email"
            type="email"
            control={control}
            placeholder="Email Address"
            />
        <div className="sign-in-button">
            <Button onClick={handleSubmit(submit)}>Sign Up</Button>
        </div>
    </SignInPage>;
}

export default SignUp;