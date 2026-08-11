
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { permissions } from "../utils/roles";
import { getPosts, savePosts } from "../utils/posts";

import PostCard from "../components/PostCard";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Guest";
  const role = localStorage.getItem("role") || "viewer";

  const userPermissions = permissions[role] || [];

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const logout = () => {
    // Remove ONLY login information
    // Do NOT delete posts
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/");
  };

  const deletePost = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    const updatedPosts = posts.filter(
      (post) => post.id !== id
    );

    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, <strong>{username}</strong>
          </p>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>


      {/* USER INFORMATION */}

      <div className="user-card">

        <div>
          <span className="label">
            Signed in as
          </span>

          <h2>{username}</h2>
        </div>

        <div>
          <span className="label">
            Role
          </span>

          <span className="role">
            {role}
          </span>
        </div>

      </div>


      {/* POSTS SECTION */}

      <section className="posts-section">

        <div className="posts-heading">

          <div>
            <h2>Posts</h2>

            <p>
              Create, read and manage your content
            </p>
          </div>

          {/* CREATE */}

          {userPermissions.includes("create") && (
            <button
              className="create-button"
              onClick={() => navigate("/create")}
            >
              + Create Post
            </button>
          )}

        </div>


        {/* POST LIST */}

        <div className="posts-list">

          {posts.length === 0 ? (

            <div className="empty-state">

              <h3>No posts available</h3>

              <p>
                Create your first post.
              </p>

            </div>

          ) : (

            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                permissions={userPermissions}
                onDelete={deletePost}
              />
            ))

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;