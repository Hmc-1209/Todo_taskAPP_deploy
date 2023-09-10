import React, { useContext } from "react";
import { LayoutContext } from "./Layout";

const Tags = () => {
  const { tags, editing, setEditing, selectedRepo, reRender, setReRender } =
    useContext(LayoutContext);

  const selectElement_addTag = () => {
    setEditing(6);
  };

  const setTag = () => {
    // const new_tag = document.getElementById("newTag").value;
    setEditing(0);
    // addTag(selectedRepo, new_tag);
    setReRender(reRender + 1);
  };

  return (
    <div className="tags">
      Comming soon
      {tags.map((tag) => (
        <div className="tag" key={tag}>
          {tag}
        </div>
      ))}
      {/* Add new tag */}
      {editing === 6 && (
        <input
          className="editingTag"
          autoFocus={true}
          size={5}
          maxLength={7}
          id={"newTag"}
        />
      )}
      {editing === 6 && <div className="back" onClick={() => setTag()} />}
      {/* {selectedRepo !== "BaseRepo" && (
        <button
          className="addTag"
          onClick={() => selectElement_addTag(selectedRepo)}
        >
          +
        </button>
      )} */}
    </div>
  );
};

export default Tags;
