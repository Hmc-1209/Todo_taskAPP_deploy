import React from "react";
import { useContext } from "react";
import { AppContext } from "../../App";
import "./FirstVisit.css";
import alert_message from "../functions/alert";

const FirstVisit = () => {
  let { alert, setAlert } = useContext(AppContext);

  const finishReading = () => {
    if (document.getElementById("accept_check").checked === true) {
      window.localStorage.setItem("firstVisit", false);
      window.location.reload();
    } else setAlert(11);
  };

  return (
    <div className="FirstVisit center">
      <p className="title">ToDo Task App</p>
      <p className="content center">
        Welcome to this ToDo task App. This is a place where you can store your
        list of things to do. <br />
        Before we started, there are something I'd like you to know about:
      </p>

      <p className="subTitle">Terms of policy :</p>

      <div className="content">
        <p className="box">
          1. This web is deployed on Raspberry Pi, so if the server not response
          as fast as you might think, it's totally normal. <br />
          2. You'll have to first create a user, and log in with your username
          and password. Then you can create a repository to save your things to
          do. Different repositories are independent from each other, they hold
          different tasks that makes you able to seperate them.
          <br />
          3. Please maintain good customs. You'll be welcomed as long as you
          don't break the rules.
          <br />
        </p>
      </div>

      <p className="subTitle">Privacy policy :</p>

      <div className="content">
        <p className="box">
          1. Your password will be stored after hashed, but it is not hundred
          percent safe, so it is better you use a whole new password or the one
          that does not connet to sensetive datas. <br />
          2. The datas (except user password) are stored with plaintext, so just
          use it for saving life trivias.
          <br />
        </p>
      </div>

      <p className="subTitle">About this side project :</p>

      <div className="content">
        <p className="box">
          This is orginally a frontend React App (where you can find it{" "}
          <a href="https://github.com/Hmc-1209/Todo-taskAPP" className="box">
            here
          </a>
          ) uses localStorage to store all information locally, and is turned
          into fullstack project started from August 15, 2023. Now it is using a
          React app, a RestFul API, and mariaDB to store datas. Besides, it is
          maintained by Jenkins to automatic the deploy process. See more
          details on{" "}
          <a
            href="https://github.com/Hmc-1209/Todo_taskAPP_deploy"
            className="box"
          >
            this
          </a>{" "}
          GitHub page.
        </p>
      </div>

      <p className="subTitle">Contact me :</p>
      <div className="content">
        <p className="box">
          To report any bug or have problems to ask, you can contact me at this
          email address : dannyho1209@gmail.com. I'll be preciate to help.
        </p>
      </div>
      <div className="content center">
        <input type="checkbox" name="accept_check" id="accept_check" /> I accept
        the policy.
      </div>
      {alert !== 0 && alert_message(alert)}
      <button className="acceptButton" onClick={() => finishReading()}>
        Let's get started.
      </button>
    </div>
  );
};
export default FirstVisit;
