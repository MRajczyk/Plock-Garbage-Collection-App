import { useState } from "react";
// eslint-disable-next-line
import "react-quill-new/dist/quill.snow.css";
import Editor from "../components/Editor";

export default function TempEditorPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  async function createNewPost(ev) {
    ev.preventDefault();

    const resObj = {
      title: title,
      summary: summary,
      content: content,
    };
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      ></input>
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      ></input>
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "10px" }}>Create post</button>
    </form>
  );
}
