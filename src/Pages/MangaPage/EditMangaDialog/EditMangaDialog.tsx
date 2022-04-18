import axios from "axios";
import React, { useState } from 'react'

import { Button } from "primereact/button"
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import { Manga, Publisher, Status, Language, Genre } from '../../../Types/Manga';
import { User } from "../../../Types/User";

import Styles from "./EditMangaDialog.module.scss"

interface IEditMangaDialog {
    manga: Manga;
    user: User;
    onMangaUpdated: () => void;
    onMangaAdded: (manga: Manga) => void;
    onMangaDeleted: () => void;
    onMangaEditCancel: () => void;
}

const EditMangaDialog: React.FunctionComponent<IEditMangaDialog> = (props) => {
    const [manga, setManga] = useState<Manga>(props.manga);
    const publishers = Object.keys(Publisher).map(x => (Publisher as any)[x]);
    const genres = Object.keys(Genre).map(x => (Genre as any)[x]);
    const languages = Object.keys(Language).map(x => (Language as any)[x]);
    const status = Object.keys(Status).map(x => (Status as any)[x]);

    const updateManga = () => {
        if (!props.user)
            return;

        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: manga,
                token: props.user.token
            })
            .then(({ data }) => {
                // TODO Status Message
                props.onMangaUpdated();
            })
            .catch(function (error) {
                // TODO Status Message
                // handle error
            });
    }

    const insertManga = () => {
        if (!props.user)
            return;
            
        axios
            .post(
                (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
                manga: manga,
                token: props.user.token
            }
            )
            .then(({ data }) => {
                if (data) {
                    props.onMangaAdded(data);
                }
                else {
                    // TODO Status Message
                }
            })
            .catch(function (error) {
                // TODO Status Message
                // handle error
            });
    }

    const deleteManga = () => {
        if (!props.user)
            return;
            
        axios
            .delete(
                (process.env.REACT_APP_ENDPOINT + "/api/manga/" + manga.mangaid), {
                    params: {
                        token: props.user.token
                    }
                }
            )
            .then(() => {
                props.onMangaDeleted();
            })
            .catch(function (error) {
                // TODO Status Message
                // handle error
            });
    }

    return (
        <div className={Styles.Modal} onClick={props.onMangaEditCancel}>
            <div className={Styles.Dialog} onClick={e => e.stopPropagation()}>
                <div className={Styles.FormContainer}>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="name" value={manga.name ? manga.name : ""} onChange={(e) => setManga({...manga, name: e.currentTarget.value})} />
                            <label htmlFor="name">Title</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="originalname" value={manga.originalname ? manga.originalname : ""} onChange={(e) => setManga({...manga, originalname: e.currentTarget.value})} />
                            <label htmlFor="originalname">Original Title</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="author" value={manga.author ? manga.author : ""} onChange={(e) => setManga({...manga, author: e.currentTarget.value})} />
                            <label htmlFor="author">Author</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="artist" value={manga.artist ? manga.artist : ""} onChange={(e) => setManga({...manga, artist: e.currentTarget.value})} />
                            <label htmlFor="artist">Artist</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <Dropdown id="publisher" className={Styles.Dropdown} appendTo={document.body} value={manga.publisher ? manga.publisher : ""} 
                            optionLabel={""} optionValue={""} options={publishers} onChange={(e) => setManga({...manga, publisher: e.value})} />
                            <label htmlFor="publisher">Publisher</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <Dropdown id="status" className={Styles.Dropdown} appendTo={document.body} value={manga.status ? manga.status : ""} 
                            optionLabel={""} optionValue={""} options={status} onChange={(e) => setManga({...manga, status: e.value})} />
                            <label htmlFor="status">Status</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="volumes" className={Styles.Volumes} value={manga.volumes ? manga.volumes : ""} keyfilter="pint" onChange={(e) => setManga({...manga, volumes: parseInt(e.currentTarget.value)})} />
                            <label htmlFor="volumes">Volumes</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <Dropdown id="language" className={Styles.Dropdown} appendTo={document.body} value={manga.language ? manga.language : ""} 
                            optionLabel={""} optionValue={""} options={languages} onChange={(e) => setManga({...manga, language: e.value})} />
                            <label htmlFor="language">Language</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <Dropdown id="genre" className={Styles.Dropdown} appendTo={document.body} value={manga.genre ? manga.genre : ""} 
                            optionLabel={""} optionValue={""} options={genres} onChange={(e) => setManga({...manga, genre: e.value})} />
                            <label htmlFor="genre">Genre</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="image" value={manga.image ? manga.image : ""} onChange={(e) => setManga({...manga, image: e.currentTarget.value})} />
                            <label htmlFor="image">Image</label>
                        </span>
                    </div>
                    <div className={[Styles.FormInput, Styles.Description].join(" ")}>
                        <span className="p-float-label">
                            <InputTextarea id="description" className={Styles.Description} value={manga.description ? manga.description : ""} onChange={(e) => setManga({...manga, description: e.currentTarget.value})} />
                            <label htmlFor="description">Description</label>
                        </span>
                    </div>
                </div>
                {/* Buttons */}
                <div className={Styles.FormButtonRow}>
                    {manga.mangaid &&
                    <Button label={"Delete"} icon="pi pi-trash" onClick={() => {
                        deleteManga();
                    }} />}
                    <Button label={"Save"} icon="pi pi-save" onClick={() => {
                        if (manga.mangaid)
                            updateManga();
                        else
                            insertManga();
                    }} />
                    <Button label={"Cancel"} icon="pi pi-times" onClick={props.onMangaEditCancel} />
                </div>
            </div>
        </div>
    );
}

export default EditMangaDialog