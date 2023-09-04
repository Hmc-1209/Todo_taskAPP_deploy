import { getNowDate } from "./date";

const get_task_index = (taskData) => {
  let id_index = 1;
  while (1) {
    // eslint-disable-next-line
    if (!taskData.find((task) => task.id === id_index)) break;
    id_index++;
  }
  return id_index;
};

/* Create base repo and task */
export const createBase = () => {
  // Setting default repo
  window.localStorage.setItem("repos", JSON.stringify(["BaseRepo"]));
  // Setting default task
  window.localStorage.setItem(
    "tasks",
    JSON.stringify([
      {
        repoName: "BaseRepo",
        tasks: [
          {
            taskName: "BaseTask",
            due: getNowDate(),
            tags: "none",
            notes: "This is a base repo due to not reading a null element",
            status: "This should nerver been used",
            id: 0,
          },
        ],
      },
    ])
  );
  // Setting default tag
  window.localStorage.setItem(
    "tags",
    JSON.stringify([{ repoName: "BaseRepo", tags: [] }])
  );
};

/* When delete a repo */
export const deleteRepo = (selectedRepo) => {
  let taskData = window.localStorage.getItem("tasks");
  // Get the deleted repo's index
  const selectedIndex = JSON.parse(taskData).findIndex(
    (element) => element.repoName === selectedRepo
  );
  taskData = taskData
    ? JSON.parse(taskData).filter(
        (element) => element.repoName !== selectedRepo
      )
    : [];
  let repoData = window.localStorage.getItem("repos");
  repoData = repoData
    ? JSON.parse(repoData).filter((element) => element !== selectedRepo)
    : [];
  window.localStorage.setItem("tasks", JSON.stringify(taskData));
  window.localStorage.setItem("repos", JSON.stringify(repoData));
  return selectedIndex;
};

/* When a repo name changed */
export const changeRepoName = (new_name, editingItem) => {
  // Change repos datas
  let repos_data = JSON.parse(window.localStorage.getItem("repos"));
  repos_data.splice(repos_data.indexOf(editingItem), 1, new_name);

  // Change tasks datas
  let tasks_data = JSON.parse(window.localStorage.getItem("tasks"));

  tasks_data.find((element) => element.repoName === editingItem).repoName =
    new_name;

  window.localStorage.setItem("repos", JSON.stringify(repos_data));
  window.localStorage.setItem("tasks", JSON.stringify(tasks_data));
};

/* When a repo was created, add the new repo object in tasks */
export const updateTasksOnCreate = (new_repo) => {
  // Update tasks
  let taskData = JSON.parse(window.localStorage.getItem("tasks"));
  window.localStorage.setItem(
    "tasks",
    JSON.stringify(
      taskData.concat({
        repoName: new_repo,
        tasks: [
          {
            taskName: "task1",
            due: getNowDate(),
            tags: "",
            notes: "",
            status: "unfinished",
            id: 0,
          },
        ],
      })
    )
  );
};

/* When a repo was created, add the new repo object in tags */
export const updateTagsOnCreate = (new_repo) => {
  // Update tags
  let taskData = JSON.parse(window.localStorage.getItem("tags"));
  window.localStorage.setItem(
    "tags",
    JSON.stringify(
      taskData.concat({
        repoName: new_repo,
        tags: [],
      })
    )
  );
};

/* When clicking the add task button, generate an empty task */
export const addEmptyTask = (selectedRepo) => {
  let Data = JSON.parse(window.localStorage.getItem("tasks"));
  let taskData = Data.find((repo) => repo.repoName === selectedRepo).tasks;

  Data.find((repo) => repo.repoName === selectedRepo).tasks = [
    {
      taskName: "Task",
      due: getNowDate(),
      tags: [],
      notes: "",
      status: "unfinished",
      id: get_task_index(taskData),
    },
  ].concat(taskData);

  window.localStorage.setItem("tasks", JSON.stringify(Data));
};

/* When a task name changed, adjust the corresponding taskName in tasks */
export const changeTaskName = (selectedRepo, task_id, new_task_name) => {
  let task_data = JSON.parse(window.localStorage.getItem("tasks"));
  task_data
    .filter((repo) => repo.repoName === selectedRepo)[0]
    .tasks.filter((task) => task.id === task_id)[0].taskName = new_task_name;
  window.localStorage.setItem("tasks", JSON.stringify(task_data));
};

/* Get task name for placeholder */
export const getTaskName = (selectedRepo, task_id) => {
  return JSON.parse(window.localStorage.getItem("tasks"))
    .find((repo) => repo.repoName === selectedRepo)
    .tasks.find((task) => task.id === task_id).taskName;
};

/* Get task note for textarea's default value */
export const getTaskNote = (selectedRepo, task_id) => {
  const data = window.localStorage.getItem("tasks");
  if (!data) return;
  return JSON.parse(data)
    .find((repo) => repo.repoName === selectedRepo)
    .tasks.find((task) => task.id === task_id).notes;
};

/* When a task note changed, adjust the corresponding note in tasks */
export const changeTaskNote = (selectedRepo, task_id, new_task_note) => {
  let task_data = window.localStorage.getItem("tasks");
  if (!task_data) return;
  task_data = JSON.parse(task_data);
  task_data
    .filter((repo) => repo.repoName === selectedRepo)[0]
    .tasks.filter((task) => task.id === task_id)[0].notes = new_task_note;
  window.localStorage.setItem("tasks", JSON.stringify(task_data));
};

/* Delete a task */
export const delTask = (selectedRepo, task_id) => {
  let task_data = JSON.parse(window.localStorage.getItem("tasks"));

  const del_task = task_data
    .filter((repo) => repo.repoName === selectedRepo)[0]
    .tasks.filter((task) => task.id !== task_id);

  task_data.filter((repo) => repo.repoName === selectedRepo)[0].tasks =
    del_task;

  window.localStorage.setItem("tasks", JSON.stringify(task_data));
};

/* Read the due time for date picker */
export const readDue = (selectedRepo, task_id) => {
  let task_data = JSON.parse(window.localStorage.getItem("tasks"));

  const task_due = task_data
    .filter((repo) => repo.repoName === selectedRepo)[0]
    .tasks.filter((task) => task.id === task_id)[0].due;
  return task_due;
};

/* Set the due time for particular task */
export const setDue = (selectedRepo, task_id, year, month, day) => {
  const newDate = year + "/" + month + "/" + day;
  let task_data = JSON.parse(window.localStorage.getItem("tasks"));

  task_data
    .filter((repo) => repo.repoName === selectedRepo)[0]
    .tasks.filter((task) => task.id === task_id)[0].due = newDate;

  window.localStorage.setItem("tasks", JSON.stringify(task_data));
};

export const addTag = (selectedRepo, newTag) => {
  // let data = window.localStorage.getItem("tags");
  if (newTag) {
    console.log(selectedRepo, newTag);
  }
};
