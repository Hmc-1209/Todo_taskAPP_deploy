import axios from "axios";
const path = "http://122.116.20.182:8002";

const get_access_token = async (user_name, user_password) => {
  // Get the access token for user to verify credential

  const formData = new FormData();
  formData.append("username", user_name);
  formData.append("password", user_password);

  try {
    const response = await axios.post(path + "/token/access_token", formData, {
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
    const response = await axios.post(path + "/token/refresh_token", formData, {
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

export const validate_access_token = async (access_token) => {
  // Verify if the access token is not expired

  try {
    const response = await axios.post(
      path + "/token/validate_access_token?token=" + access_token,
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

export const validate_refresh_token = async (refresh_token) => {
  // Verify if the refresh token is not expired

  try {
    const response = await axios.post(
      path + "/token/validate_refresh_token?token=" + refresh_token,
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
      path + "/token/get_new_access_token?token=" + token,
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

export const regist_new_user = async (
  user_name,
  user_password,
  user_password_confirm
) => {
  // Regist new user using given user_name and password

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
      path + "/user/create",
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
