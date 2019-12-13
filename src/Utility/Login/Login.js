import React from "react";
import Backdrop from "../Backdrop/Backdrop";
import classes from './Login.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Login = (props) => {
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        loading: false
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const logIn = () => {
        setValues({ ...values, loading: true });
        props.logIn(values.username, values.password);
      }

    if(props.wrongLogin && values.loading)
        setValues({ ...values, loading: false });

    return (
        <React.Fragment>
            <Backdrop closeLogin={props.closeLogin} />
            <div className={classes.LoginContainer}>
                <form className={classes.LoginForm}>
                    {props.wrongLogin ? <label className={classes.LoginError} >Wrong Login</label> : ""}
                    <TextField
                        id="name"
                        label="Username"
                        className={classes.TextField}
                        value={values.name}
                        onChange={handleChange('username')}
                        margin="normal"
                        disabled={values.loading}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        className={classes.TextField}
                        type="password"
                        autoComplete="current-password"
                        onChange={handleChange('password')}
                        margin="normal"
                        disabled={values.loading}
                        onKeyUp={event => {
                            if (event.keyCode === 13) {
                                // Cancel the default action, if needed
                                event.preventDefault();
                                logIn();
                              }
                            }
                        }
                    />
                    <Button variant="contained" color="primary" className={classes.Button} onClick={() => logIn()} disabled={values.loading}>
                        Login
                    </Button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default Login;