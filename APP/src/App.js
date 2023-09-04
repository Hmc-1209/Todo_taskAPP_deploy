import React, { useState, createContext } from "react";
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
} from "./components/functions/request";
export const AppContext = createContext(null);

function App() {
  const [isLogIn, setIsLogIn] = useState(0);

  const loggedIn = async () => {
    if (
      // If first visit website
      !window.localStorage.getItem("access_token") &&
      !window.localStorage.getItem("refresh_token") &&
      isLogIn
    ) {
      setIsLogIn(0);
    } else if (
      // If access_token avaliable
      window.localStorage.getItem("access_token") &&
      (await validate_access_token(
        window.localStorage.getItem("access_token")
      )) &&
      !isLogIn
    ) {
      setIsLogIn(1);
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
    }
    return false;
  };

  loggedIn();

  return (
    <AppContext.Provider value={{ isLogIn, setIsLogIn }}>
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
