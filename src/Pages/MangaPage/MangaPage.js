import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './MangaPage.module.css';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Modal from '@material-ui/core/Modal';

const MangaPage = (props) => {

    console.log(props);

    const viewRows = {
        Author: "author",
        Artist: "artist",
        Publisher: "publisher",
        Owned: "ownedvolumes",
        Total: "totalvolumes",
        Status: "status",
        Language: "language",
        Genre: "genre",
        Description: "description",
        Score: "score",
    }

    const editRows = {
        Author: "author",
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
    const [update, setUpdate] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if(!update)
            return;

        setUpdate(false);    
        axios
            .get(
                process.env.REACT_APP_ENDPOINT + "/api/manga/" + props.match.params.id
            )
            .then(({ data }) => {
                console.log(data);
                setData(data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                console.log(error.message);
                console.log(error.config);
            });
    });

    const viewPage = () => {  
        const staticPage = Object.keys(viewRows).map(key => {
            return (
                <div className={classes.Row} key={key}>
                    <div className={[classes.SetField, classes.LeftColumn].join(' ')}>{key}:</div>
                    <div className={[classes.SetField, classes.Column].join(' ')}>{data[viewRows[key]]}</div>
                </div>
            )
        })
    
        return staticPage;
    }

    const editPage = () => {
        const staticPage = Object.keys(editRows).map(key => {
            console.log(key);
            console.log(data[editRows[key]]);
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

    const updateManga = () => {
        let self = this;
        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: data,
                token: props.user.token
            })
            .then(({ data }) => {
                console.log(data);
                setShowSuccessModal(true);
                setData(data);
            })
            .catch(function (error) {
                setUpdate(true);    
                // handle error
                setShowErrorModal(true);
                console.log(error);
                console.log(error.message);
                console.log(error.config);
            });           
    }

    return (
        data ?
        <div className={classes.Container}>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={showErrorModal}
                onClose={x => setShowErrorModal(false)} >
                <div className={classes.Modal}>
                    <h2 id="simple-modal-title">Error saving Entry</h2>
                    <p id="simple-modal-description">Data could not be saved. See console for additional details. (F12)</p>
                </div>
            </Modal>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={showSuccessModal}
                onClose={x => setShowSuccessModal(false)} >
                <div className={classes.Modal}>
                    <h2 id="simple-modal-title">Success</h2>
                    <p id="simple-modal-description">Changes saved.</p>
                </div>
            </Modal>
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={data ? data.image : ""} alt="Cover" />
            </div>
            <div className={classes.MainContent}>
                <div className={classes.TitleContainer}>
                    <div className={classes.Title}>{data.name}</div>
                    {props.user && props.user.role === 1 ?
                        editMode ?
                            <Button variant="contained" color="primary" className={classes.Button} onClick={() => { setEditMode(false); updateManga() }}><SaveIcon /></Button>
                            : <Button variant="contained" color="primary" className={classes.Button} onClick={() => setEditMode(true)} ><EditIcon /></Button>
                        : ""}
                </div>
                {editMode ? editPage() : viewPage()}
            </div>
        </div>
        : ""
    );
};

export default MangaPage;