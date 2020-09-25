import React from 'react';
import { connect } from "react-redux";
import { InputText } from 'primereact/inputtext'
import { searchInput } from "../../../redux/actions/index";

import Styles from './Searchbar.module.css'

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
        <div className={"p-inputgroup " + Styles.SearchContainer }>
            <span className="p-inputgroup-addon">
                <i className="pi pi-search"></i>
            </span>
            <InputText className={Styles.InputText} onChange={handleChange} placeholder="Manga, Artist..." />
        </div>
    );
};

export default connect(null, mapDispatchToProps)(Searchbar);