import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const platforms = {
  twitter: {
    name: "Twitter / X",
    limit: 280,
  },
  linkedin: {
    name: "LinkedIn",
    limit: 3000,
  },
  instagram: {
    name: "Instagram",
    limit: 2200,
  },
};

/* Strategy Pattern: platform-specific validation */
const validationStrategies = {
  twitter: (text) => {
    if (text.trim().length === 0) {
      return "Post content cannot be empty.";
    }

    if (text.length > platforms.twitter.limit) {
      return `Twitter / X posts cannot exceed ${platforms.twitter.limit} characters.`;
    }

    return "";
  },

  linkedin: (text) => {
    if (text.trim().length === 0) {
      return "Post content cannot be empty.";
    }

    if (text.length > platforms.linkedin.limit) {
      return `LinkedIn posts cannot exceed ${platforms.linkedin.limit} characters.`;
    }

    return "";
  },

  instagram: (text) => {
    if (text.trim().length === 0) {
      return "Post content cannot be empty.";
    }

    if (text.length > platforms.instagram.limit) {
      return `Instagram captions cannot exceed ${platforms.instagram.limit} characters.`;
    }

    return "";
  },
};

/* Mock API */
const saveDraftMockAPI = (draft) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (draft.content.trim()) {
        resolve({
          success: true,
          message: "Draft saved successfully.",
        });
      } else {
        reject({
          message: "Invalid draft data.",
        });
      }
    }, 1000);
  });
};

/* Retry logic */
const retryRequest = async (requestFunction, retries = 2) => {
  try {
    return await requestFunction();
  } catch (error) {
    if (retries > 0) {
      return retryRequest(requestFunction, retries - 1);
    }

    throw error;
  }
};

function App() {
  const [platform, setPlatform] = useState("twitter");
  const [content, setContent] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Load drafts from localStorage */
  useEffect(() => {
    const storedDrafts = localStorage.getItem("postDrafts");

    if (storedDrafts) {
      setDrafts(JSON.parse(storedDrafts));
    }
  }, []);

  /* Save drafts to localStorage */
  useEffect(() => {
    localStorage.setItem("postDrafts", JSON.stringify(drafts));
  }, [drafts]);

  const currentPlatform = platforms[platform];

  /* Select correct validation strategy */
  const validateContent = () => {
    const strategy = validationStrategies[platform];
    return strategy(content);
  };

  /* Real-time validation */
  useEffect(() => {
    const validationError = validateContent();
    setError(validationError);
  }, [content, platform]);

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
    setContent("");
    setEditingId(null);
    setError("");
  };

  const handleSaveDraft = async () => {
    const validationError = validateContent();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError("");

    const draft = {
      id: editingId || Date.now(),
      platform,
      content,
      createdAt: new Date().toLocaleString(),
    };

    try {
      await retryRequest(() => saveDraftMockAPI(draft));

      if (editingId) {
        setDrafts((previousDrafts) =>
          previousDrafts.map((item) =>
            item.id === editingId ? draft : item
          )
        );

        toast.success("Draft updated successfully.");
      } else {
        setDrafts((previousDrafts) => [
          ...previousDrafts,
          draft,
        ]);

        toast.success("Draft saved successfully.");
      }

      setContent("");
      setEditingId(null);
      setError("");
    } catch (error) {
      setError("Failed to save draft.");
      toast.error("Failed to save draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDraft = (draft) => {
    setPlatform(draft.platform);
    setContent(draft.content);
    setEditingId(draft.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteDraft = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this draft?"
    );

    if (!confirmDelete) {
      return;
    }

    setDrafts((previousDrafts) =>
      previousDrafts.filter((draft) => draft.id !== id)
    );

    toast.success("Draft deleted.");
  };

  const handleClear = () => {
    setContent("");
    setEditingId(null);
    setError("");
  };

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>Post Composer</h1>
          <p>
            Multi-platform content creation and draft management
          </p>
        </div>

        <div className="experiment-badge">
          Experiment 1
        </div>
      </header>

      <main className="container">

        <section className="card">

          <div className="card-header">
            <div>
              <h2>
                {editingId ? "Edit Draft" : "Create New Post"}
              </h2>

              <p>
                Select a platform and compose your content.
              </p>
            </div>
          </div>

          <label htmlFor="platform">
            Select Platform
          </label>

          <select
            id="platform"
            value={platform}
            onChange={handlePlatformChange}
          >
            {Object.entries(platforms).map(
              ([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              )
            )}
          </select>

          <label htmlFor="content">
            Post Content
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder={`Write your ${currentPlatform.name} post here...`}
          />

          <div className="counter-row">
            <span>Character Count</span>

            <span
              className={
                content.length > currentPlatform.limit
                  ? "counter danger"
                  : "counter"
              }
            >
              {content.length} / {currentPlatform.limit}
            </span>
          </div>

          {error && (
            <div className="error-message">
              ⚠ {error}
            </div>
          )}

          {!error && content.trim() && (
            <div className="valid-message">
              ✓ Content is valid for {currentPlatform.name}
            </div>
          )}

          <div className="button-row">

            <button
              className="primary-button"
              onClick={handleSaveDraft}
              disabled={
                loading ||
                !!error ||
                !content.trim()
              }
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Draft"
                : "Save Draft"}
            </button>

            <button
              className="secondary-button"
              onClick={handleClear}
            >
              Clear
            </button>

          </div>

        </section>

        <section className="info-card">

          <h3>Platform Rules</h3>

          <div className="platform-grid">

            {Object.entries(platforms).map(
              ([key, value]) => (
                <div
                  key={key}
                  className={
                    platform === key
                      ? "platform-box active"
                      : "platform-box"
                  }
                >
                  <strong>{value.name}</strong>

                  <span>
                    {value.limit} characters
                  </span>
                </div>
              )
            )}

          </div>

        </section>

        <section className="card">

          <div className="draft-header">

            <div>
              <h2>Draft Management</h2>

              <p>
                Saved drafts are stored using browser localStorage.
              </p>
            </div>

            <div className="draft-count">
              {drafts.length} Draft
              {drafts.length !== 1 ? "s" : ""}
            </div>

          </div>

          {drafts.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">📝</div>

              <h3>No drafts yet</h3>

              <p>
                Create your first post and save it as a draft.
              </p>
            </div>

          ) : (

            <div className="draft-list">

              {drafts
                .slice()
                .reverse()
                .map((draft) => (

                  <div
                    className="draft-item"
                    key={draft.id}
                  >

                    <div className="draft-content">

                      <div className="draft-top">

                        <span className="platform-tag">
                          {platforms[draft.platform].name}
                        </span>

                        <span className="draft-date">
                          {draft.createdAt}
                        </span>

                      </div>

                      <p>{draft.content}</p>

                      <small>
                        {draft.content.length} characters
                      </small>

                    </div>

                    <div className="draft-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEditDraft(draft)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteDraft(draft.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

        <section className="concept-card">

          <h2>Concepts Implemented</h2>

          <div className="concept-grid">

            <div>
              <strong>Controlled Components</strong>
              <p>
                React state controls form inputs.
              </p>
            </div>

            <div>
              <strong>React Hooks</strong>
              <p>
                useState and useEffect manage state and side effects.
              </p>
            </div>

            <div>
              <strong>Strategy Pattern</strong>
              <p>
                Platform-specific validation is selected dynamically.
              </p>
            </div>

            <div>
              <strong>Local Storage</strong>
              <p>
                Drafts persist after refreshing the browser.
              </p>
            </div>

            <div>
              <strong>Mock API</strong>
              <p>
                Asynchronous draft saving is simulated.
              </p>
            </div>

            <div>
              <strong>Retry Logic</strong>
              <p>
                Failed mock requests can be retried.
              </p>
            </div>

          </div>

        </section>

      </main>

      <ToastContainer
        position="top-right"
        autoClose={2500}
      />

    </div>
  );
}

export default App;