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
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
  }
};
export default get_access_token;
