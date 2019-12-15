import React, { useState, useEffect } from "react";
import axios from 'axios';

import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import classes from "./ReleaseEntry.module.css"


const ReleaseEntry = (props) => {

    const mangaList = props.manga.map(x => {
        return { ...x, name: x.name + "_" + x.language }
    })

    const [releaseMangaData, setReleaseMangaData] = useState();
    const [clonedRows, setClonedRows] = useState([]);

    useEffect(() => {
        setReleaseMangaData(props.data.map(x => { 
            const manga = props.manga.find(y => y.mangaid === x.mangaId);
            return { release: x, manga: manga } 
        }));
    }, [props]);

    const onRowEditorValidator = (rowData) => {
        console.log("valid")
        console.log(rowData)
        return true;
    }

    const onRowEditInit = (event) => {
        let tempClonedRows = [...clonedRows];
        tempClonedRows[event.data.release.releaseId] = { release: {...event.data.release}, manga: {...event.data.manga} };
        setClonedRows(tempClonedRows);
    }

    const onRowEditSave = (event) => {
        if (!onRowEditorValidator(event.data))
            return;

        console.log("save")
        console.log(event)
    }

    const onRowEditCancel = (event) => {      
        let tempData = [...releaseMangaData];
        tempData[event.index] = clonedRows[event.data.release.releaseId];
        setReleaseMangaData(tempData);
    }

    const activeTemplate = (rowData, column) => {
        return <Checkbox checked={!rowData.release.active} onChange={() => {
            let release = { ...rowData.release };
            release.active = !release.active;
            props.onUpdate(release);
        }} />;
    }

    const releaseDateTemplate = (rowData, column) => {
        var d = new Date(rowData.release.releaseDate);
        return <div>{d.getDay() + "." + d.getMonth() + "." + d.getFullYear()}</div>;
    }

    const mangaEditor = (editorProps) => {
        return (
            <Dropdown 
            value={mangaList.find(x => x.mangaid === editorProps.rowData.manga.mangaid)} 
            options={mangaList} 
            optionLabel="name"
            onChange={(e) => { 
                let tempData = [...releaseMangaData];    
                tempData[editorProps.rowIndex].manga = props.manga.find(x => x.mangaid === e.value.mangaid);
                setReleaseMangaData(tempData);
            }} 
            filter={true} 
            filterBy="name,artist,author" />
        )
    }

    const volumeEditor = (editorProps) => {
        return (
            <InputText 
            value={releaseMangaData[editorProps.rowIndex].release.volume} 
            keyfilter="int"
            onChange={(e) => { 
                let tempData = [...releaseMangaData];    
                tempData[editorProps.rowIndex].release.volume = e.currentTarget.value;
                setReleaseMangaData(tempData);
            }} />
        )
    }

    return (
        <DataTable value={releaseMangaData}
            editMode="row"
            rowEditorValidator={onRowEditorValidator}
            onRowEditInit={onRowEditInit}
            onRowEditSave={onRowEditSave}
            onRowEditCancel={onRowEditCancel}>
            {props.editable ? <Column field="release.active" header="" body={activeTemplate} /> : null}
            <Column field="release.releaseDate" header="Date" body={releaseDateTemplate} />
            <Column field="manga.publisher" header="Publisher" />
            <Column field="manga.name" header="Name" editor={mangaEditor} />
            <Column field="release.volume" header="Volume" editor={volumeEditor} />
            {props.editable ? <Column rowEditor={true} style={{ 'width': '70px', 'textAlign': 'center' }}></Column> : null}
        </DataTable>
    );
}

export default ReleaseEntry;