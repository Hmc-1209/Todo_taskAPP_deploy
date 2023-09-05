import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Components */
import Contents from "./components/Contents";
import Tags from "./components/Tag";
import Layout from "./components/Layout";
import Home from "./components/Home";
import LogInPage from "./components/Loggin/LogInPage";
import {
  validate_access_token,
  validate_refresh_token,
  get_new_access_token,
} from "./components/functions/request";
export const AppContext = createContext(null);

const resetLogStatus = () => {
  window.localStorage.setItem("access_token", null);
  window.localStorage.setItem("refresh_token", null);
  window.localStorage.setItem("isLogIn", 0);
};

function App() {
  let isLogIn = window.localStorage.getItem("isLogIn") === "1";
  const [reRender, setReRender] = useState(0);
  const [alert, setAlert] = useState(0);
  const [mode, setMode] = useState(1);

  const loggedIn = async () => {
    if (
      // If first visit website
      !window.localStorage.getItem("access_token") &&
      !window.localStorage.getItem("refresh_token") &&
      !isLogIn
    ) {
      resetLogStatus();
      setReRender((prevReRender) => prevReRender + 1);
    } else if (
      // If access_token avaliable
      window.localStorage.getItem("access_token") &&
      (await validate_access_token(
        window.localStorage.getItem("access_token")
      )) &&
      !isLogIn
    ) {
      window.localStorage.setItem("isLogIn", 1);
      setReRender((prevReRender) => prevReRender + 1);
    } else if (
      // If access_token is not avaliable but refresh_token avaliable
      window.localStorage.getItem("access_token") &&
      !(await validate_access_token(
        window.localStorage.getItem("access_token")
      )) &&
      window.localStorage.getItem("refresh_token") &&
      (await validate_refresh_token(
        window.localStorage.getItem("refresh_token")
      )) &&
      isLogIn
    ) {
      window.localStorage.setItem(
        "access_token",
        await get_new_access_token(window.localStorage.getItem("refresh_token"))
      );
      setReRender((prevReRender) => prevReRender + 1);
    } else if (
      // If access_token is not avaliable and no refresh_token
      window.localStorage.getItem("access_token") &&
      !(await validate_access_token(
        window.localStorage.getItem("access_token")
      )) &&
      !window.localStorage.getItem("refresh_token") &&
      isLogIn
    ) {
      resetLogStatus();
      setReRender((prevReRender) => prevReRender + 1);
    } else if (
      // If access_token and refresh_token both not avaliable
      window.localStorage.getItem("access_token") &&
      !(await validate_access_token(
        window.localStorage.getItem("access_token")
      )) &&
      window.localStorage.getItem("refresh_token") &&
      !(await validate_refresh_token(
        window.localStorage.getItem("refresh_token")
      )) &&
      isLogIn
    ) {
      resetLogStatus();
      setReRender((prevReRender) => prevReRender + 1);
    }
  };
  mode === 1 && loggedIn();

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
      }, 2000);
    }
  }, [alert]);

  return (
    <AppContext.Provider
      value={{ reRender, setReRender, alert, setAlert, mode, setMode }}
    >
      <BrowserRouter>
        <Routes>
          {!isLogIn && <Route path="/" element={<LogInPage />}></Route>}
          {/* Routes */}
          {isLogIn && (
            <Route path="/" element={<Layout />}>
              <Route path="contents" element={<Contents />} />
              <Route path="tags" element={<Tags />} />
              <Route index element={<Home />}></Route>
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
