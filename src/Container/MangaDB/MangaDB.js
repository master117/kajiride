import React, { Component } from 'react';
import Tabletop from 'tabletop';
import MangaList from '../../Components/MangaList/MangaList'
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
      Tabletop.init({
          key: '1e-H6KxJE_cXuGAmRM2-BtTXX2Tqq-MMXiWNut05nW94',
          callback: googleData => {
            this.setState({
                data: googleData
            })
          },
          simpleSheet: true
      })
  }

  render() {
    const upperSearchString = this.props.searchString.toUpperCase();
    const filterData = this.state.data.filter(x =>
      x.Titel.toUpperCase().includes(upperSearchString) 
      || x.Autor.toUpperCase().includes(upperSearchString) 
      || x.Zeichner.toUpperCase().includes(upperSearchString) 
    );
   
    
    return (
      <MangaList data={filterData} />
    )
  }
}
 
export default connect(mapStateToProps)(MangaDB);