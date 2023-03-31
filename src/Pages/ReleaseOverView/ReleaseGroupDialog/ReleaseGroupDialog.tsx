import React, { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTableRowEditEvent, DataTableRowEditSaveEvent } from 'primereact/datatable';
import { Dialog } from "primereact/dialog";
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

import { Manga } from "../../../Types/Manga";
import { Release } from "../../../Types/Release";
import { User } from "../../../Types/User";

import Styles from "./ReleaseGroupDialog.module.css"


interface IReleaseGroupProps {
    user: User;
    manga: Manga[];
    releases: Release[];
    editable: boolean;
    visible: boolean;

    onUpdate: (release: Release) => void;
    onDelete: (release: Release) => void;
    onHide: () => void;
}

const ReleaseGroupDialog: React.FunctionComponent<IReleaseGroupProps> = (props) => {

    const mangaList = props.manga.map(x => {
        return { ...x, name: x.name + "_" + x.language }
    })

    const [releaseMangaData, setReleaseMangaData] = useState<{ release: Release, manga: Manga }[]>([]);
    const [clonedRows, setClonedRows] = useState<{ release: Release, manga: Manga }[]>([]);

    useEffect(() => {
        setReleaseMangaData(props.releases.map(x => {
            const manga = props.manga.find(y => y.mangaid === x.mangaid) as Manga;
            return { release: x, manga: manga }
        }));
    }, [props]);

    const onRowEditValidator = (rowData: any) => {
        return true;
    }

    const onRowEditInit = (event: DataTableRowEditEvent) => {
        let tempClonedRows = [...clonedRows];
        tempClonedRows[event.data.release.releaseId] = { release: { ...event.data.release }, manga: { ...event.data.manga } };
        setClonedRows(tempClonedRows);
    }

    const onRowEditSave = (event: DataTableRowEditSaveEvent) => {
        if(!onRowEditValidator(event.data))
            return;

        props.onUpdate(event.data.release)
    }

    const onRowEditCancel = (event: DataTableRowEditEvent) => {
        let tempData = [...releaseMangaData];
        tempData[event.index] = clonedRows[event.data.release.releaseId];
        setReleaseMangaData(tempData);
    }

    const activeTemplate = (rowData: any, column: any) => {
        return <Checkbox checked={!rowData.release.active} onChange={() => {
            let release = { ...rowData.release };
            release.active = !release.active;
            props.onUpdate(release);
        }} />;
    }

    const releaseDateTemplate = (rowData: any, column: any) => {
        return <div>{(rowData.release as Release).releasedate.toDateString()}</div>;
    }

    const releaseDateEditor = (editorProps: any) => {
        return (
            <Calendar
                appendTo={document.body}
                dateFormat="dd/mm/yy"
                panelClassName={Styles.Calendar}
                value={releaseMangaData[editorProps.rowIndex].release.releasedate}
                onChange={(e) => {
                    let tempData = [...releaseMangaData];
                    tempData[editorProps.rowIndex].release.releasedate = getUTCDate(e.value as Date);
                    setReleaseMangaData(tempData);
                }} />
        )
    }

    const deleteTemplate = (rowData: any, column: any) => {
        return <Button icon={"pi pi-trash"} onClick={e => props.onDelete(rowData.release as Release)} className={"normal"} />;
    }

    const getUTCDate = (date: Date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    const mangaEditor = (editorProps: any) => {
        return (
            <Dropdown
                appendTo={document.body}
                value={mangaList.find(x => x.mangaid === editorProps.rowData.manga.mangaid)}
                options={mangaList}
                optionLabel="name"
                onChange={(e) => {
                    const currManga = props.manga.find(x => x.mangaid === e.value.mangaid);
                    if(currManga) {
                        let tempData = [...releaseMangaData];
                        tempData[editorProps.rowIndex].manga = currManga;
                        setReleaseMangaData(tempData);
                    }
                }}
                filter={true}
                filterBy="name,artist,author" />
        )
    }

    const volumeEditor = (editorProps: any) => {
        return (
            <InputNumber
                value={releaseMangaData[editorProps.rowIndex].release.volume}
                onChange={(e) => {
                    if(e.value !== null) {
                        let tempData = [...releaseMangaData];
                        tempData[editorProps.rowIndex].release.volume = e.value;
                        setReleaseMangaData(tempData);
                    }
                }} />
        )
    }

    return (
        <Dialog
            visible={props.visible}
            onHide={props.onHide}
            className={Styles.Dialog}
            dismissableMask={true}
            header={"Edit Release"}>
            <DataTable
                value={releaseMangaData}
                editMode="row"
                rowEditValidator={onRowEditValidator}
                onRowEditInit={onRowEditInit}
                onRowEditSave={onRowEditSave}
                onRowEditCancel={onRowEditCancel}
            >
                {props.editable ? <Column field="release.active" header="" body={activeTemplate} style={{
                    'width': '40px',
                    'textAlign': 'center',
                    "paddingLeft": "0px",
                    "paddingRight": "0px",
                }}
                /> : null}
                <Column field="release.releasedate" header="Date" body={releaseDateTemplate} editor={releaseDateEditor} />
                <Column field="manga.publisher" header="Publisher" />
                <Column field="manga.name" header="Name" editor={mangaEditor} />
                <Column field="release.volume" header="Volume" editor={volumeEditor} />
                {props.editable ? <Column rowEditor={true} style={{
                    'width': '40px',
                    'textAlign': 'center',
                    "borderRight": "0px",
                    "paddingLeft": "0px",
                    "paddingRight": "0px",
                }}
                /> : null}
                {props.editable ? <Column field="release.active" header="" body={deleteTemplate} style={{
                    'width': '40px',
                    'textAlign': 'center',
                    "borderLeft": "0px",
                    "paddingLeft": "0px",
                    "paddingRight": "0px",
                }}
                /> : null}
            </DataTable>
        </Dialog >
    );
}

export default ReleaseGroupDialog;