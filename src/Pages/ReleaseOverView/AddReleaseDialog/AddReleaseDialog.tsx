import React, { useState } from 'react';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

import { Manga } from '../../../Types/Manga';

import Styles from "./AddReleaseDialog.module.css";
import { InputNumber } from "primereact/inputnumber";

interface IAddReleaseDialogProps {
    manga: Manga[];
    visible: boolean;
    initialDate: Date;
    onHide: () => void;
    onSave: (date: Date, mangaId: number, volume: number) => void;
}

const AddReleaseDialog: React.FunctionComponent<IAddReleaseDialogProps> = (props) => {

    const mangaList = props.manga ? props.manga.map(x => {
        return { ...x, name: x.name + "_" + x.language }
    }) : [];

    const [date, setDate] = useState(props.initialDate);
    const [mangaId, setMangaId] = useState<number>(1);
    const [volume, setVolume] = useState<number>(1);

    const getUTCDate = (date: Date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    return (
        <Dialog
            visible={props.visible}
            onHide={props.onHide}
            dismissableMask={true}
            header={"New Release"}
            closable={false}
        >
            <table className={Styles.Table}>
                <tbody>
                    <tr>
                        <td>
                            <span className={Styles.Label}>Release Date:</span>
                        </td>
                        <td>
                            <Calendar
                                appendTo={document.body}
                                dateFormat="dd/mm/yy"
                                panelClassName={Styles.Calendar}
                                value={date}
                                onChange={(e) => {
                                    setDate(getUTCDate(e.value as Date));
                                }}
                                inputClassName={Styles.DropdownWide} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={Styles.Label}>Manga:</span>
                        </td>
                        <td>
                            <Dropdown
                                appendTo={document.body}
                                value={mangaId}
                                options={mangaList}
                                optionLabel="name"
                                optionValue="mangaid"
                                onChange={(e) => {
                                    setMangaId(e.value);
                                }}
                                filter={true}
                                filterBy="name,artist,author"
                                className={Styles.DropdownWide} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={Styles.Label}>Volume:</span>
                        </td>
                        <td>
                            <InputNumber
                                value={volume}
                                onChange={(e) => {
                                    if(e.value !== null)
                                        setVolume(e.value);
                                }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className={Styles.Row}>
                <Button label="Save" disabled={!date || !mangaId || !volume} onClick={() => props.onSave(date, mangaId, volume)} className={Styles.Button} />
                <Button label="Cancel" onClick={props.onHide} className={Styles.Button} />
            </div>
        </Dialog>
    );
};

export default AddReleaseDialog;