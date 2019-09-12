import React from 'react';
import classes from './MangaListDetails.module.css';

const MangaListDetails = (props) => {
    return (
        <div className={classes.Container}>
            <div className={classes.Title}>{props.manga.Titel}</div>
            <div className={classes.Authors}>{props.manga.Autor + (props.manga.Autor !== props.manga.Zeichner ? " & " + props.manga.Zeichner : "")}</div>
            <table className={classes.DetailsTable}>
                <tr>
                    <th>Publisher:</th>
                    <td>{props.manga.Verlag}</td>
                </tr>
                <tr>
                    <th>Genre:</th>
                    <td>{props.manga.Genre}</td>
                </tr>
                <tr>
                    <th>Owned:</th>
                    <td>{props.manga.Besitz + "/" + props.manga.Gesamt + " | " + props.manga.Status}</td>
                </tr>
            </table>
        </div>
    );
};

export default MangaListDetails;