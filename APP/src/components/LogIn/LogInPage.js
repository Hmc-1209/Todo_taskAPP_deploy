import React, { useContext } from "react";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { AppContext } from "../../App";

const LogInPage = () => {
  // let { isLogIn, setIsLogIn } = useContext(AppContext);

  let { mode, setMode, setAlert } = useContext(AppContext);

  const selectMode = (selectedMode) => {
    if (selectedMode === mode) {
      return " modeSelected";
    }
    return "";
  };

  const changeMode = (selectNewMode) => {
    setMode(selectNewMode);
    setAlert(0);
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
