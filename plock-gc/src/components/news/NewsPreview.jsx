import React from "react";
import "./NewsPreview.css";

const NewsPreview = ({ id, title, summary, onClick, isUrgent }) => {
  console.log(isUrgent);
  return (
    <div
      className="news-preview"
      onClick={() => onClick(id)}
      style={isUrgent ? { borderColor: "red" } : { borderColor: "#443f36" }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: "bolder" }}>{title}</p>
        <span style={{ fontWeight: 500 }}>{summary}</span>
      </div>
    </div>
  );
};

export default NewsPreview;
