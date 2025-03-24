import React from "react";
import "./Home.css";


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

const Main = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default Main;