import React, { Component } from 'react';
import Tabletop from 'tabletop';
import MangaList from '../../Components/MangaList/MangaList'
//import classes from './MangaReleases.module.css';
import { connect } from "react-redux";
var isbn = require('node-isbn');

const mapStateToProps = state => {
    return { searchString: state.searchString };
};

class MangaReleases extends Component {

    state = {
        data: [],
        fetchedData: [],
        fetched: false,
    }

    componentDidMount() {
        Tabletop.init({
            key: '1e-H6KxJE_cXuGAmRM2-BtTXX2Tqq-MMXiWNut05nW94',
            wanted: ["RELEASE"],
            callback: googleData => {
                console.log(googleData);
                this.setState({
                    data: googleData.RELEASE
                })
            }
        })
    }

    componentDidUpdate() {

        console.log(this.state.data);
        if (!this.state.fetched && this.state.data.elements.length > 0) {

            const fetchedData = [];
            for (let i = 0; i < this.state.data.elements.length; i++) {
                const ele = this.state.data.elements[i];
                console.log(ele);
                isbn.resolve(ele.ISBN).then(function (book) {
                    fetchedData.i = book;
                }).catch(function (err) {
                    console.log('Book not found', err);
                });
            }

            this.setState({
                fetched: true,
                fetchedData: fetchedData
            })
        }
    }

    render() {
        

        const upperSearchString = this.props.searchString.toUpperCase();
        //const output = [];

        for(let i = 0; i < this.state.data.length; i++)
        {
            //if(fetchedData[i]) {
            //    output.push({Titel: fetchedData[i], Author: })
            //}
        }

        const filterData = this.state.fetchedData.length > 0 ? this.state.data.elements.filter(x =>
            x.Titel.toUpperCase().includes(upperSearchString)
            || x.Autor.toUpperCase().includes(upperSearchString)
            || x.Zeichner.toUpperCase().includes(upperSearchString)) : [];

        return (
            <MangaList data={filterData} />
        )
    }
}

export default connect(mapStateToProps)(MangaReleases);