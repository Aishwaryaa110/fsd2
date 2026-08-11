import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts, savePosts } from "../utils/posts";

function CreatePost() {
  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "Unknown";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content.");
      return;
    }

    const posts = getPosts();

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      author: username,
    };

    savePosts([...posts, newPost]);

    navigate("/dashboard");
  };

  return (
    <div className="form-page">

      <div className="form-card">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <h1>Create Post</h1>

        <p className="form-subtitle">
          Create a new post
        </p>

        <label>Title</label>

        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Content</label>

        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="primary-button"
          onClick={createPost}
        >
          Create Post
        </button>

      </div>

    </div>
  );
}

export default CreatePost;