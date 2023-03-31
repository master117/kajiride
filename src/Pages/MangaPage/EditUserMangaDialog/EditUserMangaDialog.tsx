import axios from "axios";
import React, { useState } from 'react'

import { Button } from "primereact/button"
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';

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
                            <InputNumber id="score" value={userManga.score ? userManga.score : 0} onChange={(e) => { if(e.value !== null) setUserManga({...userManga, score: e.value})}} />
                            <label htmlFor="score">Score</label>
                        </span>
                    </div>
                    <div className={Styles.FormInput}>
                        <span className="p-float-label">
                            <InputNumber id="owned" value={userManga.owned ? userManga.owned : 0} onChange={(e) => { if(e.value !== null) setUserManga({...userManga, owned: e.value})}} />
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