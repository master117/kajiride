import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Accordion, AccordionTab } from 'primereact/accordion';
import ReleaseEntry from "./ReleaseEntry/ReleaseEntry";
import classes from './ReleaseOverView.module.css';

const Releases = (props) => {
    const [data, setData] = useState([]);

    const getReleaseMonths = () => {
        let months = {};

        for (let i = 0; i < data.length; i++) {
            let month = getMonth(data[i]);

            if (!months[month])
                months[month] = [];

            months[month].push(data[i]);
        }

        return Object.entries(months).map(x => {
            return (
                <AccordionTab header={x[0]} key={x[0]}>
                    {x[0]}
                </AccordionTab>
            )
        });
    }

    const getMonth = (release) => {
        let date = (new Date(release["releaseDate"]));
        return date.getMonth() + "-" + date.getFullYear();
    }

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/release")
            .then(({ data }) => { setData(data); });
    }, []);

    return (
        <div className={classes.main}>
            <div className={classes.inner}>
                <Accordion multiple={true}>
                    {getReleaseMonths()}
                </Accordion>
            </div>
        </div>
    );
}

export default Releases;