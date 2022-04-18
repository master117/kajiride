import React, { useEffect, useRef, useMemo } from "react";
import { Button } from "primereact/button"
import MangaListEntry from './MangaListEntry/MangaListEntry';
import { Manga } from '../../Types/Manga';
import Styles from './MangaList.module.css';
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { User } from "../../Types/User";

declare global {
    interface Window {
        mangaListScroll?: number;
    }
}

const mapStateToProps = (state: { searchString: any; }) => {
    return { searchString: state.searchString };
};

type TParams = { };

interface IMangaList extends RouteComponentProps<TParams> { 
    searchString: string;
    mangaData: Manga[]
    user: User | null;
    logOut: () => void;
}

const MangaList: React.FunctionComponent<IMangaList> = (props) => {
    const toast = useRef<Toast>(null);

    const getFilteredMangaList = () => {
        const upperSearchString = props.searchString.toUpperCase();
        const filterData = props.mangaData.filter((x: Manga) => x.name.toUpperCase().includes(upperSearchString)
            || (!!x.author && x.author.toUpperCase().includes(upperSearchString))
            || (!!x.publisher && x.publisher.toUpperCase().includes(upperSearchString))
            || (!!x.artist && x.artist.toUpperCase().includes(upperSearchString)));
        const pagedData = filterData.slice(0, 1000);
        return pagedData.map(entry => <MangaListEntry manga={entry} key={entry.mangaid} />);
    }

    useEffect(() => {
        const container = document.getElementById("scrollContainer");
        if(window.mangaListScroll && container) {
            container.scrollTo(0, window.mangaListScroll);
            delete window.mangaListScroll;
            console.log(window.mangaListScroll);
        }
    }, []);

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const container = document.getElementById("scrollContainer");
        if(container) {  
            window.mangaListScroll = container.scrollTop;
        }
    }

    const MangaListEntries = useMemo(getFilteredMangaList, [props.mangaData, props.searchString])

    return (
        <div id="scrollContainer" className={Styles.Container} onScroll={onScroll}>
            <Toast ref={toast} />
            {props.user && props.user.role === 1 ?
                    <Button label={"New Manga"} className={"button"} icon="pi pi-plus" onClick={() => props.history.push('/newmanga/')} />
                : ""}
            <div className={Styles.Inner}>
                {MangaListEntries}
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(withRouter(MangaList));