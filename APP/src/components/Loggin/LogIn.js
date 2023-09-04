import React, { useContext, useState } from "react";

import "./LogIn.css";
import get_access_token from "../functions/request";
import { get_refresh_token } from "../functions/request";
import { AppContext } from "../../App";

const LogIn = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [rememberUser, setRememberUser] = useState(false);

  let { setIsLogIn } = useContext(AppContext);

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
    if (await get_access_token(userName, userPassword)) {
      setIsLogIn(1);
    }
    if (rememberUser) {
      await get_refresh_token(userName, userPassword);
    }
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
    </>
  );
};
export default LogIn;
