import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import HeaderLinks from "./HeaderLinks";
export default function Navbar() {
  return (
    <>
      <div className="nav">
        <NavLink path='/' className='logo'>Logo</NavLink>
        {/* <div className="btn">Login</div> */}
        <div className="links">
          {/* <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>about</NavLink>
        <NavLink to='/about'>about</NavLink>
        <NavLink to='/about'>about</NavLink>
        <NavLink to='/about'>about</NavLink> */}
          <HeaderLinks/>
        </div>
        <i className="fas fa-bars menu"></i>
      </div>
    </>
  );
}
