import React, { Component } from 'react';
import classes from './Navbar.module.css';
import Searchbar from './Searchbar/Searchbar';

class Navbar extends Component {
    render() {
        return (
            <div className={classes.Navbar}>
                <Searchbar />
            </div>
        )
    }
}

export default Navbar;