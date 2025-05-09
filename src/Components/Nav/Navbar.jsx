import React from 'react';
import { Link } from 'react-router-dom';
import park_icon from '../Assets/park.png'
import './Navbar.css';

const Navbar = () => {
    return (
        <nav id="navigation">
            <div className="Logo">
                <img className='use-icon' src={park_icon} alt="" />
                <Link to="/Home">ParkFinder</Link>
            </div>
            <ul>
             {/*   <li><Link to="/hotspot">Hot Spot</Link></li> */}
                <li><Link to="/mostvisited">Most Visited</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/account">Your Account</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
