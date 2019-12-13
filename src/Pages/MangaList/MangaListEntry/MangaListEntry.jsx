import React from 'react';
import classes from './MangaListEntry.module.css';
import MangaListDetails from './MangaListDetails/MangaListDetails';
import { withRouter } from 'react-router-dom';

const MangaListEntry = (props) => {
    return (
        <div className={classes.Container} onClick={() => props.history.push('/manga/' + props.manga.mangaid)}>
            <img className={classes.MangaImage} src={props.manga.image} alt="Cover" />
            <MangaListDetails manga={props.manga} />
        </div>
    );
};
 
export default withRouter(MangaListEntry);