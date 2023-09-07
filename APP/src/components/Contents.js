import React, { useContext, useState } from "react";
import { FaTrash } from "react-icons/fa";
import TaskDatePicker from "./common/TaskDatePicker";

// Context
import { LayoutContext, setNote } from "./Layout";
import {
  addEmptyTask,
  delTask,
  deleteRepo,
  getTaskName,
  getTaskNote,
  readDue,
} from "./functions/localStorageCRUD";
import { AppContext } from "../App";

// Move circus
const moveCaretAtEnd = (e) => {
  var temp_value = e.target.value;
  e.target.value = "";
  e.target.value = temp_value;
};

const Contents = () => {
  const [hoverTask, setHoverTask] = useState(0);

  // Context
  let { taskIsLoading } = useContext(AppContext);
  let {
    tasks,
    repos,
    selectedRepo,
    setSelectedRepo,
    editing,
    setEditing,
    editingItem,
    setEditingItem,
    editingType,
    setEditingType,
    reRender,
    setReRender,
    delRepoConfirm,
    setDelRepoConfirm,
    setDue,
    setFocusing,
  } = useContext(LayoutContext);

  // const updateTask = async () => {
  //   // Update local variable using given task_info_type, with task_value, then set the update info to database. If failed, roll back local variable.
  // };

  // Checking the status of tasks
  const task_finish = (task_finish) => {
    return task_finish === 1 ? " finished" : "";
  };
  const checked = (task_finish) => {
    return task_finish === 1 ? true : false;
  };

  const addTask = (selectedRepo) => {
    addEmptyTask(selectedRepo);
    setReRender(reRender + 1);
  };

  // On delete particular repo
  const delRepo = () => {
    if (repos.length !== 1) {
      const selectedIndex = deleteRepo(selectedRepo);
      // Select the base repo if no repos left, else if deleting the first repo, select the second, else if deleting the only repo, select the base one
      setSelectedRepo(
        selectedRepo === repos[1]
          ? repos.length === 2
            ? JSON.parse(window.localStorage.getItem("repos"))[0]
            : JSON.parse(window.localStorage.getItem("repos"))[1]
          : JSON.parse(window.localStorage.getItem("repos"))[selectedIndex - 1]
      );
      setDelRepoConfirm(0);
    }
  };
  const delConfirm = () => {
    if (delRepoConfirm) {
      delRepo();
    } else {
      setEditing(3);
      setEditingType("delRepo");
      setDelRepoConfirm(1);
    }
  };

  const switchStatus = (task_id) => {
    let task_data = JSON.parse(window.localStorage.getItem("tasks"));
    const now_status = task_data
      .filter((repo) => repo.repoName === selectedRepo)[0]
      .tasks.filter((task) => task.id === task_id)[0].status;
    task_data
      .filter((repo) => repo.repoName === selectedRepo)[0]
      .tasks.filter((task) => task.id === task_id)[0].status =
      now_status === "finished" ? "unfinished" : "finished";
    if (now_status) {
      window.localStorage.setItem("tasks", JSON.stringify(task_data));
      setReRender(reRender + 1);
    }
  };

  // Selected repo name for editing
  const selectElement_repos = (name) => {
    setEditing(1);
    setEditingItem(name);
    setEditingType("repos");
  };

  // Selected task id for editing task_name
  const selectElement_task_name = (task_id) => {
    setEditing(2);
    setEditingItem(task_id);
    setEditingType("task:name");
  };

  // Selected task id for editing task_note
  const selectElement_task_note = (task_id) => {
    setEditing(4);
    setEditingItem(task_id);
    setEditingType("task:note");
  };

  // Selected task id for editing task_due
  const selectElement_task_due = (task_id) => {
    let due = readDue(selectedRepo, task_id);
    due = due.split("/");
    setEditing(5);
    setDue([parseInt(due[0], 10), parseInt(due[1], 10), parseInt(due[2], 10)]);
    setEditingItem(task_id);
    setEditingType("task:due");
    setFocusing(1);
  };

  // Stop editing date picker
  const closeDatePicker = () => {
    setEditingItem(null);
    setEditingType(null);
    setEditing(0);
    setFocusing(0);
    setReRender(reRender + 1);
  };

  // Stop editing task note
  const stopEditingTaskNote = () => {
    setNote(selectedRepo, editingItem);
    setEditingItem(null);
    setEditingType(null);
    setEditing(0);
    setFocusing(0);
    setReRender(reRender + 1);
  };

  if (selectedRepo === null) {
    window.location.href = "/";
  }

  return (
    <div className="contents">
      <>
        {/* Title */}
        {editingItem !== selectedRepo ? (
          <div
            className="repoName"
            onClick={() => selectElement_repos(selectedRepo)}
          >
            {selectedRepo}
          </div>
        ) : (
          <input
            className="repoRename"
            autoFocus={true}
            placeholder={selectedRepo}
            id={"selectedItem"}
          />
        )}

        {/* Functional */}
        <div className="contentRepoFunctional">
          <button className="addTaskBtn" onClick={() => addTask(selectedRepo)}>
            +
          </button>

          {repos.length !== 1 && (
            <>
              <button className="deleteBtn" onClick={delConfirm}>
                <FaTrash className="trashIcon" />
              </button>
              {delRepoConfirm ? (
                <button className="delConfirm" onClick={delRepo}>
                  !
                </button>
              ) : (
                <></>
              )}
            </>
          )}
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
                onChange={() => switchStatus(task.task_id)}
                checked={checked(task.task_finish)}
              />

              {/* Task info include name and due date */}
              <div className={"taskInfo" + task_finish(task.task_id)}>
                {editingItem !== task.task_id || editingType !== "task:name" ? (
                  <div
                    onClick={() => selectElement_task_name(task.task_id)}
                    style={{ paddingBottom: "2%" }}
                    className={task_finish(task.task_finish)}
                  >
                    {task.task_name}
                  </div>
                ) : (
                  <input
                    className={"taskRename" + task_finish(task.task_finish)}
                    id={"selectedItem"}
                    autoFocus={true}
                    placeholder={getTaskName(selectedRepo, task.task_id)}
                    style={{ paddingBottom: "2%" }}
                  />
                )}
                <hr style={{ width: "90%" }} />
                <br />
                <div
                  className={task_finish(task.task_finish)}
                  onClick={() => selectElement_task_due(task.id)}
                >
                  {task.task_due_date}
                </div>
                {editingType === "task:due" && editingItem === task.task_id && (
                  <div>
                    <div className="back" onClick={() => closeDatePicker()} />
                    <TaskDatePicker />
                  </div>
                )}
              </div>

              {/* Task note */}
              {editingItem !== task.task_id || editingType !== "task:note" ? (
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
                  defaultValue={getTaskNote(selectedRepo, task.task_id)}
                />
              )}
              {editing === 4 && (
                <div className="back" onClick={() => stopEditingTaskNote()} />
              )}

              {/* Del task button */}
              <div
                className={
                  hoverTask === task.task_id ? "delTaskBtn_hover" : "delTaskBtn"
                }
                onClick={() => {
                  if (editing === 0) {
                    delTask(selectedRepo, task.task_id);
                    setReRender(reRender + 1);
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
