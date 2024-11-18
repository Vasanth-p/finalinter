import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        <NavLink to="/" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/products" activeClassName="active">Products</NavLink>
        <NavLink to="/reports" activeClassName="active">Reports</NavLink>
        <NavLink to="/settings" activeClassName="active">Settings</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
