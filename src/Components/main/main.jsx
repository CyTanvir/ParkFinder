import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./main.css";
import "./media.css";

const Navbar = () => {
  return (
    <nav id="navigation">
      <div className="Logo">Park Finder</div>
      <ul>
        <li><Link to="/mostvisited">Hot Spot</Link></li>
        <li><Link to="/hotspot">Most Visited</Link></li>
        <li><Link to="/contactus">Contact Us</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/account">Your Account</Link></li>
      </ul>
    </nav>
  );
};

const Home = () => {
  return (
    <div id="mid">
      <div className="mid-h1">Park Finder</div>
      <div className="mid-a1">
        Thank you for visiting Park Finder. We prioritize our customers and make sure they get the best 
        experience. Through this Park Finder, you can easily view different parks and see their reviews.
        You can also review these websites.
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
