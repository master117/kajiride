import React, { useState } from 'react';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import classes from "./AddReleaseDialog.module.css";

const AddReleaseDialog = (props) => {

    const mangaList = props.manga ? props.manga.map(x => {
        return { ...x, name: x.name + "_" + x.language }
    }) : [];

    const [date, setDate] = useState(new Date(Date.now()));
    const [mangaId, setMangaId] = useState(null);
    const [volume, setVolume] = useState(1);

    return (
        <Dialog
            visible={props.visible}
            onHide={props.onHide}
            dismissableMask={true}
            header={"New Release"}
            closable={false} >
            <table className={classes.Table}>
                <tbody>
                    <tr>
                        <td>
                            <span className={classes.Label}>Release Date:</span>
                        </td>
                        <td>
                            <Calendar
                                dateFormat="dd/mm/yy"
                                panelClassName={classes.Calendar}
                                value={date}
                                onChange={(e) => {
                                    setDate(e.value);
                                }}
                                inputClassName={classes.DropdownWide} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={classes.Label}>Manga:</span>
                        </td>
                        <td>
                            <Dropdown
                                value={mangaId ? mangaList.find(x => x.mangaid === mangaId) : ""}
                                options={mangaList}
                                optionLabel="name"
                                onChange={(e) => {
                                    setMangaId(e.value.mangaid);
                                }}
                                filter={true}
                                filterBy="name,artist,author"
                                className={classes.DropdownWide} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={classes.Label}>Manga:</span>
                        </td>
                        <td>
                            <InputText
                                value={volume}
                                keyfilter="int"
                                onChange={(e) => {
                                    setVolume(e.currentTarget.value);
                                }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className={classes.Row}>
                <Button label="Save" onClick={() => props.onSave(date, mangaId, volume)} className={classes.Button} />
                <Button label="Cancel" onClick={props.onHide} className={classes.Button} />
            </div>
        </Dialog>
    );
};

export default AddReleaseDialog;