import React from "react";

const Title = ({ title }) => {
  return (
    <nav style={{ fontSize: "3vw", fontWeight: "bold", margin: "0" }}>
      {title}
    </nav>
  );
};

export default Title;
