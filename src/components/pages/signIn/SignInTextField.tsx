import { HTMLInputTypeAttribute } from 'react';
import { Controller, UseControllerProps, FieldValues, FieldPath } from 'react-hook-form';
import { Icon, Input } from 'react-onsenui';
import './SignIn.css';

export type SignInTextFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
    icon: string | Record<string, string>;
    placeholder: string;
    autoComplete?: "off";
    type?: HTMLInputTypeAttribute;
} & Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'>;

/**
 * This provides a single control for the text field controls within the sign-in page
 */
function SignInTextField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: SignInTextFieldProps<TFieldValues, TName>) {
    return <div className="sign-in-text">
        <Icon icon={props.icon} size={30}/>
        <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={
                ({field}) => <Input
                    type={props.type ?? 'text'}
                    autoComplete={props.autoComplete}
                    autoCapitalize={props.autoComplete}
                    modifier="underbar"
                    placeholder={props.placeholder}
                    {...field}
                />
            }
        />
    </div>;
}

export default SignInTextField;