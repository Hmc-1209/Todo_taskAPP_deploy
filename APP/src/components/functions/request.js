import axios from "axios";
const path = "http://122.116.20.182:8002";

const get_access_token = async (user_name, user_password) => {
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
      return true;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};
export default get_access_token;

export const get_refresh_token = async (user_name, user_password) => {
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
  try {
    const response = await axios.post(
      path + "/token/validate_access_token?token=" + access_token,
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
    } else {
      window.localStorage.setItem("access_token", null);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

export const validate_refresh_token = async (refresh_token) => {
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
    } else {
      window.localStorage.setItem("access_token", null);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};
