import React from 'react';
import {Helmet} from "react-helmet";
import './App.css';
import MangaDB from './Container/MangaDB/MangaDB'
import Navbar from './Container/Navbar/Navbar';


function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Kajiri.de</title>
        <script src="https://kit.fontawesome.com/0e0dccff56.js"></script>
      </Helmet>
      <Navbar />
      <MangaDB />
    </div>
  );
}

export default App;
