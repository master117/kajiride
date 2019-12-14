import React, { useState, useRef } from 'react';
import axios from 'axios';

import { Button } from "primereact/button"
import { Growl } from 'primereact/growl';

import classes from './NewMangaPage.module.css';
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
    
    const growl = useRef(null);
    const [data, setData] = useState([]);

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
                    growl.current.show({severity: 'success', summary: 'Success', detail: 'Manga created'});
                    props.history.push('/manga/' + data.mangaid);
                }
                else {
                    growl.current.show({severity: 'error', summary: 'Error', detail: 'Couldn\'t create Manga'});
                }
            })
            .catch(function (error) {   
                // handle error
                growl.show({severity: 'error', summary: 'Error', detail: 'Couldn\'t create Manga'});           
                console.log(error);
                console.log(error.message);
                console.log(error.config);
                if(error.response.status === 401) {
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                    props.logOut();
                }    
            });
    }

    return (
        <div className={classes.Container}>
            <Growl ref={growl} />
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={data ? data.image : ""} alt="Cover" />
            </div>
            <div className={classes.MainContent}>
                <div className={classes.TitleContainer}>
                    <div className={classes.Title}>{data.name}</div>
                    <Button label={"Save"} icon={"pi pi-save"} className={"button"} onClick={() => { insertManga() }}></Button>
                </div>
                {getPage()}
            </div>
        </div>
    );
};

export default withRouter(NewMangaPage);