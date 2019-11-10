import React, { Component } from 'react';
import axios from 'axios';
import MangaList from '../../Components/MangaList/MangaList'
import MangaPage from '../../Components/MangaPage/MangaPage'
//import classes from './MangaDB.module.css';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { searchString: state.searchString };
};

class MangaDB extends Component {

  state = {
    data: []
  }

  componentDidMount() {
    axios
      .get(
        (process.env.REACT_APP_ENDPOINT + "/api/manga"), {
      }
      )
      .then(({ data }) => {
        this.setState({
          data: data
        })
      });
  }

  mangaPage = (id, user) => {
    const filterData = this.state.data.filter(x => x.mangaid.toString() === id)[0]; 
    return <MangaPage data={filterData} user={user} />;
  }

  mangaList = (props) => {
    const upperSearchString = this.props.searchString.toUpperCase();
    const filterData = this.state.data ? this.state.data.filter(x =>
      x.name.toUpperCase().includes(upperSearchString)
      || (!!x.author && x.author.toUpperCase().includes(upperSearchString))
      || (!!x.artist && x.artist.toUpperCase().includes(upperSearchString))) : [];

    return <MangaList data={filterData} />;
  }

  render() {  
    if(this.state.data.length === 0)
    {
      return null;
    }

    if (this.props.match.params.id) {
      return this.mangaPage(this.props.match.params.id, this.props.user);
    }
    else {
      return this.mangaList();
    }
  }
}

export default connect(mapStateToProps)(MangaDB);