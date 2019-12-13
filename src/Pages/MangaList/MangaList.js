import React, { useState, useEffect } from "react";
import axios from 'axios';
import MangaListEntry from './MangaListEntry/MangaListEntry';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import classes from './MangaList.module.css';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => {
    return { searchString: state.searchString };
};

const MangaList = (props) => {
    const [data, setData] = useState([]);

    const upperSearchString = props.searchString.toUpperCase();
    const filterData = data.filter(x => x.name.toUpperCase().includes(upperSearchString)
        || (!!x.author && x.author.toUpperCase().includes(upperSearchString))
        || (!!x.artist && x.artist.toUpperCase().includes(upperSearchString)));
    const pagedData = filterData.slice(0, 10);
    const returnData = pagedData.map(entry => <MangaListEntry manga={entry} key={entry.mangaid} />);

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
            .then(({ data }) => { setData(data); });
    }, []);

return (
    <div className={classes.Container}>
        <div className={classes.Inner}>
            {props.user && props.user.role === 1 ? <Button variant="contained" color="primary" className={classes.Button} onClick={() => props.history.push('/newmanga/')}><AddIcon />New Manga</Button>
                : ""}
            {returnData}
        </div>
    </div>
);
};

export default connect(mapStateToProps)(withRouter(MangaList));