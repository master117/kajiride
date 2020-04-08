import React, { useState, useEffect } from "react";

import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { Manga } from "../../../Types/Manga";
import { Release } from "../../../Types/Release";
import { User } from "../../../Types/User";

import Styles from "./ReleaseGroupDialog.module.css"
import { Dialog } from "primereact/dialog";

interface IReleaseGroupProps {
    user: User;
    manga: Manga[];
    releases: Release[];
    editable: boolean;
    visible: boolean;

    onUpdate: (release: Release) => void;
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

    const onRowEditorValidator = (rowData: any) => {
        return true;
    }

    const onRowEditInit = (event: { originalEvent: Event; data: any; }) => {
        let tempClonedRows = [...clonedRows];
        tempClonedRows[event.data.release.releaseId] = { release: { ...event.data.release }, manga: { ...event.data.manga } };
        setClonedRows(tempClonedRows);
    }

    const onRowEditSave = (event: { originalEvent: Event; data: any; }) => {
        if (!onRowEditorValidator(event.data))
            return;

        props.onUpdate(event.data.release)
    }

    const onRowEditCancel = (event: { originalEvent: Event; data: any; index: number; }) => {
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
                    if (currManga) {
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
            <InputText
                value={releaseMangaData[editorProps.rowIndex].release.volume}
                keyfilter="pint"
                onChange={(e) => {
                    let tempData = [...releaseMangaData];
                    tempData[editorProps.rowIndex].release.volume = parseInt(e.currentTarget.value);
                    setReleaseMangaData(tempData);
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
            <DataTable value={releaseMangaData}
                editMode="row"
                rowEditorValidator={onRowEditorValidator}
                onRowEditInit={onRowEditInit}
                onRowEditSave={onRowEditSave}
                onRowEditCancel={onRowEditCancel}>
                {props.editable ? <Column field="release.active" header="" body={activeTemplate} /> : null}
                <Column field="release.releasedate" header="Date" body={releaseDateTemplate} editor={releaseDateEditor} />
                <Column field="manga.publisher" header="Publisher" />
                <Column field="manga.name" header="Name" editor={mangaEditor} />
                <Column field="release.volume" header="Volume" editor={volumeEditor} />
                {props.editable ? <Column rowEditor={true} style={{ 'width': '70px', 'textAlign': 'center' }}></Column> : null}
            </DataTable>
        </Dialog >
    );
}

export default ReleaseGroupDialog;