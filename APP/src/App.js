import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Components */
import Contents from "./components/Contents";
import Tags from "./components/Tag";
import Layout from "./components/Layout";
import Home from "./components/Home";
import LogInPage from "./components/Loggin/LogInPage";

const loggedIn = () => {
  if (
    !window.localStorage.getItem("access_token") &&
    window.localStorage.getItem("refresh_token")
  ) {
  }
  return false;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogInPage />}></Route>
        {/* Routes */}
        {loggedIn() && (
          <Route path="/" element={<Layout />}>
            <Route path="contents" element={<Contents />} />
            <Route path="tags" element={<Tags />} />
            <Route index element={<Home />}></Route>
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
