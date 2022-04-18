import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Toast } from 'primereact/toast';
import { HashRouter as Router, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet';

import Navbar from './Pages/Navbar/Navbar';
import MangaList from './Pages/MangaList/MangaList'
import MangaPage from './Pages/MangaPage/MangaPage'
import ReleaseOverView from './Pages/ReleaseOverView/ReleaseOverView';
import UserProfile from './Pages/UserProfile/UserProfile';

import { Manga } from "./Types/Manga";

import Styles from './App.module.css';

const App = (props: any) => {
  const toast = useRef<Toast>(null);

  const [mounted, setMounted] = useState(false);
  const [mangaData, setMangaData] = useState<Manga[]>([]);

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [wrongLogin, setWrongLogin] = React.useState(false);
  const [wrongRegister, setWrongRegister] = React.useState(false);
  const [message, setMessage] = React.useState(undefined);
  const [loginBusy, setLoginBusy] = React.useState(false);

  useEffect(() => {
    if(!mounted) {
      setMounted(true);
      if(cookies.user) {
        setUser(cookies.user);
      }
    }
  }, [mounted, cookies.user, props]);

  

  useEffect(() => {
    axios
        .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
        .then((response: { data: Manga[] }) => {
            response.data.sort(function (a, b) {
                var nameA = a.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // ignore upper and lowercase
                if(nameA < nameB) {
                    return -1;
                }
                if(nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            setMangaData(response.data);
        })
        .catch(function (error) {
            // handle error
            if(toast && toast.current)
                toast.current.show({ severity: 'error', summary: 'Error Loading Data', detail: error.message });
        });
  }, []);

  const logIn = (username: string, password: string) => {
    setLoginBusy(true);
    axios
      .post(
        (process.env.REACT_APP_ENDPOINT + "/api/login"), {
        username: username,
        password: password
      }
      )
      .then(({ data }) => {
        if(data != null) {
          setLoginBusy(false);
          setWrongLogin(false);
          setCookie("user", data, { path: '/' });
          setUser(data);
        }
        else {
          setLoginBusy(false);
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
      .finally(() => {
        removeCookie("user", { path: '/' });
        setUser(null);
      });
  }

  const register = (username: string, password: string) => {
    setLoginBusy(true);
    axios
      .post(
        (process.env.REACT_APP_ENDPOINT + "/api/register"), {
        username: username,
        password: password
      }
      )
      .then(({ data }) => {
        if(data != null) {
          if(data.Key) {
            setWrongRegister(false);
            setMessage(undefined);
            logIn(username, password);
          }
          else {
            setWrongRegister(true);
            setMessage(data.Value);
          }
        }
        else {
          setLoginBusy(false);
          setWrongRegister(true);
        }
      });
  }

  // Add a response interceptor, mostly to watch errors
  axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Log error
    console.log(error);
    console.log(error.message);
    console.log(error.config);
    // 401 = Unauthorized => LogOut
    if(error.response.status === 401) {
      if(toast && toast.current)
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Token expired, user was logged out' });
      logOut();
    }

    return Promise.reject(error);
  });

  return (
    <div className={Styles.App}>
      <Toast ref={toast} />
      <Helmet>
        <title>Kajiri.de</title>
        <script src="https://kit.fontawesome.com/0e0dccff56.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <Router>
        <Navbar {...props} loginBusy={loginBusy} wrongLogin={wrongLogin} logIn={logIn} logOut={logOut} register={register} wrongRegister={wrongRegister} message={message} user={user} />
        <div className={Styles.Body}>
          <Route path="/" exact render={(props) => <MangaList {...props} logOut={logOut} user={user} mangaData={mangaData} />} />
          <Route path="/manga/:id" render={(props) => <MangaPage {...props} logOut={logOut} user={user} />} />
          <Route path="/newmanga/" render={(props) => <MangaPage {...props} logOut={logOut} user={user} />} />
          <Route path="/releases/" render={(props) => <ReleaseOverView {...props} logOut={logOut} user={user} />} />
          <Route path="/user/" render={(props) => <UserProfile {...props} user={user} />} />
          <div style={{ position: "fixed", bottom: "0px", right: "25px", color: "white" }}><a href="https://www.pixiv.net/en/artworks/39266182">Art by 3211</a></div>
        </div>
      </Router>
      
    </div>
  );
}

export default App;
