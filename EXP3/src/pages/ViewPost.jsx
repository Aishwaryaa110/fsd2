import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../utils/posts";

function ViewPost() {
  const navigate = useNavigate();
  const { id } = useParams();

  const posts = getPosts();

  const post = posts.find(
    (item) => item.id === Number(id)
  );

  if (!post) {
    return (
      <div className="form-page">
        <div className="view-card">
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

  return (
    <div className="form-page">
      <div className="view-card">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <h1>{post.title}</h1>

        <p className="post-meta">
          Created by {post.author}
        </p>

        <p className="post-full-content">
          {post.content}
        </p>

      </div>
    </div>
  );
}

export default ViewPost;