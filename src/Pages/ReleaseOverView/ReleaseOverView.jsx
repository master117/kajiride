import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';

import ReleaseEntry from "./ReleaseEntry/ReleaseEntry";
import classes from './ReleaseOverView.module.css';

const Releases = (props) => {
    const growl = useRef(null);
    const [releases, setReleases] = useState(null);
    const [manga, setManga] = useState(null);
    const [showAddReleaseDialog, setShowAddReleaseDialog] = useState(false);

    useEffect(() => {
        updateData();
    }, []);

    const updateData = () => {
        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/release")
            .then(({ data }) => { setReleases(data); });

        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
            .then(({ data }) => { setManga(data); });
    }

    const updateRelease = (release) => {
        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                release: release,
                token: props.user.token
            })
            .then(() => {
                growl.current.show({ severity: 'success', summary: 'Success', detail: 'Release updated' });
                updateData();
            })
            .catch(function (error) {
                // handle error
                growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Release' });
                console.log(error);
                console.log(error.message);
                console.log(error.config);
                if(error.response.status === 401) {
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                    props.logOut();
                }                  
            });
    }

    const getReleaseMonths = () => {
        let months = {};

        for (let i = 0; i < releases.length; i++) {
            let month = getMonth(releases[i]);

            if (!months[month])
                months[month] = [];

            months[month].push(releases[i]);
        }

        return Object.keys(months).map(x => {
            return (
                <AccordionTab header={x} key={x}>
                    {<ReleaseEntry data={months[x]} manga={manga} user={props.user} editable={props.user && props.user.role === 1} onUpdate={updateRelease} />}
                </AccordionTab>
            )
        });
    }

    const getMonth = (release) => {
        let date = (new Date(release["releaseDate"]));
        return date.getMonth() + "-" + date.getFullYear();
    }

    return (
        <div>
            <Growl ref={growl} />
            {props.user && props.user.role === 1 ?
                <Button label={"New Release"} className={"button"} icon="pi pi-plus" onClick={() => setShowAddReleaseDialog(true)} />
                : ""}
            {releases && manga ?
                <div className={classes.Main}>
                    <div className={classes.Inner}>
                        <Accordion className={classes.ReleaseAccordion} multiple={true}>
                            {getReleaseMonths()}
                        </Accordion>
                    </div>
                </div>
                : ""}
        </div>
    );
}

export default Releases;