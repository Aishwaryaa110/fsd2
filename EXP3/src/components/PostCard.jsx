import { useNavigate } from "react-router-dom";

function PostCard({ post, permissions, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="post-card">

      <div className="post-info">

        <h3>{post.title}</h3>

        <p>{post.content}</p>

        <small>
          Created by {post.author}
        </small>

      </div>

      <div className="post-actions">

        {permissions.includes("read") && (
          <button
            className="read-btn"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            Read
          </button>
        )}

        {permissions.includes("edit") && (
          <button
            className="edit-btn"
            onClick={() => navigate(`/posts/${post.id}/edit`)}
          >
            Edit
          </button>
        )}

        {permissions.includes("delete") && (
          <button
            className="delete-btn"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </button>
        )}

      </div>

    </div>
  );
}

export default PostCard;