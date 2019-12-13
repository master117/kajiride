import React, { useState } from 'react';
import axios from 'axios';
import classes from './NewMangaPage.module.css';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Modal from '@material-ui/core/Modal';
import { withRouter } from 'react-router-dom';

const NewMangaPage = (props) => {
    const editRows = {
        Title: "name",
        Artist: "artist",
        Publisher: "publisher",
        Owned: "ownedvolumes",
        Total: "totalvolumes",
        Status: "status",
        Language: "language",
        Genre: "genre",
        Description: "description",
        Score: "score",
        Image: "image",
    }
    
    const [data, setData] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getPage = () => {
        const staticPage = Object.keys(editRows).map(key => {
            return (
                <div className={classes.Row} key={key}>
                    <div className={[classes.SetField, classes.LeftColumn].join(' ')}>{key}:</div>
                    <input
                        className={[classes.InputField, classes.Column].join(' ')}
                        value={data[editRows[key]] ? data[editRows[key]] : ""}
                        onChange={handleChange(editRows[key])}
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

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value });
    };

    const insertManga = () => {
        axios
            .post(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: data,
                token: props.user.token
            }
            )
            .then(({ data }) => {
                if (data) {
                    props.history.push('/manga/' + data.mangaid);
                }
                else {
                    setShowErrorModal(true);
                }
            })
            .catch(function (error) {   
                // handle error
                setShowErrorModal(true);
                console.log(error);
                console.log(error.message);
                console.log(error.config);
            });
    }

    return (
        <div className={classes.Container}>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={showErrorModal}
                onClose={x => setShowErrorModal(false)} >
                <div className={classes.Modal}>
                    <h2 id="simple-modal-title">Error saving Entry</h2>
                    <p id="simple-modal-description">Data could not be saved.</p>
                </div>
            </Modal>
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={data ? data.image : ""} alt="Cover" />
            </div>
            <div className={classes.MainContent}>
                <div className={classes.TitleContainer}>
                    <div className={classes.Title}>{data.name}</div>
                    <Button variant="contained" color="primary" className={classes.Button} onClick={() => { insertManga() }}><SaveIcon /></Button>
                </div>
                {getPage()}
            </div>
        </div>
    );
};

export default withRouter(NewMangaPage);