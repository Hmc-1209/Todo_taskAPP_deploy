import axios from "axios";
const path = "http://122.116.20.182:8002";

export const checkValidation = async () => {
  if (
    // If access_token avaliable
    window.localStorage.getItem("access_token") &&
    (await validate_access_token(
      window.localStorage.getItem("access_token")
    )) &&
    window.localStorage.getItem("isLogIn")
  ) {
    console.log("Validation Pass");
    return true;
  } else if (
    // If access_token is not avaliable but refresh_token avaliable
    window.localStorage.getItem("access_token") &&
    !(await validate_access_token(
      window.localStorage.getItem("access_token")
    )) &&
    window.localStorage.getItem("refresh_token") &&
    (await validate_refresh_token(
      window.localStorage.getItem("refresh_token")
    )) &&
    window.localStorage.getItem("isLogIn")
  ) {
    window.localStorage.setItem(
      "access_token",
      await get_new_access_token(window.localStorage.getItem("refresh_token"))
    );
    console.log("Creating new access token");
    return true;
  } else if (
    // If access_token is not avaliable and no refresh_token
    window.localStorage.getItem("access_token") &&
    !(await validate_access_token(
      window.localStorage.getItem("access_token")
    )) &&
    !window.localStorage.getItem("refresh_token") &&
    window.localStorage.getItem("isLogIn")
  ) {
    console.log("Failed");
    return false;
  } else if (
    // If access_token and refresh_token both not avaliable
    window.localStorage.getItem("access_token") &&
    !(await validate_access_token(
      window.localStorage.getItem("access_token")
    )) &&
    window.localStorage.getItem("refresh_token") &&
    !(await validate_refresh_token(
      window.localStorage.getItem("refresh_token")
    )) &&
    window.localStorage.getItem("isLogIn")
  ) {
    console.log("Both token failed");
    return false;
  }
  return false;
};

/* Request behaviors with access token and refresh token */
const get_access_token = async (user_name, user_password) => {
  // Get the access token for user to verify credential

  const formData = new FormData();
  formData.append("username", user_name);
  formData.append("password", user_password);

  try {
    const response = await axios.post(`${path}/token/access_token`, formData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 404;
      },
    });
    if (response.data.access_token) {
      window.localStorage.setItem("access_token", response.data.access_token);
      return 0;
    } else if (
      response.data.detail === "User with corresponding name does not exist." ||
      response.data.detail === "Password incorrect."
    ) {
      console.log(response.data.detail);
      return 1;
    }
  } catch (error) {
    console.log(error);
  }
  return 5;
};
export default get_access_token;

export const get_refresh_token = async (user_name, user_password) => {
  // Get the refresh token for user to regenerate access token

  const formData = new FormData();
  formData.append("username", user_name);
  formData.append("password", user_password);

  try {
    const response = await axios.post(`${path}/token/refresh_token`, formData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 404;
      },
    });
    if (response.data.refresh_token) {
      window.localStorage.setItem("refresh_token", response.data.refresh_token);
      return true;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

export const validate_access_token = async (
  access_token = window.localStorage.getItem("access_token")
) => {
  // Verify if the access token is not expired
  try {
    const response = await axios.post(
      `${path}/token/validate_access_token?token=${access_token}`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        },
      }
    );
    if (response.data.detail === "Token avaliable.") {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
    // console.log(error);
  }
  return false;
};

export const validate_refresh_token = async (
  refresh_token = window.localStorage.getItem("refresh_token")
) => {
  // Verify if the refresh token is not expired

  try {
    const response = await axios.post(
      `${path}/token/validate_refresh_token?token=${refresh_token}`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 403;
        },
      }
    );
    if (response.data.detail === "Token avaliable.") {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return false;
};

export const get_new_access_token = async (token) => {
  // Get the new access token using existed refresh token

  const formData = new FormData();
  formData.append("token", token);

  try {
    const response = await axios.post(
      `${path}/token/get_new_access_token?token=${token}`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

/* Request CRUD behaviors with user */
export const regist_new_user = async (
  user_name,
  user_password,
  user_password_confirm
) => {
  // Regist new user using given user_name and password
  const start_time = performance.now();
  if (user_password !== user_password_confirm) {
    return 3;
  }

  const body = {
    user_name: user_name,
    user_password: user_password,
    user_birthdate: "2000-01-01",
  };

  try {
    const response = await axios.post(
      `${path}/user/create`,
      JSON.stringify(body),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },

        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 400;
        },
      }
    );
    if (response.data.detail === "Success:Successfully created the user.") {
      console.log("Create user spent time:" + (performance.now() - start_time));
      return 4;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      if (error.response.data.detail === "The username has been registed.") {
        return 2;
      }
      console.log(error.response.data);
    }
  }
  return 5;
};

export const get_user_id = async (
  user_name,
  token = window.localStorage.getItem("access_token")
) => {
  // Get the user id using name, used when login

  try {
    const response = await axios.get(
      `${path}/user/name/{name}?user_name=${user_name}`,
      {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    console.log(response.data);
    if (response.data.user_id) {
      window.localStorage.setItem("user_id", response.data.user_id);
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return null;
};

/* Request CRUD behaviors with repository */
export const get_user_repos = async (
  user_id = window.localStorage.getItem("user_id"),
  token = window.localStorage.getItem("access_token")
) => {
  // Get all repos for particular user

  const start_time = performance.now();
  try {
    const response = await axios.get(
      `${path}/repository/id/{id}?user_id=${user_id}`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (Array.isArray(response.data)) {
      const end_time = performance.now();
      console.log("Get repos spent time:" + (end_time - start_time));
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return null;
};

export const create_user_repo = async (
  repo_name,
  user_id = window.localStorage.getItem("user_id"),
  token = window.localStorage.getItem("access_token")
) => {
  // Create new repo for user using default dummy repo name

  const start_time = performance.now();

  const body = {
    repo_name: repo_name,
    creator_id: parseInt(user_id),
  };

  console.log(body);

  try {
    const response = await axios.post(
      `${path}/repository/create`,
      JSON.stringify(body),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (
      response.data.detail === "Success:Successfully created new repository."
    ) {
      const end_time = performance.now();
      console.log("Create repo spent time:" + (end_time - start_time));
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return null;
};

export const update_user_repo = async (
  repo_id,
  repo_new_name,
  token = window.localStorage.getItem("access_token")
) => {
  // Update particular repo name

  const start_time = performance.now();

  const body = {
    repo_name: repo_new_name,
    repo_id: repo_id,
  };

  try {
    const response = await axios.put(
      `${path}/repository/update`,
      JSON.stringify(body),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (
      response.data.detail === "Success:Successfully updated the repository."
    ) {
      const end_time = performance.now();
      console.log("Update repo spent time:" + (end_time - start_time));
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return false;
};

export const delete_user_repo = async (
  repo_id,
  repo_name,
  token = window.localStorage.getItem("access_token")
) => {
  // Delete particular repo

  const start_time = performance.now();

  const body = {
    repo_name: repo_name,
    repo_id: repo_id,
  };

  try {
    const response = await axios.delete(`${path}/repository/delete`, {
      data: JSON.stringify(body),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 404;
      },
    });
    if (
      response.data.detail === "Success:Successfully deleted the repository."
    ) {
      const end_time = performance.now();
      console.log("Delete repo spent time:" + (end_time - start_time));
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return false;
};

/* Request CRUD behaviors with task */
export const get_repo_tasks = async (
  repo_id,
  token = window.localStorage.getItem("access_token")
) => {
  // Get the tasks in particular repo

  const start_time = performance.now();

  try {
    const response = await axios.get(
      `${path}/task/repo_id/{id}?repo_id=${repo_id}`,
      {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (Array.isArray(response.data)) {
      const end_time = performance.now();
      console.log("Get tasks spent time:" + (end_time - start_time));
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return null;
};

export const create_repo_task = async (
  creator_id,
  belongs_to_repository_id,
  token = window.localStorage.getItem("access_token")
) => {
  // Creating new task for particular repo

  const start_time = performance.now();
  const date = new Date();
  console.log(
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );

  const body = {
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
    belongs_to_repository_id: belongs_to_repository_id,
  };

  try {
    const response = await axios.post(
      `${path}/task/create`,
      JSON.stringify(body),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (response.data.detail === "Success:Successfully created new task.") {
      const end_time = performance.now();
      console.log("Create tasks spent time:" + (end_time - start_time));
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return null;
};

export const update_repo_task = async (
  task_name,
  task_description,
  task_due_date,
  task_finish,
  task_id,
  belongs_to_repository_id,
  creator_id,
  token = window.localStorage.getItem("access_token")
) => {
  // Update the selected task using given infos

  const start_time = performance.now();

  const body = {
    task_name: task_name,
    task_description: task_description,
    task_due_date: task_due_date,
    task_finish: task_finish,
    task_id: task_id,
    belongs_to_repository_id: belongs_to_repository_id,
    creator_id: creator_id,
  };

  try {
    const response = await axios.put(
      `${path}/task/update`,
      JSON.stringify(body),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );
    if (
      response.data.detail === "Success:Successfully updated selected task."
    ) {
      const end_time = performance.now();
      console.log("Update task spent time:" + (end_time - start_time));
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return false;
};

export const delete_repo_task = async (
  task_id,
  token = window.localStorage.getItem("access_token")
) => {
  // Delete specific task in repo

  const start_time = performance.now();

  const body = {
    task_id: task_id,
  };

  try {
    const response = await axios.delete(`${path}/task/delete`, {
      data: JSON.stringify(body),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 404;
      },
    });
    if (response.data.detail === "Success:Successfully deleted the task.") {
      const end_time = performance.now();
      console.log("Delete task spent time:" + (end_time - start_time));
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(error.response.data);
    }
  }
  return false;
};
