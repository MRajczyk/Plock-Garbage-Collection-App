"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export default function Home() {
  const [title, setTitle] = useState(""); // State for the title
  const [summary, setSummary] = useState(""); // State for the summary (Szczegóły)
  const [content, setContent] = useState(""); // State for the content (Quill Editor)
  const [isUrgent, setIsUrgent] = useState(false); // State for the urgent checkbox

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],
      ["code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    // Validate input
    if (!title || !summary || !content) {
      alert("Title, summary, and content cannot be empty");
      return;
    }

    // Insert data into Supabase
    const { error } = await supabase
      .from("wiadomosci") // Your table name
      .insert([{ title, summary, content, is_urgent: isUrgent }]);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Error saving data");
    } else {
      alert("Data saved successfully!");
      setTitle(""); // Clear the title
      setSummary(""); // Clear the summary
      setContent(""); // Clear the content
      setIsUrgent(false); // Reset the checkbox
    }
  };

  return (
    <main>
      <div className="h-screen w-screen flex flex-col items-center">
        <div className="w-full flex justify-between items-center p-4">
          <div></div>
          <div className="text-center">Panel administratorski</div>
          <div>
            <button className="text-red-500 hover:underline">Wyloguj</button>
          </div>
        </div>

        <div className="mb-10 flex flex-col items-center">
          <span className="text-2xl text-center">
            Nowa wiadomość do mieszkańców
          </span>
        </div>

        {/* Input for Title */}
        <div className="w-[90vw] mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tytuł wiadomości"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Input for Summary (Szczegóły) */}
        <div className="w-[90vw] mb-4">
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Szczegóły"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Checkbox for Urgent Message */}
        <div className="w-[90vw] flex items-center mb-4">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            id="urgentCheckbox"
            className="mr-2"
          />
          <label htmlFor="urgentCheckbox">Wiadomość pilna</label>
        </div>

        {/* Quill Editor for Content */}
        <div className="h-full w-[90vw]">
          <QuillEditor
            value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            className="w-full h-[400px]"
            style={{ backgroundColor: "white" }}
          />
        </div>

        {/* Submit Button */}
        <div className="w-[90vw] flex justify-end mb-[140px] mr-10">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 text-white py-2 px-10 rounded hover:bg-orange-600"
          >
            Wyślij
          </button>
        </div>
      </div>
    </main>
  );
}
