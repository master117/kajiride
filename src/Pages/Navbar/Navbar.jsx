import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { withRouter } from 'react-router-dom';

import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";

import classes from './Navbar.module.css';

const Navbar = (props) => {

    const [showLogin, setShowLogin] = useState(false);
    const [menu, setMenu] = useState(undefined);
    const hideLogin = () => {
        setShowLogin(false);
    }

    const items = [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => { props.history.push('/') } },
        { label: 'Release', icon: 'pi pi-fw pi-plus', command: () => { props.history.push('/releases') } }
    ]

    if (props.user && showLogin)
        setShowLogin(false);

    return (
        <div className={classes.Navbar}>
            <nav className={classes.Left}>
                <div className={classes.HorizontalMenu}>
                    <Link to="/" className={classes.Link}>Home</Link>
                    <Link to="/releases/" className={classes.Link}>Releases</Link>
                </div>
                <div className={classes.HamburgerMenu}>
                    <Menu model={items} popup={true} ref={el => setMenu(el)} />
                    <Button icon="pi pi-bars" onClick={(event) => menu.toggle(event)} />
                </div>
            </nav>
            <div className={classes.Right}>
                {props.user ? <div className={classes.Greeting} onClick={() => props.history.push("/user")}>{props.user.name}</div> : ""}
                <Searchbar />
                {props.user ?
                    <Button label={"Logout"} className={classes.Button} onClick={props.logOut} />
                    : <Button label={"Login"} className={classes.Button} onClick={() => setShowLogin(true)} />}
                <Login visible={showLogin} onHide={hideLogin}
                    loginBusy={props.loginBusy}
                    wrongLogin={props.wrongLogin} logIn={props.logIn} logOut={props.logOut}
                    wrongRegister={props.wrongRegister} register={props.register}
                    message={props.message} />
            </div>
        </div>
    )
}

export default withRouter(Navbar);