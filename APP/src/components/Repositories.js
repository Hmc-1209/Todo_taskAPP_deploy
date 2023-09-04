import React, { useContext, useEffect } from "react";

// Context
import { LayoutContext } from "./Layout";
import {
  updateTagsOnCreate,
  updateTasksOnCreate,
} from "./functions/localStorageCRUD";

const Repositories = () => {
  const { repos, setRepos, selectedRepo, setSelectedRepo } =
    useContext(LayoutContext);

  // Get the repo name for new repo, find the empty index
  const repo_name = () => {
    let index = 1,
      i = 0;
    while (true) {
      if (i === repos.length) {
        break;
      }
      if (repos[i] === "Repo" + index) {
        i = 0;
        index++;
      } else {
        i++;
      }
    }
    return "Repo" + index;
  };

  // Create a new repository
  const createRepo = () => {
    const new_repo = repo_name();
    const data = repos.concat(new_repo);
    setRepos(data);
    updateTasksOnCreate(new_repo);
    updateTagsOnCreate(new_repo);
  };
  useEffect(() => {
    window.localStorage.setItem("repos", JSON.stringify(repos));
  }, [repos]);

  // Check if the repository has been selected
  const repoClass = (repo) => {
    return repo === selectedRepo ? "repo selectedRepo" : "repo";
  };

  // Set the selected repository
  const selectRepo = (repo) => {
    setSelectedRepo(repo.target.outerText);
  };

  return (
    <>
      {repos
        .filter((repo) => repo !== "BaseRepo")
        .map((repo) => (
          <div
            className={repoClass(repo)}
            onClick={(repo) => selectRepo(repo)}
            key={repo}
          >
            {repo}
          </div>
        ))}
      <button className="addRepo" onClick={createRepo}>
        +
      </button>
    </>
  );
};

export default Repositories;
