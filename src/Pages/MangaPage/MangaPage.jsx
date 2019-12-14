import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Button } from "primereact/button"
import { Growl } from 'primereact/growl';

import classes from './MangaPage.module.css';

const MangaPage = (props) => {
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
        Title: "name",
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
    
    const growl = useRef(null);
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(true);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if(!update)
            return;

        setUpdate(false);    
        axios
            .get(
                process.env.REACT_APP_ENDPOINT + "/api/manga/" + props.match.params.id
            )
            .then(({ data }) => {
                setData(data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                console.log(error.message);
                console.log(error.config);
            });
    }, [update, props.match.params.id]);

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
        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: data,
                token: props.user.token
            })
            .then(({ data }) => {
                growl.current.show({severity: 'success', summary: 'Success', detail: 'Manga updated'});
                setData(data);
            })
            .catch(function (error) {
                // handle error
                growl.current.show({severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga'});
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
        data ?
        <div className={classes.Container}>
            <Growl ref={growl} />
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={data ? data.image : ""} alt="Cover" />
            </div>
            <div className={classes.MainContent}>
                <div className={classes.TitleContainer}>
                    <div className={classes.Title}>{data.name}</div>
                    {props.user && props.user.role === 1 ?
                        editMode ?
                            <Button label={"Save"} icon="pi pi-save" className={"button"} onClick={() => { setEditMode(false); updateManga() }}></Button>
                            : <Button label={"Edit"} icon="pi pi-pencil" className={"button"} onClick={() => setEditMode(true)} ></Button>
                        : ""}
                </div>
                {editMode ? editPage() : viewPage()}
            </div>
        </div>
        : ""
    );
};

export default MangaPage;