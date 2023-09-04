import React, { useContext, useState } from "react";
import { FaTrash } from "react-icons/fa";
import TaskDatePicker from "./common/TaskDatePicker";

// Context
import { AppContext, setNote } from "./Layout";
import {
  addEmptyTask,
  delTask,
  deleteRepo,
  getTaskName,
  getTaskNote,
  readDue,
} from "./functions/localStorageCRUD";

// Move circus
const moveCaretAtEnd = (e) => {
  var temp_value = e.target.value;
  e.target.value = "";
  e.target.value = temp_value;
};

const Contents = () => {
  const [hoverTask, setHoverTask] = useState(0);

  // Context
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
  } = useContext(AppContext);

  // Checking the status of tasks
  const task_finish = (task_id) => {
    let finish_status = JSON.parse(window.localStorage.getItem("tasks"))
      .filter((repo) => repo.repoName === selectedRepo)[0]
      .tasks.filter((task) => task.id === task_id)[0];
    if (finish_status) finish_status = finish_status.status;
    else return "";
    return finish_status === "finished" ? " finished" : "";
  };
  const checked = (task_id) => {
    let finish_status = JSON.parse(window.localStorage.getItem("tasks"))
      .filter((repo) => repo.repoName === selectedRepo)[0]
      .tasks.filter((task) => task.id === task_id)[0];
    if (finish_status) finish_status = finish_status.status;
    else return "";
    return finish_status === "finished" ? true : false;
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

  return (
    <div className="contents">
      {selectedRepo === "BaseRepo" && repos.length === 1 && (
        <div className="contentHint">Create a repo to start</div>
      )}
      {selectedRepo === "BaseRepo" && repos.length !== 1 && (
        <div className="contentHint">Select a repo</div>
      )}
      {selectedRepo !== "BaseRepo" && (
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
            <button
              className="addTaskBtn"
              onClick={() => addTask(selectedRepo)}
            >
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
          {tasks
            .filter((task) => task.id !== 0)
            .map((task) => (
              <div
                className={"task" + task_finish(task.id)}
                key={task.id}
                onMouseEnter={() => setHoverTask(task.id)}
                onMouseLeave={() => setHoverTask(0)}
              >
                {/* Mark finish buttom */}
                <input
                  type="checkbox"
                  className={"markFinishBtn" + task_finish(task.id)}
                  onChange={() => switchStatus(task.id)}
                  checked={checked(task.id)}
                />

                {/* Task info include name and due date */}
                <div className={"taskInfo" + task_finish(task.id)}>
                  {editingItem !== task.id || editingType !== "task:name" ? (
                    <div
                      onClick={() => selectElement_task_name(task.id)}
                      style={{ paddingBottom: "2%" }}
                      className={task_finish(task.id)}
                    >
                      {task.taskName}
                    </div>
                  ) : (
                    <input
                      className={"taskRename" + task_finish(task.id)}
                      id={"selectedItem"}
                      autoFocus={true}
                      placeholder={getTaskName(selectedRepo, task.id)}
                      style={{ paddingBottom: "2%" }}
                    />
                  )}
                  <hr style={{ width: "90%" }} />
                  <br />
                  <div
                    className={task_finish(task.id)}
                    onClick={() => selectElement_task_due(task.id)}
                  >
                    {task.due}
                  </div>
                  {editingType === "task:due" && editingItem === task.id && (
                    <div>
                      <div className="back" onClick={() => closeDatePicker()} />
                      <TaskDatePicker />
                    </div>
                  )}
                </div>

                {/* Task note */}
                {editingItem !== task.id || editingType !== "task:note" ? (
                  <div
                    className={"taskNote" + task_finish(task.id)}
                    onClick={() => selectElement_task_note(task.id)}
                  >
                    {task.notes}
                  </div>
                ) : (
                  <textarea
                    className={"taskChangeNote" + task_finish(task.id)}
                    autoFocus={true}
                    onFocus={moveCaretAtEnd}
                    id="selectedItem"
                    spellCheck={false}
                    defaultValue={getTaskNote(selectedRepo, task.id)}
                  />
                )}
                {editing === 4 && (
                  <div className="back" onClick={() => stopEditingTaskNote()} />
                )}

                {/* Del task button */}
                <div
                  className={
                    hoverTask === task.id ? "delTaskBtn_hover" : "delTaskBtn"
                  }
                  onClick={() => {
                    if (editing === 0) {
                      delTask(selectedRepo, task.id);
                      setReRender(reRender + 1);
                    }
                  }}
                />
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Contents;
