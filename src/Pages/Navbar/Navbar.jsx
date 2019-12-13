import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";

import classes from './Navbar.module.css';

const Navbar = (props) => {

    const [showLogin, setShowLogin] = useState(false);
    const hideLogin = () => {
        setShowLogin(false);
    }

    if(props.user && showLogin)
        setShowLogin(false);

    return (
        <div className={classes.Navbar}>
            <nav className={classes.Nav}>
                <ul className={classes.Container}>
                    <li className={classes.Link}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#FFFFFF' }}>Home</Link>
                    </li>
                    <li className={classes.Link}>
                        <Link to="/releases/" style={{ textDecoration: 'none', color: '#FFFFFF' }}>Neue Releases</Link>
                    </li>
                </ul>
            </nav>
            {props.user ? <div className={classes.Greeting}>{props.user.name}</div> : ""}
            <div className={classes.Search}><Searchbar /></div>
            {props.user ?
                <Button label={"Logout"} className={classes.Button} onClick={props.logOut} />
                : <Button label={"Login"} className={classes.Button} onClick={() => setShowLogin(true)} />}
            <Login visible={showLogin} wrongLogin={props.wrongLogin} onHide={hideLogin} loggingIn={props.loggingIn} logIn={props.logIn} logOut={props.logOut} />
        </div>
    )
}

export default Navbar;