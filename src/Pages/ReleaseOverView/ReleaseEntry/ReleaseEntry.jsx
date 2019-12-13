import React, { useState, useEffect } from "react";
import axios from 'axios';

import classes from "./ReleaseEntry.module.css"


const ReleaseEntry = (props) => {

    return (
        <div className={classes.ListEntry}>
            {props.manga.name} - {props.release.volume}
        </div>
    );
}

export default ReleaseEntry;