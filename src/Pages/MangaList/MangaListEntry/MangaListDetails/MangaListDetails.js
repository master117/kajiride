import React from 'react';
import classes from './MangaListDetails.module.css';


const MangaListDetails = (props) => {  

    return (
        <div className={classes.Container}>
            <div className={classes.Title}>{props.manga.name}</div>
            <div className={classes.Authors}>{props.manga.author + (props.manga.author !== props.manga.artist ? " & " + props.manga.artist : "")}</div>
            <table className={classes.DetailsTable}>
                <tbody>
                    <tr>
                        <th>Publisher:</th>
                        <td>{props.manga.publisher}</td>
                    </tr>
                    <tr>
                        <th>Genre:</th>
                        <td>{props.manga.genre}</td>
                    </tr>
                    <tr>
                        <th>Owned:</th>
                        <td>{props.manga.ownedvolumes + "/" + props.manga.totalvolumes + " | " + props.manga.status}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MangaListDetails;