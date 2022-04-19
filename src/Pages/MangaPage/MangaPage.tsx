import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Button } from "primereact/button"
import { Toast } from 'primereact/toast';
import { useHistory, useParams } from "react-router";

import EditMangaDialog from "./EditMangaDialog/EditMangaDialog";
import Cover from "../../assets/cover.jpg"

import { Manga } from '../../Types/Manga';
import { User } from '../../Types/User';
import { UserManga } from '../../Types/UserManga';

import Styles from './MangaPage.module.css';
import EditUserMangaDialog from "./EditUserMangaDialog/EditUserMangaDialog";

interface IMangaPageProps  {
    user: User | null;
    logOut: () => void;
}

const MangaPage: React.FunctionComponent<IMangaPageProps> = (props) => {
    const history = useHistory();
    const { id } = useParams<{id: string | undefined}>();

    const toast = useRef<Toast>(null);
    const [userMangaDialogVisible, setUserMangaDialogVisible] = useState(false);
    const [mangaDialogVisible, setMangaDialogVisible] = useState(!id);
    const [manga, setManga] = useState<Manga>({} as Manga);
    const [userManga, setUserManga] = useState<UserManga>({} as UserManga);
    const [update, setUpdate] = useState(true);
    const [updateUserManga, setUpdateUserManga] = useState(true);

    useEffect(() => {
        if (!update || !id)
            return;

        setUpdate(false);

        axios
            .get(
                process.env.REACT_APP_ENDPOINT + "/api/manga/" + id
            )
            .then(({ data }) => {
                if(data)
                    setManga(data);
                else
                    history.push("/")
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                console.log(error.message);
                console.log(error.config);
            });
    }, [update, id, history]);

    useEffect(() => {
        if (!updateUserManga || !id || !props.user)
            return;

        setUpdateUserManga(false);
        
        axios
            .get(
                process.env.REACT_APP_ENDPOINT + "/api/usermanga/",
                {
                    params: {
                        mangaId: id,
                        userId: props.user.id,
                        token: props.user.token,
                    }
                }
            )
            .then(({ data }) => {
                if (data)
                    setUserManga(data);
            })
            .catch(function (error) {
            });
    }, [id, props.user, updateUserManga]);       

    const onMangaAdded = (manga: Manga) => {
        history.replace('/manga/' + manga.mangaid);
        setMangaDialogVisible(false)
    }

    const onMangaUpdated = () => {
        setUpdate(true);
        setMangaDialogVisible(false);
    }

    const onMangaDeleted = () => {
        history.push('/');
        setMangaDialogVisible(false);
    }

    const onUserMangaUpdated = () => {
        setUpdateUserManga(true);
        setUserMangaDialogVisible(false);
    };

    const onMangaEditCancel = () => {
        if(id)
            setMangaDialogVisible(false);
        else
            history.push('/');
    }

    return (
        <div className={Styles.Container}>
            <Toast ref={toast} />
            <div className={Styles.Sidebar}>
                <img className={Styles.MangaImage} src={manga.image ? manga.image : Cover} alt="Cover" />
                {id && props.user ?
                    <Button label={"Edit"} icon="pi pi-pencil" className={Styles.WideButton} onClick={() => setUserMangaDialogVisible(true)}></Button> : ""}
                {props.user && props.user.role === 1 ?
                    <Button label={"Edit Manga"} icon="pi pi-pencil" className={Styles.WideButton} onClick={() => setMangaDialogVisible(true)} ></Button> : ""}
            </div>
            <div className={Styles.MainContent}>
                <div className={Styles.TitleContainer}>
                    <div className={Styles.Title}>{manga.name}</div>
                </div>
                <div className={Styles.FormContainer}>
                    <div className={Styles.Row} key={"originaltitle"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Original: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.originalname}</div>
                    </div>
                    <div className={Styles.Row} key={"author"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Author: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.author}</div>
                    </div>
                    <div className={Styles.Row} key={"artist"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Artist: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.artist}</div>
                    </div>
                    <div className={Styles.Row} key={"publisher"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Publisher: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.publisher}</div>
                    </div>
                    <div className={Styles.Row} key={"score"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Score: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{(userManga.score ? userManga.score + "/100" : "-/100")}</div>
                    </div>
                    <div className={Styles.Row} key={"volumes"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Volumes: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{(userManga.owned ? userManga.owned : 0) + "/" + (manga.volumes ? manga.volumes : 0)}</div>
                    </div>
                    <div className={Styles.Row} key={"status"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Status: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.status}</div>
                    </div>
                    <div className={Styles.Row} key={"language"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Language: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.language}</div>
                    </div>
                    <div className={Styles.Row} key={"genre"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Genre: "}</div>
                        <div className={[Styles.SetField, Styles.Right].join(' ')}>{manga.genre}</div>
                    </div>
                    <div className={Styles.Row} key={"description"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Description: "}</div>
                    </div>
                    <div className={Styles.Row}>
                        <div className={[Styles.TextAreaField, Styles.Right].join(' ')}>{manga.description}</div>
                    </div>
                    <div className={Styles.Row} key={"comment"}>
                        <div className={[Styles.SetField, Styles.Left].join(' ')}>{"Comment: "}</div>
                    </div>
                    <div className={Styles.Row}>
                        <div className={[Styles.TextAreaField, Styles.Right].join(' ')}>{userManga.comment ? userManga.comment : ""}</div>
                    </div>
                </div>
            </div>
            {
                props.user && mangaDialogVisible &&
                <EditMangaDialog 
                    manga={manga}
                    user={props.user}
                    onMangaAdded={onMangaAdded} 
                    onMangaUpdated={onMangaUpdated} 
                    onMangaDeleted={onMangaDeleted}
                    onMangaEditCancel={onMangaEditCancel}
                />
            }
            {
                props.user && userMangaDialogVisible &&
                <EditUserMangaDialog 
                    mangaid={manga.mangaid}
                    user={props.user}
                    userManga={userManga}
                    onUserMangaUpdated={onUserMangaUpdated} 
                    onUserMangaEditCancel={() => setUserMangaDialogVisible(false)}
                />
            }
        </div>
    );
};

export default MangaPage;