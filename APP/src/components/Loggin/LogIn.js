import React, { useState } from "react";

import "./LogIn.css";
import get_access_token from "../functions/request";

const LogIn = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const userNameOnChange = (element) => {
    setUserName(element.target.value);
  };
  const userPasswordOnChange = (element) => {
    setUserPassword(element.target.value);
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

      <button
        className="logInPageSubmit"
        onClick={async () => await get_access_token(userName, userPassword)}
      >
        Submit
      </button>
    </>
  );
};
export default LogIn;
