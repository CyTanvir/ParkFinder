import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Components/LogSign/Signup';
import Login from './Components/LogSign/Login';
import Home from './Components/HomePage/Home'; 
import Nav from './Components/Nav/Navbar';

const App = () => {
  return (
    <Router>
      <Nav/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignIn" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
