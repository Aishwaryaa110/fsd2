import { useState } from "react";
import "./App.css";

function App() {
  const [post, setPost] = useState("");
  const [platform, setPlatform] = useState("Twitter");
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  function saveDraft() {
    if (post.trim() === "") {
      alert("Please write something!");
      return;
    }

    if (editingId) {
      setDrafts(
        drafts.map((draft) =>
          draft.id === editingId
            ? { ...draft, platform, post }
            : draft
        )
      );
      setEditingId(null);
    } else {
      const newDraft = {
        id: Date.now(),
        platform: platform,
        post: post,
      };

      setDrafts([...drafts, newDraft]);
    }

    setPost("");
    setPlatform("Twitter");
  }

  function editDraft(draft) {
    setPlatform(draft.platform);
    setPost(draft.post);
    setEditingId(draft.id);
  }

  function deleteDraft(id) {
    setDrafts(drafts.filter((draft) => draft.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setPost("");
      setPlatform("Twitter");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setPost("");
    setPlatform("Twitter");
  }

  // Dashboard Counts
  const twitterCount = drafts.filter(
    (draft) => draft.platform === "Twitter"
  ).length;

  const linkedinCount = drafts.filter(
    (draft) => draft.platform === "LinkedIn"
  ).length;

  const instagramCount = drafts.filter(
    (draft) => draft.platform === "Instagram"
  ).length;

  const totalDrafts = drafts.length;

  return (
    <div className="container">
      <h1>🌐 Social Media Post Composer</h1>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="dashboard-card">
          <h3>🐦 Twitter</h3>
          <h2>{twitterCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>💼 LinkedIn</h3>
          <h2>{linkedinCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>📷 Instagram</h3>
          <h2>{instagramCount}</h2>
        </div>

        <div className="dashboard-card total">
          <h3>📄 Total Drafts</h3>
          <h2>{totalDrafts}</h2>
        </div>
      </div>

      <label>Select Platform</label>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option>Twitter</option>
        <option>LinkedIn</option>
        <option>Instagram</option>
      </select>

      <textarea
        rows="8"
        placeholder="Write your post here..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <p className="counter">
        Characters: <b>{post.length}</b>
      </p>

      <div className="composer-actions">
        <button onClick={saveDraft}>
          {editingId ? "💾 Update Draft" : "💾 Save Draft"}
        </button>

        {editingId && (
          <button className="btn-cancel" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <h2>📂 Saved Drafts</h2>

      {drafts.length === 0 ? (
        <p className="empty">No drafts available.</p>
      ) : (
        drafts.map((draft, index) => (
          <div className="card" key={draft.id}>
            <h3>📄 Draft {index + 1}</h3>

            <div className="platform">
              📱 {draft.platform}
            </div>

            <p className="draft-text">
              {draft.post}
            </p>

            <div className="card-actions">
              <button
                className="btn-edit"
                onClick={() => editDraft(draft)}
              >
                ✏️ Edit
              </button>

              <button
                className="btn-delete"
                onClick={() => deleteDraft(draft.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;