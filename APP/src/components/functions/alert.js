import "../css/functions.css";
import { FaExclamationCircle } from "react-icons/fa";

const alert_message = (alert) => {
  switch (alert) {
    case 1:
      return (
        <div className="alertMessageShort red">
          Username or password incorrect.
        </div>
      );

    case 2:
      return (
        <div className="alertMessageShort red">
          The username has been registed.
        </div>
      );

    case 3:
      return (
        <div className="alertMessageShort red">
          Enter the same password to confirm.
        </div>
      );

    case 4:
      return <div className="alertMessageShort green">Sign up success!</div>;

    case 5:
      return (
        <div className="alertMessageShort red">
          Failed to connect with server!
        </div>
      );

    case 6:
      return (
        <div className="alertMessageShort red">No empty value is accepted!</div>
      );

    case 7:
      return <div className="alertMessageShort green">Loging...</div>;

    case 8:
      return (
        <div className="alert">
          <div className="error">
            <FaExclamationCircle className="exclamationIcon" />
            Action failed due to connection or server error.
          </div>
        </div>
      );

    case 9:
      return (
        <div className="alert">
          <div className="error">
            <FaExclamationCircle className="exclamationIcon" />
            Repository name repeated !
          </div>
        </div>
      );

    case 10:
      return (
        <div className="alert">
          <div className="error">
            <FaExclamationCircle className="exclamationIcon" />
            Repository name should be less then 15 letters !
          </div>
        </div>
      );

    case 11:
      return (
        <div
          className="alertMessageShort red content center"
          style={{ padding: "0%" }}
        >
          You have to accept the policy to continue!
        </div>
      );

    default:
      return <div></div>;
  }
};
export default alert_message;
