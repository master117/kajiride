import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { RouteComponentProps } from "react-router";

import { User } from '../../Types/User';

import Styles from './MangaPage.module.css';
import { Manga, Publisher, Status, Language, Genre } from '../../Types/Manga';
import { UserManga } from '../../Types/UserManga';
import { Dropdown } from 'primereact/dropdown';

type TParams = { id: string };

interface IMangaPageProps extends RouteComponentProps<TParams> {
    user: User | null;
    logOut: () => void;
}

const MangaPage: React.FunctionComponent<IMangaPageProps> = (props) => {

    const growl = useRef<Growl>(null);
    const [userMangaDialogVisible, setUserMangaDialogVisible] = useState(false);
    const [mangaDialogVisible, setMangaDialogVisible] = useState(false);
    const [data, setData] = useState<Manga>({} as Manga);
    const [userData, setUserData] = useState<UserManga>({} as UserManga);
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
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user]);

    const editMangaDialog = () => {
        const publishers = Object.keys(Publisher).map(x => (Publisher as any)[x]);
        const genres = Object.keys(Genre).map(x => (Genre as any)[x]);
        const languages = Object.keys(Language).map(x => (Language as any)[x]);
        const status = Object.keys(Status).map(x => (Status as any)[x]);

        return (
            <div className={Styles.FormContainer}>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.name ? data.name : ""} onChange={(e) => onMangaChange("name", e.currentTarget.value)} />
                        <label htmlFor="in">Title:</label>
                    </span>
                </div>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.originalname ? data.originalname : ""} onChange={(e) => onMangaChange("originalname", e.currentTarget.value)} />
                        <label htmlFor="in">Original Title:</label>
                    </span>
                </div>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.author ? data.author : ""} onChange={(e) => onMangaChange("author", e.currentTarget.value)} />
                        <label htmlFor="in">Author:</label>
                    </span>
                </div>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.artist ? data.artist : ""} onChange={(e) => onMangaChange("artist", e.currentTarget.value)} />
                        <label htmlFor="in">Artist:</label>
                    </span>
                </div>
                <div className={Styles.FormRow}>
                    <div>Publisher:</div>
                    <Dropdown appendTo={document.body} value={data.publisher ? data.publisher : ""} optionLabel={""} optionValue={""} options={publishers} onChange={(e) => onMangaChange("publisher", e.value)} />
                </div>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.volumes ? data.volumes : ""} keyfilter="pint" onChange={(e) => onMangaChange("volumes", parseInt(e.currentTarget.value))} />
                        <label htmlFor="in">Volumes:</label>
                    </span>
                </div>
                <div className={Styles.FormRow}>
                    <div>Status:</div>
                    <Dropdown appendTo={document.body} value={data.status ? data.status : ""} optionLabel={""} optionValue={""} options={status} onChange={(e) => onMangaChange("status", e.value)} />
                </div>
                <div className={Styles.FormRow}>
                    <div>Language:</div>
                    <Dropdown appendTo={document.body} value={data.language ? data.language : ""} optionLabel={""} optionValue={""} options={languages} onChange={(e) => onMangaChange("language", e.value)} />
                </div>
                <div className={Styles.FormRow}>
                    <div>Genre:</div>
                    <Dropdown appendTo={document.body} value={data.genre ? data.genre : ""} optionLabel={""} optionValue={""} options={genres} onChange={(e) => onMangaChange("genre", e.value)} />
                </div>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.description ? data.description : ""} onChange={(e) => onMangaChange("description", e.currentTarget.value)} />
                        <label htmlFor="in">Description:</label>
                    </span>
                </div>
                <div className={Styles.FormRow}>
                    <span className="p-float-label">
                        <InputText value={data.image ? data.image : ""} onChange={(e) => onMangaChange("image", e.currentTarget.value)} />
                        <label htmlFor="in">Image:</label>
                    </span>
                </div>
                {/* Buttons */}
                <div className={Styles.FormButtonRow}>
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
            <div className={Styles.FormContainer}>
                <div className={Styles.FormRow} key={"score"}>
                    <span className="p-float-label">
                        <InputText value={userData.score ? userData.score : ""} onChange={(e) => onUserMangaDataChange("score", e.currentTarget.value)} />
                        <label htmlFor="in">Score:</label>
                    </span>
                </div>
                <div className={Styles.FormRow} key={"owned"}>
                    <span className="p-float-label">
                        <InputText value={userData.owned ? userData.owned : ""} keyfilter="pint" onChange={(e) => onUserMangaDataChange("owned", parseInt(e.currentTarget.value))} />
                        <label htmlFor="in">Owned:</label>
                    </span>
                </div>
                <div className={Styles.FormRow} key={"comment"}>
                    <span className="p-float-label">
                        <InputText value={userData.comment ? userData.comment : ""} onChange={(e) => onUserMangaDataChange("comment", e.currentTarget.value)} />
                        <label htmlFor="in">Comment:</label>
                    </span>
                </div>
                <div className={Styles.FormButtonRow}>
                    <Button label={"Save"} icon="pi pi-save" onClick={() => { setUserMangaDialogVisible(false); updateUserManga(); }}></Button>
                    <Button label={"Cancel"} icon="pi pi-save" onClick={() => { setUserMangaDialogVisible(false); setUpdate(true); }}></Button>
                </div>
            </div>
        );
    }

    const onMangaChange = (name: string, value: any) => {
        setData({ ...data, [name]: value });
    };

    const onUserMangaDataChange = (name: string, value: any) => {
        setUserData({ ...userData, [name]: value });
    };

    const updateManga = () => {
        if (!props.user)
            return;

        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: data,
                token: props.user.token
            })
            .then(({ data }) => {
                if (growl && growl.current)
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga updated' });
                setData(data);
            })
            .catch(function (error) {
                // handle error
                if (growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga' });
            });
    }

    const updateUserManga = () => {
        if (!props.user)
            return;

        if (userData.userid && userData.mangaid) {
            axios
                .put(
                    (process.env.REACT_APP_ENDPOINT + "/api/usermanga"), {
                    usermanga: userData,
                    token: props.user.token
                })
                .then(({ data }) => {
                    if (growl && growl.current)
                        growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga updated' });
                    setUserData(data);
                })
                .catch(function (error) {
                    // handle error
                    if (growl && growl.current)
                        growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga' });
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
                    if (growl && growl.current)
                        growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga updated' });
                    setUserData(data);
                })
                .catch(function (error) {
                    // handle error
                    if (growl && growl.current)
                        growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Manga' });
                });
        }
    }

    const insertManga = () => {
        if (!props.user)
            return;
            
        axios
            .post(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: data,
                token: props.user.token
            }
            )
            .then(({ data }) => {
                if (data) {
                    if (growl && growl.current)
                        growl.current.show({ severity: 'success', summary: 'Success', detail: 'Manga created' });
                    props.history.push('/manga/' + data.mangaid);
                }
                else {
                    if (growl && growl.current)
                        growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t create Manga' });
                }
            })
            .catch(function (error) {
                // handle error
                if (growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t create Manga' });
            });
    }

    return (
        <div className={Styles.Container}>
            <Growl ref={growl} />
            <Dialog header="Edit Manga" visible={userMangaDialogVisible} modal={true} onHide={() => setUserMangaDialogVisible(false)}>{editUserMangaDialog()}</Dialog>
            <Dialog header="Edit Manga" visible={mangaDialogVisible} modal={true} onHide={() => setMangaDialogVisible(false)}>{editMangaDialog()}</Dialog>
            <div className={Styles.Sidebar}>
                <img className={Styles.MangaImage} src={data ? data.image : ""} alt="Cover" />
                {props.match.params.id && props.user ?
                    <Button label={"Edit"} icon="pi pi-pencil" className={Styles.WideButton} onClick={() => setUserMangaDialogVisible(true)}></Button> : ""}
                {props.user && props.user.role === 1 ?
                    <Button label={"Edit Manga"} icon="pi pi-pencil" className={Styles.WideButton} onClick={() => setMangaDialogVisible(true)} ></Button> : ""}
            </div>
            <div className={Styles.MainContent}>
                <div className={Styles.TitleContainer}>
                    <div className={Styles.Title}>{data.name}</div>
                </div>
                <div className={Styles.FormContainer}>
                    <div className={Styles.Row} key={"originaltitle"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Original: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.originalname}</div>
                    </div>
                    <div className={Styles.Row} key={"author"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Author: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.author}</div>
                    </div>
                    <div className={Styles.Row} key={"artist"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Artist: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.artist}</div>
                    </div>
                    <div className={Styles.Row} key={"publisher"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Publisher: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.publisher}</div>
                    </div>
                    <div className={Styles.Row} key={"score"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Score: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{(userData.score ? userData.score + "/100" : "-/100")}</div>
                    </div>
                    <div className={Styles.Row} key={"volumes"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Volumes: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{(userData.owned ? userData.owned : 0) + "/" + (data.volumes ? data.volumes : 0)}</div>
                    </div>
                    <div className={Styles.Row} key={"status"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Status: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.status}</div>
                    </div>
                    <div className={Styles.Row} key={"language"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Language: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.language}</div>
                    </div>
                    <div className={Styles.Row} key={"genre"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Genre: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{data.genre}</div>
                    </div>
                    <div className={Styles.Row} key={"description"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Description: "}</div>
                    </div>
                    <div className={Styles.Row}>
                        <div className={[Styles.TextAreaField, Styles.Right].join(' ')}>{data.description}</div>
                    </div>
                    <div className={Styles.Row} key={"comment"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Comment: "}</div>
                    </div>
                    <div className={Styles.Row}>
                        <div className={[Styles.TextAreaField, Styles.Right].join(' ')}>{userData.comment ? userData.comment : ""}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MangaPage;