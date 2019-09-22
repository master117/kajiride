import React from "react";
import axios from 'axios';
import Backdrop from "../Backdrop/Backdrop";
import classes from './Login.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { loggedIn } from "../../redux/actions/index";

function mapDispatchToProps(dispatch) {
    return {
        loggedIn: entry => dispatch(loggedIn(entry))
    };
}

const Login = (props) => {

    const [, setCookies, ] = useCookies(['user']);
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        loading: false
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const Login = () => {
        setValues({ ...values, loading: true });
        axios
            .post(
                "http://localhost:57383/api/login", {
                username: values.username,
                password: values.password
            }
            )
            .then(({ data }) => {
                setCookies("user", data);
                props.closeLogin();
                props.loggedIn(data);             
            });
    }

    return (
        <React.Fragment>
            <Backdrop closeLogin={props.closeLogin} />
            <div className={classes.LoginContainer}>
                <form className={classes.LoginForm}>
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
                                Login();
                              }
                            }
                        }
                    />
                    <Button variant="contained" color="primary" className={classes.Button} onClick={() => Login()} disabled={values.loading}>
                        Login
                    </Button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default connect(null, mapDispatchToProps)(Login);