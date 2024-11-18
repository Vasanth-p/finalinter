import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo">
      
        <h2>Inventory Management</h2>
        <p>Happy to see you here</p>
      </div>
      
      <nav className="nav-links">
      
        <NavLink to="/" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/products" activeClassName="active">Products</NavLink>
        <NavLink to="/reports" activeClassName="active">Reports</NavLink>
        <NavLink to="/settings" activeClassName="active">Settings</NavLink>
      </nav>
    </header>
  );
};

export default Header;
