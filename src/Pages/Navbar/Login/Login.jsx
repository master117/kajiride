import React from "react";
import classes from './Login.module.css';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';


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

    console.log(props)
    return (
        <Dialog header={"Login/Register"} visible={props.visible} modal={true} onHide={props.onHide}>
            {props.wrongLogin ? <Message severity="warn" text="Login Failed" className={classes.LoginError} /> : ""}
            <span className={classes.UsernameField + " p-float-label"}>
                <InputText
                    id="username"
                    value={values.username}
                    onChange={(event) => handleChange('username', event)}
                    disabled={props.loggingIn} />
                <label htmlFor="username">Username</label>
            </span>
            <span className={classes.PasswordField + " p-float-label"}>
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
            <Button label={"Login"} className={classes.Button} onClick={() => logIn()} disabled={props.loggingIn} />
        </Dialog>
    );
};

export default Login;