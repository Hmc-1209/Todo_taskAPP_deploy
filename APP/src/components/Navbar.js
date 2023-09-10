import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { LayoutContext } from "./Layout";
import { get_repo_tasks } from "./functions/request";

// Components
import Title from "./common/Title";
import { AppContext } from "../App";

const Navbar = () => {
  const { repos, setSelectedRepo, setTasks } = useContext(LayoutContext);
  const { setTaskIsLoading } = useContext(AppContext);

  // Set the selected repository to first repo as default
  const selectDefaultRepo = () => {
    const selected_repo = repos[0];
    setSelectedRepo(selected_repo.repo_name);

    const get_tasks_from_repo = async () => {
      setTaskIsLoading(true);
      const tasks = await get_repo_tasks(selected_repo.repo_id);
      setTasks(tasks);
      setTaskIsLoading(false);
    };

    get_tasks_from_repo();
  };

  return (
    <nav>
      <Title title="Todo" />

      {repos.length === 0 && (
        <>
          <div className="navLink">Contents</div>

          <div className="navLink">Tags</div>
        </>
      )}

      {repos.length !== 0 && (
        <>
          <div className="navLink" onClick={selectDefaultRepo}>
            <NavLink
              to="/contents"
              className={({ isActive }) => {
                return isActive ? "navLink active" : "navLink";
              }}
            >
              Contents
            </NavLink>
          </div>

          <div className="navLink" onClick={selectDefaultRepo}>
            <NavLink
              to="/tags"
              className={({ isActive }) => {
                return isActive ? "navLink active" : "navLink";
              }}
            >
              Tags
            </NavLink>
          </div>
        </>
      )}

      <input type="text" className="btn searchBar" placeholder="Comming soon" />
    </nav>
  );
};

export default Navbar;
