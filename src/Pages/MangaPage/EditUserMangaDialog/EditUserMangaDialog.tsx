import axios from "axios";
import React, { useState } from 'react'

import { Button } from "primereact/button"
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

import { User } from "../../../Types/User";
import { UserManga } from "../../../Types/UserManga";

import Styles from "./EditUserMangaDialog.module.scss"

interface IEditUserMangaDialog {
    mangaid: number;
    user: User;
    userManga: UserManga
    onUserMangaUpdated: () => void;
    onUserMangaEditCancel: () => void;
}

const EditUserMangaDialog: React.FunctionComponent<IEditUserMangaDialog> = (props) => {
    const [userManga, setUserManga] = useState<UserManga>(props.userManga);

    const updateUserManga = () => {
        if (!props.user)
        return;

        if (userManga.userid && userManga.mangaid) {
            axios
                .put(
                    (process.env.REACT_APP_ENDPOINT + "/api/usermanga"), {
                    usermanga: userManga,
                    token: props.user.token
                })
                .then(({ data }) => {
                    props.onUserMangaUpdated()
                })
                .catch(function (error) {
                    // handle error
                    // TODO
                });
        }
        else {
            axios
                .post(
                    (process.env.REACT_APP_ENDPOINT + "/api/usermanga"), {
                    usermanga: userManga,
                    userid: props.user.id,
                    mangaid: props.mangaid,
                    token: props.user.token
                })
                .then(({ data }) => {
                    props.onUserMangaUpdated()
                })
                .catch(function (error) {
                    // handle error
                    // TODO
                });
        }
    }

    return (
        <div className={Styles.Modal}>
            <div className={Styles.Dialog} onClick={e => e.stopPropagation()}>
                <div className={Styles.FormContainer}>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="score" value={userManga.score ? userManga.score : ""} keyfilter="pint" onChange={(e) => setUserManga({...userManga, score: parseInt(e.currentTarget.value) })} />
                            <label htmlFor="score">Score</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputText id="owned" value={userManga.owned ? userManga.owned : ""} keyfilter="pint" onChange={(e) => setUserManga({...userManga, owned: parseInt(e.currentTarget.value) })} />
                            <label htmlFor="owned">Owned</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputTextarea id="comment" value={userManga.comment ? userManga.comment : ""} onChange={(e) => setUserManga({...userManga, comment: e.currentTarget.value })} />
                            <label htmlFor="comment">Comment</label>
                        </span>
                    </div>
                </div>
                    {/* Buttons */}
                <div className={Styles.FormButtonRow}>
                        <Button label={"Save"} icon="pi pi-save" onClick={() => { updateUserManga(); }}></Button>
                        <Button label={"Cancel"} icon="pi pi-save" onClick={props.onUserMangaEditCancel}></Button>
                </div>
            </div>
        </div>
    );
}

export default EditUserMangaDialog