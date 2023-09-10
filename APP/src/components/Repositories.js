import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Context
import { LayoutContext, getRepos } from "./Layout";
import { AppContext, resetLogStatus } from "../App";
import { create_user_repo } from "./functions/request";

const Repositories = () => {
  const [createRepoCooldown, setCreateRepoCooldown] = useState(false);

  const { repos, selectedRepo, setSelectedRepo, setRepos, setAlert } =
    useContext(LayoutContext);
  const { repoIsLoading, setTaskIsLoading } = useContext(AppContext);

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
    const new_repo_name = repo_name();
    const new_repo = { repo_name: new_repo_name };
    const old_value = [...repos];
    const now_repos = [...repos, new_repo];
    setRepos(now_repos);
    setCreateRepoCooldown(true);

    const result = await create_user_repo(new_repo_name);
    if (!result) {
      console.log("Create repo roll back.");
      setRepos(old_value);
      setAlert(8);
    } else {
      const new_repos = await getRepos();
      setRepos(new_repos);
      if (new_repos === null) {
        resetLogStatus();
      }
    }
  };

  // Check if the repository has been selected
  const repoClass = (repo) => {
    return repo.repo_name === selectedRepo ? "repo selectedRepo" : "repo";
  };

  useEffect(() => {
    if (createRepoCooldown) {
      const timer = setTimeout(() => {
        setCreateRepoCooldown(false);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [createRepoCooldown]);

  // Set the selected repository
  const selectRepo = async (repo) => {
    if (repo.target.innerText === selectedRepo) return;
    const selected_repo = repos.find(
      (repo_e) => repo_e.repo_name === repo.target.innerText
    );
    setSelectedRepo(selected_repo.repo_name);
    setTaskIsLoading(true);
  };

  return (
    <>
      {repoIsLoading ? (
        <p style={{ color: "#FFEAD2", paddingLeft: "3%" }}>Loading...</p>
      ) : (
        <>
          {Array.isArray(repos) &&
            repos.map((repo) =>
              !repo.repo_id ? (
                <div style={{ textDecoration: "None" }} key={repo.repo_name}>
                  <div className={repoClass(repo)} style={{ color: "#D9B300" }}>
                    {repo.repo_name}
                  </div>
                </div>
              ) : (
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
              )
            )}
          {!createRepoCooldown && (
            <button className="addRepo" onClick={createRepo}>
              +
            </button>
          )}
        </>
      )}
    </>
  );
};

export default Repositories;
