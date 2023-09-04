import React from "react";
import { NavLink } from "react-router-dom";

// Components
import Title from "./common/Title";

const Navbar = () => {
  return (
    <nav>
      <Title title="Todo" />

      <NavLink
        to="/contents"
        className={({ isActive }) => {
          return isActive ? "navLink active" : "navLink";
        }}
      >
        Contents
      </NavLink>

      <NavLink
        to="/tags"
        className={({ isActive }) => {
          return isActive ? "navLink active" : "navLink";
        }}
      >
        Tags
      </NavLink>

      <input type="text" className="btn searchBar" placeholder="Search task" />
    </nav>
  );
};

export default Navbar;
