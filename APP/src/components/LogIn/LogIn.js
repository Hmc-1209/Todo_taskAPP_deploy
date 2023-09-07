import React, { useContext } from "react";

import "../css/LogIn.css";
import get_access_token from "../functions/request";
import { get_refresh_token } from "../functions/request";
import { AppContext } from "../../App";
import alert_message from "../functions/alert";
import { get_user_id } from "../functions/request";

const LogIn = () => {
  let { setReRender, alert, setAlert, setUserId } = useContext(AppContext);

  const logIn = async () => {
    const userName = document.getElementById("Username").value;
    const userPassword = document.getElementById("Password").value;
    const rememberUser = document.getElementById("RememberMe").checked;
    if (userName === "" || userPassword === "") {
      setAlert(6);
      return;
    }
    setAlert(7);
    const result = await get_access_token(userName, userPassword);
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      logIn();
    }
  };

  return (
    <>
      <div className="logInPageInputHint">Username</div>
      <input
        type="text"
        className="logInPageInput"
        onKeyDown={handleKeyPress}
        id={"Username"}
      />

      <div className="logInPageInputHint">Password</div>
      <input
        type="password"
        className="logInPageInput"
        onKeyDown={handleKeyPress}
        id={"Password"}
      />

      <div style={{ padding: "1% 0 0 0 ", color: "#FFEAD2" }}>
        Remember me for a month:
        <input
          type="checkbox"
          className="logInPageCheckInput"
          id={"RememberMe"}
        />
      </div>

      <div onClick={logIn}>
        <button className="logInPageSubmit">Submit</button>
      </div>

      {alert !== 0 && alert_message(alert)}
    </>
  );
};
export default LogIn;
