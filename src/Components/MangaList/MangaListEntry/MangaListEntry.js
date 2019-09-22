import React from 'react';
import classes from './MangaListEntry.module.css';
import MangaListDetails from './MangaListDetails/MangaListDetails';
import { withRouter } from 'react-router-dom';

const MangaListEntry = (props) => {
    const nextPath = (path) => {
        props.history.push(path);
    }

    return (
        <div className={classes.Container} onClick={() => nextPath('/manga/' + props.manga.mangaid)}>
            <img className={classes.MangaImage} src={props.manga.image} alt="Cover" />
            <MangaListDetails manga={props.manga} />
        </div>
    );
};
 
export default withRouter(MangaListEntry);