import React, { useContext, useState } from "react";

import "./LogIn.css";
import get_access_token from "../functions/request";
import { get_refresh_token } from "../functions/request";
import { AppContext } from "../../App";
import alert_message from "../functions/alert";
import { get_user_id } from "../functions/request";

const LogIn = () => {
  const [rememberUser, setRememberUser] = useState(false);
  let {
    userName,
    setUserName,
    userPassword,
    setUserPassword,
    setReRender,
    alert,
    setAlert,
    setUserId,
  } = useContext(AppContext);

  const userNameOnChange = (element) => {
    setUserName(element.target.value);
  };
  const userPasswordOnChange = (element) => {
    setUserPassword(element.target.value);
  };
  const rememberUserOnChange = () => {
    setRememberUser(!rememberUser);
  };

  const logIn = async () => {
    if (userName === "" || userPassword === "") {
      setAlert(6);
      return;
    }
    const result = await get_access_token(userName, userPassword);
    console.log(result);
    if (result === 0) {
      window.localStorage.setItem("isLogIn", 1);
      if (rememberUser) {
        await get_refresh_token(userName, userPassword);
      }

      const user_id = await get_user_id(userName);
      setUserId(user_id);

      setReRender((prevReRender) => prevReRender + 1);
    }
    setAlert(result);
  };

  return (
    <>
      <div className="logInPageInputHint">Username</div>
      <input
        type="text"
        className="logInPageInput"
        onChange={userNameOnChange}
      />

      <div className="logInPageInputHint">Password</div>
      <input
        type="password"
        className="logInPageInput"
        onChange={userPasswordOnChange}
      />

      <div style={{ padding: "1% 0 0 0 ", color: "#FFEAD2" }}>
        Remember me for a month:
        <input
          type="checkbox"
          className="logInPageCheckInput"
          onChange={rememberUserOnChange}
        />
      </div>

      <button className="logInPageSubmit" onClick={logIn}>
        Submit
      </button>

      {alert !== 0 && alert_message(alert)}
    </>
  );
};
export default LogIn;
