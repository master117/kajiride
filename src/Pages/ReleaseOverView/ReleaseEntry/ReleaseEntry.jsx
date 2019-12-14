import React, { useState, useEffect } from "react";
import axios from 'axios';

import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';

import classes from "./ReleaseEntry.module.css"


const ReleaseEntry = (props) => {

    let clonedRow = {}
    const assignedData = props.data.map(y => {
        const currentManga = props.manga.find(z => z.mangaid === y.mangaId);
        return { release: y, manga: currentManga }
    });


    const [data, setData] = useState();
    const [mangaSuggestions, setMangaSuggestions] = useState(null);

    useEffect(() => {
        setData(assignedData);
    }, [props]);

    const onRowEditorValidator = (rowData) => {
        let value = rowData['brand'];
        return value.length > 0;
    }

    const onRowEditInit = (event) => {
        console.log(event);
        clonedRow[event.data.release.releaseId] = { ...event.data };
        console.log(clonedRow);
    }

    const onRowEditSave = (event) => {

    }

    const onRowEditCancel = (event) => {
        console.log(clonedRow);
        let tempData = [...data];
        tempData[event.index] = clonedRow[event.data.release.releaseId];
        delete clonedRow[event.data.release.releaseId];
        setData(tempData);
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

    const mangaEditorComplete = (event) => {
        let results = props.manga.filter((x) => {
            return x.name.toLowerCase().includes(event.query.toLowerCase());
       });

       setMangaSuggestions(results);
    }

    const mangaEditor = (editorProps) => {
        console.log("props")
        console.log(editorProps)
        return <AutoComplete
            field="name"
            dropdown={true}
            dropdownMode={"blank"}
            value={editorProps.rowData.manga.name}
            onChange={(e) => {
                let tempData = [...data];               
            }}
            suggestions={mangaSuggestions}
            completeMethod={mangaEditorComplete} />;
    }

    return (
        <DataTable value={data}
            editMode="row"
            rowEditorValidator={onRowEditorValidator}
            onRowEditInit={onRowEditInit}
            onRowEditSave={onRowEditSave}
            onRowEditCancel={onRowEditCancel}>
            {props.editable? <Column field="release.active" header="" body={activeTemplate} /> : null}
            <Column field="release.releaseDate" header="Date" body={releaseDateTemplate} />
            <Column field="manga.name" header="Name" editor={mangaEditor} />
            <Column field="release.volume" header="Volume" />
            {props.editable? <Column rowEditor={true} style={{ 'width': '70px', 'textAlign': 'center' }}></Column> : null}
        </DataTable>
    );
}

export default ReleaseEntry;