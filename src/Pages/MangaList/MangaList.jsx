import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Button } from "primereact/button"
import MangaListEntry from './MangaListEntry/MangaListEntry';
import classes from './MangaList.module.css';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Growl } from 'primereact/growl';

const mapStateToProps = state => {
    return { searchString: state.searchString };
};

const MangaList = (props) => {
    const [data, setData] = useState([]);
    const growl = useRef(null);

    const upperSearchString = props.searchString.toUpperCase();
    const filterData = data.filter(x => x.name.toUpperCase().includes(upperSearchString)
        || (!!x.author && x.author.toUpperCase().includes(upperSearchString))
        || (!!x.artist && x.artist.toUpperCase().includes(upperSearchString)));
    const pagedData = filterData.slice(0, 1000);
    const returnData = pagedData.map(entry => <MangaListEntry manga={entry} key={entry.mangaid} />);

    useEffect(() => {
        if (data.length === 0) {
            axios
                .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
                .then(({ data }) => { 
                    console.log(data)
                    data.sort(function(a, b) {
                        var nameA = a.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // ignore upper and lowercase
                        var nameB = b.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1;
                        }
                        if (nameA > nameB) {
                          return 1;
                        }
                      
                        // names must be equal
                        return 0;
                      });
                    console.log(data)
                    setData(data); 
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log(error.message);
                    console.log(error.config);
                    growl.current.show({ severity: 'error', summary: 'Error Loading Data', detail: error.message });
                });
        }
        else {
            if (window.mangaListScroll) {
                window.scrollTo(0, window.mangaListScroll);
                delete window.mangaListScroll;
            }
        }

        return function cleanup() {
            if (!window.mangaListScroll) {
                window.mangaListScroll = window.scrollY;
            }
        };
    }, [data.length]);

    return (
        <div className={classes.Container}>
            <Growl ref={growl} />
            <div className={classes.Inner}>
                {props.user && props.user.role === 1 ? <div style={{width: "100%"}}><Button label={"New Manga"} className={"button"} icon="pi pi-plus" onClick={() => props.history.push('/newmanga/')} /></div>
                    : ""}
                {returnData}
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(withRouter(MangaList));