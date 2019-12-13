import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import Navbar from './Pages/Navbar/Navbar';
import MangaList from './Pages/MangaList/MangaList'
import MangaPage from './Pages/MangaPage/MangaPage'
import MangaReleases from './Pages/MangaReleases/MangaReleases'
import Login from './Utility/Login/Login';
import { useCookies } from 'react-cookie';

const App = (props) => {
  const [mounted, setMounted] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [cookies, setCookie, deleteCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);

  const [wrongLogin, setWrongLogin] = React.useState(false);

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
        setUser(cookies.user);
      }
    }
  }, [mounted, cookies.user, props]);

  const logIn = (username, password) => {
    axios
      .post(
        (process.env.REACT_APP_ENDPOINT + "/api/login"), {
        username: username,
        password: password
      }
      )
      .then(({ data }) => {
        if (data != null) {
          setWrongLogin(false);
          closeLoginModal();
          setCookie("user", data);
          setUser(data);     
        }
        else {
          setWrongLogin(true);
        }
      });
  }

  const logOut = () => {
    axios
      .post(
        (process.env.REACT_APP_ENDPOINT + "/api/logout"), {
        token: cookies.user.token,
      }
      )
      .then(({ data }) => {
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
        <Navbar openLogin={openLoginModal} logOut={logOut} user={user} />
        <Route path="/" exact component={MangaList} />
        <Route path="/manga/:id"  render={(props) => <MangaPage {...props} user={user} />} />
        <Route path="/releases/" component={MangaReleases} />
        {openLogin ? <Login closeLogin={closeLoginModal} logIn={logIn} wrongLogin={wrongLogin} /> : ""}
      </Router>
    </div>
  );
}

export default App;
