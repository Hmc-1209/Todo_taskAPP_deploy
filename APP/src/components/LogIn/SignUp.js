import { useState, useContext } from "react";
import "./LogIn.css";
import { AppContext } from "../../App";
import { regist_new_user } from "../functions/request";
import alert_message from "../functions/alert";

const SignUp = () => {
  const [confirmUserPassword, setConfirmUserPassword] = useState("");
  let {
    userName,
    setUserName,
    userPassword,
    setUserPassword,
    setMode,
    alert,
    setAlert,
  } = useContext(AppContext);

  const userNameOnChange = (element) => {
    setUserName(element.target.value);
  };
  const userPasswordOnChange = (element) => {
    setUserPassword(element.target.value);
  };
  const confirmUserPasswordOnChenge = (element) => {
    setConfirmUserPassword(element.target.value);
  };

  const regist_user = async () => {
    if (userName === "" || userPassword === "" || confirmUserPassword === "") {
      setAlert(6);
      return;
    }
    const result = await regist_new_user(
      userName,
      userPassword,
      confirmUserPassword
    );
    setAlert(result);
    if (result === 4) {
      setMode(1);
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

      <div className="logInPageInputHint">Confirm password</div>
      <input
        type="password"
        className="logInPageInput"
        onChange={confirmUserPasswordOnChenge}
      />

      <button className="logInPageSubmit" onClick={regist_user}>
        Submit
      </button>

      {alert !== 0 && alert_message(alert)}
    </>
  );
};
export default SignUp;
