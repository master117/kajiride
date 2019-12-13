import React, { Component } from 'react';
import classes from './Navbar.module.css';
import Searchbar from './Searchbar/Searchbar';
import { Link } from "react-router-dom";

class Navbar extends Component {
    constructor(props) {
        super();
    }

    render() {
        //console.log(this.props.user);
        return (
            <div className={classes.Navbar}>
                <nav className={classes.Nav}>
                    <ul className={classes.Container}>
                        <li className={classes.Link}>
                            <Link to="/" style={{ textDecoration: 'none', color: '#FFFFFF' }}>Home</Link>
                        </li>
                        <li className={classes.Link}>
                            <Link to="/releases/" style={{ textDecoration: 'none', color: '#FFFFFF' }}>Neu</Link>
                        </li>
                    </ul>
                </nav>
                {this.props.user ? <div className={classes.Greeting}>Hello {this.props.user.name}</div> : ""}
                <div className={classes.Search}><Searchbar /></div>
                {this.props.user ? 
                <button className={classes.Button} onClick={this.props.logOut}>Logout</button> : <button className={classes.Button} onClick={this.props.openLogin}>Login</button>}  
            </div>
        )
    }
}

export default Navbar;