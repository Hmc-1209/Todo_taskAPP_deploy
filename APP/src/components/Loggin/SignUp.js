import "./LogIn.css";

const SignUp = () => {
  return (
    <>
      <div className="logInPageInputHint">Username</div>
      <input type="text" className="logInPageInput" />
      <div className="logInPageInputHint">Password</div>
      <input type="password" className="logInPageInput" />
      <div className="logInPageInputHint">Confirm password</div>
      <input type="password" className="logInPageInput" />
      <button className="logInPageSubmit">Submit</button>
    </>
  );
};
export default SignUp;
