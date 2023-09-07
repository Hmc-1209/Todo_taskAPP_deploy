import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

// Context
import { LayoutContext, getRepos } from "./Layout";
import { AppContext, resetLogStatus, signOut } from "../App";
import {
  checkValidation,
  create_user_repo,
  get_repo_tasks,
} from "./functions/request";

const Repositories = () => {
  const { repos, selectedRepo, setSelectedRepo, setRepos, setTasks } =
    useContext(LayoutContext);
  const { repoIsLoading, setReRender, setTaskIsLoading } =
    useContext(AppContext);

  // Get the repo name for new repo, find the empty index
  const repo_name = () => {
    let index = 1,
      i = 0;
    while (true) {
      if (i === repos.length) {
        break;
      }
      if (repos[i].repo_name === "NewRepo" + index) {
        i = 0;
        index++;
      } else {
        i++;
      }
    }
    return "NewRepo" + index;
  };

  // Create a new repository
  const createRepo = async () => {
    const new_repo = repo_name();
    await create_user_repo(new_repo);
    const new_repos = await getRepos();
    console.log(new_repos);
    if (new_repos === null) {
      resetLogStatus();
      setReRender((prevReRender) => prevReRender + 1);
    }
    setRepos(new_repos);
  };

  // Check if the repository has been selected
  const repoClass = (repo) => {
    return repo.repo_name === selectedRepo ? "repo selectedRepo" : "repo";
  };

  // Set the selected repository
  const selectRepo = async (repo) => {
    const selected_repo = repos.find(
      (repo_e) => repo_e.repo_name === repo.target.innerText
    );
    setSelectedRepo(selected_repo.repo_name);

    const get_tasks_from_repo = async () => {
      const tasks = await get_repo_tasks(selected_repo.repo_id);
      setTasks(tasks);
      setTaskIsLoading(false);
    };

    setTaskIsLoading(true);
    if (await checkValidation()) get_tasks_from_repo();
    else {
      signOut();
      setReRender((prevReRender) => prevReRender + 1);
    }
  };

  return (
    <>
      {repoIsLoading ? (
        <p style={{ color: "#FFEAD2", paddingLeft: "3%" }}>Loading...</p>
      ) : (
        <>
          {Array.isArray(repos) &&
            repos.map((repo) => (
              <NavLink
                to="/contents"
                style={{ textDecoration: "None" }}
                key={repo.repo_name}
              >
                <div
                  className={repoClass(repo)}
                  onClick={(repo) => selectRepo(repo)}
                >
                  {repo.repo_name}
                </div>
              </NavLink>
            ))}
          <button className="addRepo" onClick={createRepo}>
            +
          </button>
        </>
      )}
    </>
  );
};

export default Repositories;
