import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./css/Layout.css";

// Components
import SideBarL from "./SidebarL";
import Navbar from "./Navbar";
import { AppContext, resetLogStatus, signOut } from "../App";
import {
  get_user_repos,
  checkValidation,
  update_user_repo,
  update_repo_task,
} from "./functions/request";
import alert_message from "./functions/alert";

export const LayoutContext = createContext(null);

// Updating repos datas
export const getRepos = async () => {
  const repos = await get_user_repos();
  return repos;
};

const Layout = () => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [editing, setEditing] = useState(-1);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [reRender, setReRender] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [delRepoConfirm, setDelRepoConfirm] = useState(0);
  const [due, setDue] = useState([-1, -1, -1]);
  const [focusing, setFocusing] = useState(0);
  const location = useLocation();

  let { setRepoIsLoading, setAlert, alert } = useContext(AppContext);

  useEffect(() => {
    const fetchRepos = async () => {
      if (await checkValidation()) {
        const reposData = await getRepos();
        if (!reposData) {
          resetLogStatus();
        }
        setRepos(reposData);
        setRepoIsLoading(false);
      } else {
        resetLogStatus();
        setReRender((prevReRender) => prevReRender + 1);
      }
    };
    fetchRepos();
    // eslint-disable-next-line
  }, []);

  const repoNameLegal = (new_name) => {
    // Check if the repo name is legal

    return repos.find((repo) => repo.repo_name === new_name) ? 0 : 1;
  };

  const updateRepoName = async (repo_name) => {
    // Update the specific repo's name

    const repo_id = repos.find(
      (repo) => repo.repo_name === editingItem
    ).repo_id;

    const updatedRepoIndex = repos.findIndex(
      (repo) => repo.repo_id === repo_id
    );

    if (updatedRepoIndex !== -1) {
      const old_value = repos[updatedRepoIndex].repo_name;
      const updatedRepos = [...repos];

      updatedRepos[updatedRepoIndex].repo_name = repo_name;
      setRepos(updatedRepos);

      const result = await update_user_repo(repo_id, repo_name);
      console.log(result);

      if (!result) {
        console.log("Update repo name roll back.");
        updatedRepos[updatedRepoIndex].repo_name = old_value;
        setRepos(updatedRepos);
        setSelectedRepo(old_value);
        setAlert(8);
        if (!(await checkValidation())) signOut();
        return;
      }
    }
  };

  const updateTask = async (task_id, task_info_type, task_info_value) => {
    // Find the task to update

    const updatedTaskIndex = tasks.findIndex(
      (task) => task.task_id === task_id
    );

    if (updatedTaskIndex !== -1) {
      const old_value = tasks[updatedTaskIndex][task_info_type];
      const updatedTasks = [...tasks];

      updatedTasks[updatedTaskIndex] = {
        ...updatedTasks[updatedTaskIndex],
        [task_info_type]: task_info_value,
      };
      setTasks(updatedTasks);

      const repo_id = repos.find(
        (repo) => repo.repo_name === selectedRepo
      ).repo_id;

      const result = await update_repo_task(
        updatedTasks[updatedTaskIndex].task_name,
        updatedTasks[updatedTaskIndex].task_description,
        updatedTasks[updatedTaskIndex].task_due_date,
        updatedTasks[updatedTaskIndex].task_finish,
        updatedTasks[updatedTaskIndex].task_id,
        repo_id,
        updatedTasks[updatedTaskIndex].creator_id
      );

      if (!result) {
        console.log("Update task rollback");
        updatedTasks[updatedTaskIndex][task_info_type] = old_value;
        setTasks(updatedTasks);
        setAlert(8);
        if (!(await checkValidation())) {
          signOut();
        }
        return;
      }
    }
  };

  // On change (finished editing)
  const changeEditingState = () => {
    // Default first click
    if (editing === -1) setEditing(0);
    // If finish editing
    else {
      if (editing === 1) {
        // Finish editing repo name

        const new_name = document.getElementById("selectedItem").value;
        if (
          new_name !== "" &&
          repoNameLegal(new_name) &&
          new_name.length <= 15
        ) {
          updateRepoName(new_name);
          setSelectedRepo(new_name);
        } else {
          if (!repoNameLegal(new_name)) {
            setAlert(9);
          } else if (new_name > 15) {
            setAlert(10);
          }
        }
      } else if (editing === 2) {
        // Finish editing task name

        console.log("Finished editing task name");
        const new_task_name = document.getElementById("selectedItem").value;
        if (new_task_name !== "" && new_task_name.length <= 15) {
          console.log(tasks);
          updateTask(editingItem, editingType, new_task_name);
        } else if (new_task_name > 15) {
          setAlertMessage("Task name should be less then 10 letters !");
          setAlert(1);
        }
      }

      // Reseting click detect
      if (editing !== 0 && editing !== 4 && editing !== 5 && editing !== 6) {
        setEditingItem(null);
        setEditingType(null);
        setDelRepoConfirm(0);
        setEditing(0);
      }
    }
  };

  return (
    <div
      style={{ marginTop: "3%", marginLeft: "12%", marginRight: "12%" }}
      onClick={() => changeEditingState()}
    >
      <LayoutContext.Provider
        value={{
          tasks,
          setTasks,
          repos,
          setRepos,
          tags,
          setTags,
          selectedRepo,
          setSelectedRepo,
          editing,
          setEditing,
          editingItem,
          setEditingItem,
          editingType,
          setEditingType,
          alert,
          setAlert,
          alertMessage,
          setAlertMessage,
          reRender,
          setReRender,
          delRepoConfirm,
          setDelRepoConfirm,
          due,
          setDue,
          focusing,
          setFocusing,
          updateTask,
        }}
      >
        <Navbar />

        <hr style={{ marginBottom: "3%" }} />

        <div style={{ display: "flex" }}>
          <SideBarL />
          {/* If loading repos or repos not found, show hint "Create repo", if repos exist, show hint "Select repo" */}
          {location.pathname === "/" && (
            <div className="contents">
              {selectedRepo === null && repos.length === 0 && (
                <div className="contentHint">Create a repo to start</div>
              )}
              {selectedRepo === null && repos.length !== 0 && (
                <div className="contentHint">Select a repo</div>
              )}
            </div>
          )}
          {/* If selected repo(path changed to contents) */}
          {(location.pathname === "/contents" ||
            location.pathname === "/tags") && <Outlet />}
        </div>
      </LayoutContext.Provider>

      {alert !== 0 && alert_message(alert)}

      <div onClick={resetLogStatus}>
        <NavLink to="/">
          <FaSignOutAlt className="signOutButton" />
        </NavLink>
      </div>
    </div>
  );
};

export default Layout;
