import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPosts, savePosts } from "../utils/posts";

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();

  const posts = getPosts();

  const post = posts.find(
    (item) => item.id === Number(id)
  );

  const [title, setTitle] = useState(
    post ? post.title : ""
  );

  const [content, setContent] = useState(
    post ? post.content : ""
  );

  if (!post) {
    return (
      <div className="form-page">
        <div className="form-card">
          <h1>Post Not Found</h1>

          <button
            className="primary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const updatePost = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content.");
      return;
    }

    const updatedPosts = posts.map((item) =>
      item.id === Number(id)
        ? {
            ...item,
            title: title.trim(),
            content: content.trim(),
          }
        : item
    );

    savePosts(updatedPosts);

    alert("Post updated successfully!");

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

        <h1>Edit Post</h1>

        <p className="form-subtitle">
          Update your post
        </p>

        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Content</label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="primary-button"
          onClick={updatePost}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default EditPost;