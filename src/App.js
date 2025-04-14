import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Components/LogSign/Signup';
import Login from './Components/LogSign/Login';
import Home from './Components/HomePage/Home'; 
import ContactUs from './Components/HomePage/Contact/ContactUs'; 
import Nav from './Components/Nav/Navbar';
import AboutUs from './Components/HomePage/About/AboutUs';
import HotSpot from './Components/HomePage/HotS/HotSpot';
import ProfileAcc from './Components/HomePage/Profile/ProfileAcc'

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignIn" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/hotspot" element={<HotSpot/>} />
        <Route path="/account" element={<ProfileAcc/>} />
      </Routes>
    </Router>
  );
};

export default App;
