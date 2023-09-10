import React, { useContext, useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import TaskDatePicker from "./common/TaskDatePicker";

// Context
import { LayoutContext } from "./Layout";
import { AppContext, signOut } from "../App";
import {
  checkValidation,
  get_repo_tasks,
  create_repo_task,
  delete_user_repo,
  delete_repo_task,
} from "./functions/request";
import { NavLink } from "react-router-dom";

// Move circus
const moveCaretAtEnd = (e) => {
  var temp_value = e.target.value;
  e.target.value = "";
  e.target.value = temp_value;
};

const Contents = () => {
  const [hoverTask, setHoverTask] = useState(0);

  // Context
  let { taskIsLoading, setTaskIsLoading } = useContext(AppContext);
  let {
    tasks,
    setTasks,
    repos,
    setRepos,
    selectedRepo,
    setSelectedRepo,
    editing,
    setEditing,
    editingItem,
    setEditingItem,
    editingType,
    setEditingType,
    delRepoConfirm,
    setDelRepoConfirm,
    setDue,
    setFocusing,
    setAlert,
    updateTask,
  } = useContext(LayoutContext);

  const task_finish = (task_finish) => {
    // Checking the status of tasks

    return task_finish === 1 ? " finished" : "";
  };

  const addTask = async (creator_id) => {
    // Add task for repo. If failed, roll back.

    const repo_id = repos.find(
      (repo) => repo.repo_name === selectedRepo
    ).repo_id;

    const now_tasks = tasks;
    const old_tasks = now_tasks;

    const date = new Date();
    const new_task = {
      task_name: "NewTask",
      task_description: "Enter description here.",
      task_due_date:
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0"),
      task_finish: 0,
      creator_id: creator_id,
      belongs_to_repository_id: repo_id,
    };
    setTasks([...tasks, new_task]);

    const result = await create_repo_task(parseInt(creator_id), repo_id);

    if (!result) {
      setTasks(old_tasks);
      setAlert(8);
    } else {
      const new_tasks = await get_repo_tasks(repo_id);
      setTasks(new_tasks);
    }
  };

  const getTaskInfo = (task_id, task_info_type) => {
    // Get specific info from specific task

    return tasks.find((task) => task.task_id === task_id)[task_info_type];
  };

  const delTask = async (task_id) => {
    // Delete specific task

    let now_tasks = [...tasks];
    const old_value = [...tasks];

    now_tasks = now_tasks.filter((task) => task.task_id !== task_id);
    setTasks(now_tasks);

    const result = await delete_repo_task(task_id);

    if (!result) {
      console.log("Delete task rollback");
      setTasks(old_value);
      setAlert(8);
      if (!(await checkValidation())) {
        signOut();
      }
      return;
    }
  };

  const delRepo = async () => {
    // On delete particular repo

    if (repos.length !== 0) {
      let now_repos = [...repos];
      const old_value = [...repos];
      const old_repo_name = selectedRepo;
      const selectedIndex = repos.findIndex(
        (repo) => repo.repo_name === selectedRepo
      );
      const repo_id = repos.find(
        (repo) => repo.repo_name === selectedRepo
      ).repo_id;
      console.log(now_repos);

      now_repos = now_repos.filter((repo) => repo.repo_id !== repo_id);
      setRepos(now_repos);

      setSelectedRepo(
        repos.length === 0
          ? null
          : repos.length === 1
          ? repos[0].repo_name
          : repos[selectedIndex - 1]
          ? repos[selectedIndex - 1].repo_name
          : repos[selectedIndex + 1].repo_name
      );
      if (selectedRepo !== null) {
        setTaskIsLoading(true);
      } else setTasks([]);

      const deleteTaskPromises = tasks.map((task) => delTask(task.task_id));

      // Wait for all tasks to be deleted
      try {
        await Promise.all(deleteTaskPromises);
      } catch (error) {
        // Handle any errors here
        console.error("Error deleting tasks:", error);
        // You might want to decide what to do in case of errors, e.g., rollback
      }
      const result = await delete_user_repo(repo_id, old_repo_name);

      if (!result) {
        console.log("Delete repo rollback");
        setRepos(old_value);
        setSelectedRepo(old_repo_name);
        setAlert(8);
        if (!(await checkValidation())) {
          signOut();
        }
        return;
      }
      setDelRepoConfirm(0);
    }
  };
  const delConfirm = () => {
    // Confirm the deletion of repo

    if (delRepoConfirm) {
      delRepo();
    } else {
      setEditing(3);
      setEditingType("delRepo");
      setDelRepoConfirm(1);
    }
  };

  const selectElement_repos = () => {
    // Selected repo name for editing

    setEditing(1);
    setEditingItem(selectedRepo);
    setEditingType("repos");
  };

  const selectElement_task_name = (task_id) => {
    // Selected task id for editing task_name

    setEditing(2);
    setEditingItem(task_id);
    setEditingType("task_name");
  };

  const selectElement_task_note = (task_id) => {
    // Selected task id for editing task_note

    setEditing(4);
    setEditingItem(task_id);
    setEditingType("task_note");
  };

  const selectElement_task_due = (task_id) => {
    // Selected task id for editing task_due

    let due = tasks.find((task) => task.task_id === task_id).task_due_date;
    due = due.split("-");
    setEditing(5);
    setDue([parseInt(due[0], 10), parseInt(due[1], 10), parseInt(due[2], 10)]);
    setEditingItem(task_id);
    setEditingType("task_due");
    setFocusing(1);
  };

  const closeDatePicker = () => {
    // Stop editing date picker

    setEditingItem(null);
    setEditingType(null);
    setEditing(0);
    setFocusing(0);
  };

  const finishedEditingTaskNote = () => {
    // Finish editing task note

    const description = document.getElementById("selectedItem").value;

    updateTask(editingItem, "task_description", description);
    setEditingItem(null);
    setEditingType(null);
    setEditing(0);
    setFocusing(0);
  };

  if (selectedRepo === null) {
    // Automatic redirect to home if no repo is selected

    window.location.href = "/";
  }

  useEffect(() => {
    // If need to get tasks from repo

    if (taskIsLoading === false) return;
    if (repos.length === 0) {
      setTaskIsLoading(false);
      setSelectedRepo(null);
      return;
    }
    const fetchData = async () => {
      if (taskIsLoading === true && repos.length !== 0) {
        const tasks = await get_repo_tasks(
          repos.find((repo) => repo.repo_name === selectedRepo).repo_id
        );
        setTasks(tasks);
        setTaskIsLoading(false);
      }
    };

    if (async () => await checkValidation()) {
      fetchData();
    }
    //eslint-disable-next-line
  }, [taskIsLoading, selectedRepo]);

  return (
    <div className="contents">
      <>
        {/* Title */}
        {editingType !== "repos" && editingItem !== selectedRepo ? (
          <div
            className="repoName"
            onClick={() => selectElement_repos()}
            key={Date.now()}
          >
            {selectedRepo}
          </div>
        ) : (
          <input
            className="repoRename"
            autoFocus={true}
            placeholder={selectedRepo}
            id={"selectedItem"}
            key={"selectedItem"}
          />
        )}

        {/* Functional */}
        <div className="contentRepoFunctional">
          <button
            className="addTaskBtn"
            onClick={() => addTask(window.localStorage.getItem("user_id"))}
          >
            +
          </button>

          <>
            <button className="deleteBtn" onClick={delConfirm}>
              <FaTrash className="trashIcon" />
            </button>
            {delRepoConfirm ? (
              <NavLink to="/">
                <button className="delConfirm" onClick={delRepo}>
                  !
                </button>
              </NavLink>
            ) : (
              <></>
            )}
          </>
        </div>

        {/* Tasks */}
        {taskIsLoading === true && (
          <p
            style={{
              color: "#FFEAD2",
              paddingLeft: "3%",
              backgroundColor: "#a4b3de",
            }}
          >
            Loading...
          </p>
        )}
        {taskIsLoading === false &&
          tasks !== null &&
          tasks.map((task) => (
            <div
              className={"task" + task_finish(task.task_finish)}
              key={task.task_id}
              onMouseEnter={() => setHoverTask(task.task_id)}
              onMouseLeave={() => setHoverTask(0)}
            >
              {/* Mark finish buttom */}
              <input
                type="checkbox"
                className={"markFinishBtn" + task_finish(task.task_finish)}
                onChange={async () =>
                  await updateTask(
                    task.task_id,
                    "task_finish",
                    task.task_finish === 1 ? 0 : 1
                  )
                }
                checked={task.task_finish === 1 ? true : false}
                key={Date.now()}
              />

              {/* Task info include name and due date */}
              <div className={"taskInfo" + task_finish(task.task_finish)}>
                {editingItem !== task.task_id || editingType !== "task_name" ? (
                  <div
                    onClick={() => selectElement_task_name(task.task_id)}
                    style={{ paddingBottom: "2%" }}
                    className={task_finish(task.task_finish)}
                  >
                    {task.task_name}
                  </div>
                ) : (
                  <input
                    className={"taskRename " + task_finish(task.task_finish)}
                    id={"selectedItem"}
                    autoFocus={true}
                    placeholder={getTaskInfo(task.task_id, "task_name")}
                    style={{ paddingBottom: "2%" }}
                  />
                )}

                <hr style={{ width: "90%" }} />
                <br />
                <div
                  className={task_finish(task.task_finish)}
                  onClick={() => selectElement_task_due(task.task_id)}
                >
                  {task.task_due_date}
                </div>
                {editingType === "task_due" && editingItem === task.task_id && (
                  <div>
                    <div className="back" onClick={() => closeDatePicker()} />
                    <TaskDatePicker />
                  </div>
                )}
              </div>

              {/* Task note */}
              {editingItem !== task.task_id || editingType !== "task_note" ? (
                <div
                  className={"taskNote" + task_finish(task.task_finish)}
                  onClick={() => selectElement_task_note(task.task_id)}
                >
                  {task.task_description}
                </div>
              ) : (
                <textarea
                  className={"taskChangeNote" + task_finish(task.task_finish)}
                  autoFocus={true}
                  onFocus={moveCaretAtEnd}
                  id="selectedItem"
                  spellCheck={false}
                  defaultValue={getTaskInfo(task.task_id, "task_description")}
                />
              )}
              {editing === 4 && (
                <div
                  className="back"
                  onClick={() => finishedEditingTaskNote()}
                />
              )}

              {/* Del task button */}
              <div
                className={
                  hoverTask === task.task_id ? "delTaskBtn_hover" : "delTaskBtn"
                }
                onClick={() => {
                  if (editing === 0) {
                    delTask(task.task_id);
                  }
                }}
              />
            </div>
          ))}
      </>
    </div>
  );
};

export default Contents;
