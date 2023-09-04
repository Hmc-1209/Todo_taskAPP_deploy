import React, { useState } from "react";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

const LogInPage = () => {
  const [mode, setMode] = useState(1);

  // let { isLogIn, setIsLogIn } = useContext(AppContext);

  const selectMode = (selectedMode) => {
    if (selectedMode === mode) {
      return " modeSelected";
    }
    return "";
  };

  const changeMode = (selectNewMode) => {
    setMode(selectNewMode);
    return;
  };

  return (
    <div className="LogIn">
      <div className="logInTitle">ToDo</div>

      <div className="selectLogInMode">
        <div
          className={"LogInMode" + selectMode(1)}
          onClick={() => changeMode(1)}
        >
          Log In
        </div>
        <div
          className={"SignUpMode" + selectMode(2)}
          onClick={() => changeMode(2)}
        >
          Sign Up
        </div>
      </div>

      {mode === 1 && <LogIn />}
      {mode === 2 && <SignUp />}
    </div>
  );
};
export default LogInPage;
