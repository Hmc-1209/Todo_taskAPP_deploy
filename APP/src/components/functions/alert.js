import "./functions.css";
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

    default:
      return <div></div>;
  }
};
export default alert_message;
