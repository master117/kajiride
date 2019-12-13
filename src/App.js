import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet';

import Navbar from './Pages/Navbar/Navbar';
import MangaList from './Pages/MangaList/MangaList'
import MangaPage from './Pages/MangaPage/MangaPage'
import NewMangaPage from './Pages/NewMangaPage/NewMangaPage'
import ReleaseOverView from './Pages/ReleaseOverView/ReleaseOverView';

import './App.css';

const App = (props) => {
  const [mounted, setMounted] = useState(false);

  const [cookies, setCookie, deleteCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [wrongLogin, setWrongLogin] = React.useState(false);
  const [loggingIn, setLoggingIn] = React.useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      if (cookies.user) {
        setUser(cookies.user);
      }
    }
  }, [mounted, cookies.user, props]);

  const logIn = (username, password) => {
    setLoggingIn(true);
    axios
      .post(
        (process.env.REACT_APP_ENDPOINT + "/api/login"), {
        username: username,
        password: password
      }
      )
      .then(({ data }) => {
        if (data != null) {
          setLoggingIn(false);
          setWrongLogin(false);
          setCookie("user", data);
          setUser(data);     
        }
        else {
          setLoggingIn(false);
          setWrongLogin(true);
        }
      });
  }

  const logOut = () => {
    axios
      .post(
        (process.env.REACT_APP_ENDPOINT + "/api/logout"), {
        token: cookies.user.token,
      })
      .then(() => {
          deleteCookie("user");
          setUser(null);  
      });
  }
  
  return (
    <div className="App">
      <Helmet>
        <title>Kajiri.de</title>
        <script src="https://kit.fontawesome.com/0e0dccff56.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <Router>
        <Navbar wrongLogin={wrongLogin} loggingIn={loggingIn} logIn={logIn} logOut={logOut} user={user} />
        <Route path="/" exact render={(props) => <MangaList {...props} user={user} />} />
        <Route path="/manga/:id" render={(props) => <MangaPage {...props} user={user} />} />
        <Route path="/newmanga/" render={(props) => <NewMangaPage {...props} user={user} />} />
        <Route path="/releases/" render={(props) => <ReleaseOverView {...props} user={user} />} />
      </Router>
    </div>
  );
}

export default App;
