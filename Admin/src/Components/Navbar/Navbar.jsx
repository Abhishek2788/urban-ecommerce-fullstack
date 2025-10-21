import React from 'react';
import './Navbar.css';
import navlogo from '../assets/Admin_Assets/nav-logo.svg';
import logo from '../assets/Frontend_Assets/logo.png';
import navProfile from '../assets/Admin_Assets/nav-profile.svg';

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="navlogo" className='nav-logo' />
      <p className='company-name'>Urban</p>
      {/* <img src={navProfile} alt="Profile Nav" className='nav-profile' /> */}
    </div>
  )
}

export default Navbar;
