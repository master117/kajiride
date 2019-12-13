import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Accordion, AccordionTab } from 'primereact/accordion';
import ReleaseEntry from "./ReleaseEntry/ReleaseEntry";
import classes from './ReleaseOverView.module.css';

const Releases = (props) => {
    const [releases, setReleases] = useState(null);
    const [manga, setManga] = useState(null);

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
                <AccordionTab headerClassName={classes.ReleaseAccordion} header={x} key={x}>
                    {months[x].map(y => {
                        const currentManga = manga.find(z => z.mangaid == y.mangaId);
                        return <ReleaseEntry release={y} manga={currentManga} key={y.mangaId} />
                    })}
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
            .then(({ data }) => { setReleases(data); });

        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
            .then(({ data }) => { setManga(data); });
    }, []);

    return (
        releases && manga ?
            <div className={classes.Main}>
                <div className={classes.Inner}>
                    <Accordion multiple={true}>
                        {getReleaseMonths()}
                    </Accordion>
                </div>
            </div>
            : ""
    );
}

export default Releases;