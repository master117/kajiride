import React from 'react';
import classes from './MangaListEntry.module.css';
import MangaListDetails from './MangaListDetails/MangaListDetails';

const MangaListEntry = (props) => {
    return (
        <div className={classes.Container}>
            <img className={classes.MangaImage} src={props.manga.Bild} alt="Cover" />
            <MangaListDetails manga={props.manga} />
        </div>
    );
};
 
export default MangaListEntry;