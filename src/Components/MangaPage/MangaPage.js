import React from 'react';
import classes from './MangaPage.module.css';

const setPage = (props) => {
    return (
        <div className={classes.Container}>
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={props.data.image} alt="Cover" />
            </div>
            <div className={classes.MainContent}>
                <div className={classes.Title}>{props.data.name}</div>
                <div className={classes.SetField}>Author: {props.data.author}</div>
                <div className={classes.SetField}>Artist: {props.data.artist}</div>
                <div className={classes.SetField}>Publisher: {props.data.publisher}</div>
                <div className={classes.SetField}>Owned: {props.data.ownedvolumes}/{props.data.totalvolumes}</div>
                <div className={classes.SetField}>Status: {props.data.status}</div>
                <div className={classes.SetField}>Language: {props.data.language}</div>
                <div className={classes.SetField}>Genre: {props.data.genre}</div>
                <div className={classes.SetField}>Description: {props.data.description}</div>
                <div className={classes.SetField}>Score: {props.data.score}</div>
            </div>
        </div>
    )
}


const MangaPage = (props) => {
    console.log(props);
    return (
        setPage(props)
    );
};
 
export default MangaPage;