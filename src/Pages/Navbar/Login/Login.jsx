import React from "react";

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

import Styles from './Login.module.css';

const Login = (props) => {
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        loading: false
    });

    const handleChange = (name, event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const logIn = () => {
        props.logIn(values.username, values.password);
    }

    const register = () => {
        props.register(values.username, values.password);
    }

    return (
        <Dialog header={"Login/Register"} visible={props.visible} modal={true} onHide={props.onHide}>
            {props.wrongLogin || props.wrongRegister ? <Message severity="warn" text={props.message ? props.message : "Login Failed"} className={Styles.LoginError} /> : ""}
            <span className={Styles.UsernameField + " p-float-label"}>
                <InputText
                    id="username"
                    value={values.username}
                    onChange={(event) => handleChange('username', event)}
                    disabled={props.loggingIn} />
                <label htmlFor="username">Username</label>
            </span>
            <span className={Styles.PasswordField + " p-float-label"}>
                <InputText
                    id="password"
                    type="password"
                    value={values.password}
                    onChange={(event) => handleChange('password', event)}
                    disabled={props.loggingIn}
                    onKeyUp={event => {
                        if (event.keyCode === 13) {
                            // Cancel the default action, if needed
                            event.preventDefault();
                            logIn();
                        }
                    }
                    } />
                <label htmlFor="password">Password</label>
            </span>
            <div className={Styles.Row}>
                <Button label={"Login"} className={Styles.Button} onClick={() => logIn()} disabled={props.loginBusy} />
                <Button label={"Register"} className={Styles.Button} onClick={() => register()} disabled={props.loginBusy} />
            </div>
        </Dialog>
    );
};

export default Login;