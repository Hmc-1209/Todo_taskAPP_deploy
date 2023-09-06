import React, { useContext, useEffect } from "react";

// Context
import { LayoutContext, getRepos } from "./Layout";
import { AppContext, resetLogStatus } from "../App";
import { create_user_repo } from "./functions/request";

const Repositories = () => {
  const { repos, selectedRepo, setSelectedRepo, setRepos } =
    useContext(LayoutContext);
  const { repoIsLoading, setReRender } = useContext(AppContext);

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
  useEffect(() => {
    console.log(repos);
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
      {repoIsLoading ? (
        <p style={{ color: "#FFEAD2", paddingLeft: "3%" }}>Loading...</p>
      ) : (
        <>
          {Array.isArray(repos) &&
            repos.map((repo) => (
              <div
                className={repoClass(repo)}
                onClick={(repo) => selectRepo(repo)}
                key={repo.repo_name}
              >
                {repo.repo_name}
              </div>
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
