import React, { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";

// Components
import SideBarL from "./SidebarL";
import Navbar from "./Navbar";
import {
  changeRepoName,
  changeTaskName,
  createBase,
  changeTaskNote,
} from "./functions/localStorageCRUD";

export const LayoutContext = createContext(null);

// Updating repos datas
const getRepos = () => {
  // If no repos
  if (!window.localStorage.getItem("repos")) {
    createBase();
  }
  const data = window.localStorage.getItem("repos");
  return JSON.parse(data);
};

// Updating tsaks datas
const getTasks = (repo) => {
  const data = window.localStorage.getItem("tasks");
  if (!data) {
    return [];
  } else {
    return JSON.parse(data).find((element) => element.repoName === repo).tasks;
  }
};

// Updating tags datas
const getTags = (repo) => {
  const data = window.localStorage.getItem("tags");
  if (!data) {
    return [];
  } else {
    return JSON.parse(data).find((element) => element.repoName === repo).tags;
  }
};

// Check if the repo name is legal
const repoNameLegal = (new_name) => {
  let name = JSON.parse(window.localStorage.getItem("repos"));
  return name.find((name) => name === new_name) ? 0 : 1;
};

export const setNote = (selectedRepo, editingItem) => {
  const new_task_note = document.getElementById("selectedItem").value;
  changeTaskNote(selectedRepo, editingItem, new_task_note);
};

const Layout = () => {
  const [repos, setRepos] = useState(getRepos());
  const [selectedRepo, setSelectedRepo] = useState(repos[0]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [editing, setEditing] = useState(-1);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [reRender, setReRender] = useState(0);
  const [alert, setAlert] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [delRepoConfirm, setDelRepoConfirm] = useState(0);
  const [due, setDue] = useState([-1, -1, -1]);
  const [focusing, setFocusing] = useState(0);

  useEffect(() => {
    setTasks(getTasks(selectedRepo));
    setRepos(getRepos(selectedRepo));
    setTags(getTags(selectedRepo));
    setDelRepoConfirm(0);
  }, [selectedRepo, reRender]);

  useEffect(() => {
    setTimeout(() => {
      setAlert(0);
      setAlertMessage(null);
    }, 2000);
  }, [alert]);

  // On change (finished editing)
  const changeEditingState = () => {
    // Default first click
    if (editing === -1) setEditing(0);
    // If finish editing
    else {
      if (editing === 1) {
        const new_name = document.getElementById("selectedItem").value;
        if (
          new_name !== "" &&
          repoNameLegal(new_name) &&
          new_name.length <= 15
        ) {
          changeRepoName(new_name, editingItem);
          setSelectedRepo(new_name);
        } else {
          if (!repoNameLegal(new_name)) {
            setAlertMessage("Repository name repeated !");
            setAlert(1);
          } else if (new_name > 15) {
            setAlertMessage("Repository name should be less then 15 letters !");
            setAlert(1);
          }
        }
      } else if (editing === 2) {
        const new_task_name = document.getElementById("selectedItem").value;
        if (new_task_name !== "" && new_task_name.length <= 10) {
          changeTaskName(selectedRepo, editingItem, new_task_name);
        } else if (new_task_name > 10) {
          setAlertMessage("Task name should be less then 10 letters !");
          setAlert(1);
        }
      }

      // Reseting click detect
      if (editing !== 0 && editing !== 4 && editing !== 5 && editing !== 6) {
        setReRender(reRender + 1);
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
        }}
      >
        <Navbar />

        <hr style={{ marginBottom: "3%" }} />

        <div style={{ display: "flex" }}>
          <SideBarL />
          <Outlet />
        </div>
      </LayoutContext.Provider>

      {alert !== 0 && (
        <div className="alert">
          <div className="error">
            <FaExclamationCircle className="exclamationIcon" />
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
