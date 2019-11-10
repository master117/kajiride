import React, { useState } from 'react';
import axios from 'axios';
import classes from './MangaPage.module.css';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const editPage = (props, fields, handleChange) => {

    const staticPage = Object.keys(fields).map(key => {
        console.log(key);
        console.log(fields[key]);
        return (
            <div className={classes.Row} key={key}>
                <div className={[classes.SetField, classes.LeftColumn].join(' ')}>{key}:</div>
                <input
                    className={[classes.InputField, classes.Column].join(' ')}
                    value={fields[key] ? fields[key] : ""}
                    onChange={handleChange(key)}
                />
            </div>
        )
    })

    return (
        <form className={classes.FormContainer} noValidate autoComplete="off">
            {staticPage}
        </form >
    )
}

const setPage = (props, fields) => {

    const staticPage = Object.keys(fields).map(key => {
        return (
            <div className={classes.Row} key={key}>
                <div className={[classes.SetField, classes.LeftColumn].join(' ')}>{key}:</div>
                <div className={[classes.SetField, classes.Column].join(' ')}>{fields[key]}</div>
            </div>
        )
    })

    return staticPage;
}


const MangaPage = (props) => {

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const [values, setValues] = useState({
        Author: props.data.author,
        Artist: props.data.artist,
        Publisher: props.data.publisher,
        Owned: props.data.ownedvolumes,
        Total: props.data.totalvolumes,
        Status: props.data.status,
        Language: props.data.language,
        Genre: props.data.genre,
        Description: props.data.description,
        Score: props.data.score
    });

    const [editMode, setEditMode] = useState(false);

    const updateManga = () => {
        axios
            .post(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: values,
                token: props.user.token
            }
            )
            .then(({ data }) => {
                this.setState({
                    data: data
                })
            });
    }

    return (
        <div className={classes.Container}>
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={props.data.image} alt="Cover" />
            </div>
            <div className={classes.MainContent}>
                <div className={classes.TitleContainer}>
                    <div className={classes.Title}>{props.data.name}</div>
                    {props.user && props.user.role === 1 ?
                        editMode ?
                            <Button variant="contained" color="primary" className={classes.Button} onClick={() => { setEditMode(false); updateManga() }}><SaveIcon /></Button>
                            : <Button variant="contained" color="primary" className={classes.Button} onClick={() => setEditMode(true)} ><EditIcon /></Button>
                        : ""}
                </div>
                {editMode ? editPage(props, values, handleChange) : setPage(props, values)}
            </div>
        </div>
    );
};

export default MangaPage;