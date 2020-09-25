import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { withRouter } from 'react-router-dom';

import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";

import Styles from './Navbar.module.css';

const Navbar = (props) => {

    const [showLogin, setShowLogin] = useState(false);
    const [navigationMenu, setNavigationMenu] = useState(undefined);
    const [userMenu, setUserMenu] = useState(undefined);
    const hideLogin = () => {
        setShowLogin(false);
    }

    const navigationItems = [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => { props.history.push('/') } },
        { label: 'Release', icon: 'pi pi-fw pi-list', command: () => { props.history.push('/releases') } }
    ]

    const userItems = [
        { label: 'Statistics', icon: 'pi pi-fw pi-table', command: () => { props.history.push("/user") } },
        { label: 'Logout', icon: 'pi pi-key', command: props.logOut }
    ]

    if(props.user && showLogin)
        setShowLogin(false);

    return (
        <div>
            <div className={Styles.Dummy} />
            <div className={Styles.Navbar}>
                <nav className={Styles.Left}>
                    <div className={Styles.HorizontalMenu}>
                        <Link to="/" className={Styles.Link}>Home</Link>
                        <Link to="/releases/" className={Styles.Link}>Releases</Link>
                    </div>
                    <div className={Styles.HamburgerMenu}>
                        <Menu model={navigationItems} popup={true} ref={el => setNavigationMenu(el)} />
                        <Button icon="pi pi-bars" onClick={(event) => navigationMenu.toggle(event)} />
                    </div>
                </nav>
                <div className={Styles.Right}>
                    {props.user ? <div className={Styles.Greeting}>{}</div> : ""}
                    <Searchbar />
                    {props.user ?
                        <div className={Styles.UserMenu}>
                            <Menu model={userItems} popup={true} ref={el => setUserMenu(el)} />
                            <Button label={props.user.name.toUpperCase()} onClick={(event) => userMenu.toggle(event)} />
                        </div>
                        : <Button label={"Login"} icon="pi pi-key" className={Styles.Button} onClick={() => setShowLogin(true)} />
                    }
                    <Login visible={showLogin} onHide={hideLogin}
                        loginBusy={props.loginBusy}
                        wrongLogin={props.wrongLogin} logIn={props.logIn} logOut={props.logOut}
                        wrongRegister={props.wrongRegister} register={props.register}
                        message={props.message} />
                </div>
            </div>
        </div>
    )
}

export default withRouter(Navbar);