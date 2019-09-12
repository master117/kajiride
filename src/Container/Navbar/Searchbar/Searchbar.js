import React from 'react';
import { connect } from "react-redux";
import classes from './Searchbar.module.css'
import { searchInput } from "../../../redux/actions/index";

function mapDispatchToProps(dispatch) {
    return {
      searchInput: entry => dispatch(searchInput(entry))
    };
}

const Searchbar = (props) => {

    const handleChange = event => {
        props.searchInput(event.target.value);
    }

    return (
        <div className={classes.SearchContainer}>
            <i className={"fas fa-search " + classes.SearchIcon }></i>
            <input className={classes.Searchbar} onChange={handleChange} />
        </div>
    );
};
 
export default connect(null, mapDispatchToProps)(Searchbar);