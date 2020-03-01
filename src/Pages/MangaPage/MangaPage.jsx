import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';

import classes from './MangaPage.module.css';

const MangaPage = (props) => {

    const editRows = [
        { label: "Title", key: "name" },
        { label: "Author", key: "author" },
        { label: "Artist", key: "artist" },
        { label: "Publisher", key: "publisher" },
        { label: "Volumes", key: "volumes" },
        { label: "Status", key: "status" },
        { label: "Language", key: "language" },
        { label: "Genre", key: "genre" },
        { label: "Description", key: "description" },
        { label: "Image", key: "image" },
    ]

    const growl = useRef(null);
    const [userMangaDialogVisible, setUserMangaDialogVisible] = useState(false);
    const [mangaDialogVisible, setMangaDialogVisible] = useState(false);
    const [data, setData] = useState({});
    const [userData, setUserData] = useState({});
    const [update, setUpdate] = useState(true);

    useEffect(() => {
        if (!update)
            return;

        setUpdate(false);

        if (props.match.params.id) {
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

            if (props.user) {
                axios
                    .get(
                        process.env.REACT_APP_ENDPOINT + "/api/usermanga/",
                        {
                            params: {
                                mangaId: props.match.params.id,
                                userId: props.user.id,
                                token: props.user.token,
                            }
                        }
                    )
                    .then(({ data }) => {
                        if (data)
                            setUserData(data);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                        console.log(error.message);
                        console.log(error.config);
                        if (error.response.status === 401) {
                            growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                            props.logOut();
                        }
                    });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update, props.match.params.id]);

    useEffect(() => {
        if (props.match.params.id && props.user) {
            axios
                .get(
                    process.env.REACT_APP_ENDPOINT + "/api/usermanga/",
                    {
                        params: {
                            mangaId: props.match.params.id,
                            userId: props.user.id,
                            token: props.user.token,
                        }
                    }
                )
                .then(({ data }) => {
                    if (data)
                        setUserData(data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log(error.message);
                    console.log(error.config);
                    if (error.response.status === 401) {
                        growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                        props.logOut();
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user]);

    const editMangaDialog = () => {
        return (
            <div className={classes.FormContainer}>
                {editRows.map(x => {
                    return (
                        <div className={classes.FormRow} key={x.key}>
                            <span className="p-float-label">
                                <InputText value={data[x.key] ? data[x.key] : ""} onChange={(e) => onMangaChange(x.key, e)} />
                                <label htmlFor="in">{x.label}:</label>
                            </span>
                        </div>
                    )
                })}
                <div className={classes.FormButtonRow}>
                    <Button label={"Save"} icon="pi pi-save" onClick={() => {
                        setMangaDialogVisible(false);
                        if (data.mangaid)
                            updateManga();
                        else
                            insertManga();
                    }} />
                    <Button label={"Cancel"} icon="pi pi-save" onClick={() => { setMangaDialogVisible(false); setUpdate(true); }} />
                </div>
            </div>
        );
    }

    const editUserMangaDialog = () => {
        return (
            <div className={classes.FormContainer}>
                <div className={classes.FormRow} key={"score"}>
                    <span className="p-float-label">
                        <InputText value={userData.score ? userData.score : ""} onChange={(e) => onUserMangaDataChange("score", e)} />
                        <label htmlFor="in">Score:</label>
                    </span>
                </div>
                <div className={classes.FormRow} key={"owned"}>
                    <span className="p-float-label">
                        <InputText value={userData.owned ? userData.owned : ""} onChange={(e) => onUserMangaDataChange("owned", e)} />
                        <label htmlFor="in">Owned:</label>
                    </span>
                </div>
                <div className={classes.FormRow} key={"comment"}>
                    <span className="p-float-label">
                        <InputText value={userData.comment ? userData.comment : ""} onChange={(e) => onUserMangaDataChange("comment", e)} />
                        <label htmlFor="in">Comment:</label>
                    </span>
                </div>
                <div className={classes.FormButtonRow}>
                    <Button label={"Save"} icon="pi pi-save" onClick={() => { setUserMangaDialogVisible(false); updateUserManga(); }}></Button>
                    <Button label={"Cancel"} icon="pi pi-save" onClick={() => { setUserMangaDialogVisible(false); setUpdate(true); }}></Button>
                </div>
            </div>
        );
    }

    const onMangaChange = (name, event) => {
        setData({ ...data, [name]: event.target.value });
    };

    const onUserMangaDataChange = (name, event) => {
        setUserData({ ...userData, [name]: event.currentTarget.value });
    };

    const updateManga = () => {
        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: data,
                token: props.user.token
            })
            .then(({ data }) => {
                growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga updated' });
                setData(data);
            })
            .catch(function (error) {
                // handle error
                growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga' });
                console.log(error);
                console.log(error.message);
                console.log(error.config);
                if (error.response.status === 401) {
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                    props.logOut();
                }
            });
    }

    const updateUserManga = () => {
        if (userData.userid && userData.mangaid) {
            axios
                .put(
                    (process.env.REACT_APP_ENDPOINT + "/api/usermanga"), {
                    usermanga: userData,
                    token: props.user.token
                })
                .then(({ data }) => {
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga updated' });
                    setUserData(data);
                })
                .catch(function (error) {
                    // handle error
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga' });
                    console.log(error);
                    console.log(error.message);
                    console.log(error.config);
                    if (error.response.status === 401) {
                        growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                        props.logOut();
                    }
                });
        }
        else {
            axios
                .post(
                    (process.env.REACT_APP_ENDPOINT + "/api/usermanga"), {
                    usermanga: userData,
                    userid: props.user.id,
                    mangaid: data.mangaid,
                    token: props.user.token
                })
                .then(({ data }) => {
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga updated' });
                    setUserData(data);
                })
                .catch(function (error) {
                    // handle error
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga' });
                    console.log(error);
                    console.log(error.message);
                    console.log(error.config);
                    if (error.response.status === 401) {
                        growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                        props.logOut();
                    }
                });
        }
    }

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
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga created' });
                    props.history.push('/manga/' + data.mangaid);
                }
                else {
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t create Manga' });
                }
            })
            .catch(function (error) {
                // handle error
                growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t create Manga' });
                console.log(error);
                console.log(error.message);
                console.log(error.config);
                if (error.response.status === 401) {
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
                    props.logOut();
                }
            });
    }

    return (
        <div className={classes.Container}>
            <Growl ref={growl} />
            <Dialog header="Edit Manga" visible={userMangaDialogVisible} modal={true} onHide={() => setUserMangaDialogVisible(false)}>{editUserMangaDialog()}</Dialog>
            <Dialog header="Edit Manga" visible={mangaDialogVisible} modal={true} onHide={() => setMangaDialogVisible(false)}>{editMangaDialog()}</Dialog>
            <div className={classes.Sidebar}>
                <img className={classes.MangaImage} src={data ? data.image : ""} alt="Cover" />
                {props.match.params.id && props.user ?
                    <Button label={"Edit"} icon="pi pi-pencil" className={classes.WideButton} onClick={() => setUserMangaDialogVisible(true)}></Button> : ""}
                {props.user && props.user.role === 1 ?
                    <Button label={"Edit Manga"} icon="pi pi-pencil" className={classes.WideButton} onClick={() => setMangaDialogVisible(true)} ></Button> : ""}
            </div>
            <div className={classes.MainContent}>
                <div className={classes.TitleContainer}>
                    <div className={classes.Title}>{data.name}</div>

                </div>
                <div className={classes.FormContainer}>
                    <div className={classes.Row} key={"author"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Author: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{data.author}</div>
                    </div>
                    <div className={classes.Row} key={"artist"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Artist: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{data.artist}</div>
                    </div>
                    <div className={classes.Row} key={"publisher"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Publisher: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{data.publisher}</div>
                    </div>
                    <div className={classes.Row} key={"score"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Score: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{(userData.score ? userData.score + "/100" : "-/100")}</div>
                    </div>
                    <div className={classes.Row} key={"volumes"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Volumes: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{(userData.owned ? userData.owned : 0) + "/" + (data.volumes ? data.volumes : 0)}</div>
                    </div>
                    <div className={classes.Row} key={"status"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Status: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{data.status}</div>
                    </div>
                    <div className={classes.Row} key={"language"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Language: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{data.language}</div>
                    </div>
                    <div className={classes.Row} key={"genre"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Genre: "}</div>
                        <div className={[classes.SetField, classes.Right].join(' ')}>{data.genre}</div>
                    </div>
                    <div className={classes.Row} key={"description"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Description: "}</div>
                    </div>
                    <div className={classes.Row}>
                        <div className={[classes.TextAreaField, classes.Right].join(' ')}>{data.description}</div>
                    </div>
                    <div className={classes.Row} key={"comment"}>
                        <div className={[classes.SetField, classes.Left].join(' ')}>{"Comment: "}</div>
                    </div>
                    <div className={classes.Row}>
                        <div className={[classes.TextAreaField, classes.Right].join(' ')}>{userData.comment ? userData.comment : ""}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MangaPage;