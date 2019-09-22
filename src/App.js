import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import Navbar from './Container/Navbar/Navbar';
import MangaDB from './Container/MangaDB/MangaDB'
import MangaReleases from './Container/MangaReleases/MangaReleases'
import Login from './Components/Login/Login';
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { loggedIn } from "./redux/actions/index";

function mapDispatchToProps(dispatch) {
  return {
    loggedIn: entry => dispatch(loggedIn(entry))
  };
}

const App = (props) => {
  const [mounted, setMounted] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [cookies] = useCookies(['user']);

  const openLoginModal = () => {
    setOpenLogin(true);
  }

  const closeLoginModal = () => {
    setOpenLogin(false);
  }

  useEffect((event) => {
    if (!mounted) {
      setMounted(true);
      if (cookies.user) {
        props.loggedIn(cookies.user);
      }
    }
  }, [mounted, cookies.user, props]);

  return (
    <div className="App">
      <Helmet>
        <title>Kajiri.de</title>
        <script src="https://kit.fontawesome.com/0e0dccff56.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <Router>
        <Navbar openLogin={openLoginModal} />
        <Route path="/" exact component={MangaDB} />
        <Route path="/manga/:id" component={MangaDB} />
        <Route path="/releases/" component={MangaReleases} />
        {openLogin ? <Login closeLogin={closeLoginModal} /> : ""}
      </Router>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(App);
