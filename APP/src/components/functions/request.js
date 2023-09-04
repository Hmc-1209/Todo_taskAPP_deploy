import axios from "axios";
const path = "http://122.116.20.182:8002";

const get_access_token = async (user_name, user_password) => {
  const formData = new FormData();
  formData.append("username", user_name);
  formData.append("password", user_password);

  try {
    const response = await axios.post(path + "/token/access_token", {
      formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
export default get_access_token;
