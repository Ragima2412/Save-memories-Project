import React from 'react';
import { Container } from '@material-ui/core';
import Navbar from './components/Navbar/Navbar';
import { Route } from "react-router";
import { BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';

import './index.css';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
    return (
        <Router>
        <Container maxWidth="xl">
          <Navbar />
          <Routes>  
            <Route path="/" exact element={<Navigate to="/posts" />} />
            <Route path="/posts" exact element={<Home />} />
            <Route path="/posts/search" exact element={<Home />} />
            <Route path="/posts/:id" exact element={<PostDetails/>} />
            <Route path="/auth" exact element={!user ? <Auth /> : <Navigate to="/posts" />} />
          </Routes>
        </Container>
      </Router>
    ); 
};

export default App;