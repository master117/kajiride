import React from 'react';
import MangaListEntry from './MangaListEntry/MangaListEntry';
import classes from './MangaList.module.css';

const MangaList = (props) => {
    const pagedData = props.data.slice(0,10);
    const returnData = pagedData.map(entry =>
        <MangaListEntry manga={entry} key={entry.mangaid} />);

    return (
        <div className={classes.MangaList}>
            {returnData}
        </div>
    );
};
 
export default MangaList;