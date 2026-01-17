import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function ResearcherProjects({ refreshTrigger }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // project being edited
  const [saving, setSaving] = useState(false);

  const fetchMy = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects/mine");
      setProjects(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Could not load your projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMy();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleProjectCreated = () => fetchMy();
    window.addEventListener("projectCreated", handleProjectCreated);
    return () => {
      window.removeEventListener("projectCreated", handleProjectCreated);
    };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      const serverMsg = err?.response?.data?.message;
      const status = err?.response?.status;
      alert(
        serverMsg
          ? `Could not delete project: ${serverMsg} (status ${status})`
          : `Could not delete project: ${err.message}`
      );
    }
  };

  const handleEdit = async (proj) => {
    // open edit modal with project data
    setEditing({ ...proj });
  };

  const handleSave = async (updated) => {
    setSaving(true);
    try {
      const payload = {
        title: updated.title,
        abstract: updated.abstract,
        trl: Number(updated.trl),
        ipStatus: updated.ipStatus,
        fundingRequired: Number(updated.fundingRequired || 0),
        sector: updated.sector,
        location: updated.location,
      };
      await API.put(`/projects/${updated._id}`, payload);
      // update locally
      setProjects((prev) =>
        prev.map((p) => (p._id === updated._id ? { ...p, ...payload } : p))
      );
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not update project");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => setEditing(null);

  if (loading) return <p>Loading your projects...</p>;
  if (!projects.length)
    return (
      <div className="researcher-section">
        <h3>Your Projects</h3>
        <p className="muted">You haven't created any projects yet.</p>
      </div>
    );

  return (
    <div className="researcher-section">
      <h3>Your Projects</h3>
      <div className="project-grid">
        {projects.map((p) => (
          <div key={p._id} className="project-card">
            <div className="project-card-media">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt="thumb" />
              ) : (
                <div className="placeholder-img" />
              )}
            </div>
            <div className="project-card-body">
              <h4 className="project-title">{p.title}</h4>
              <div className="project-meta">
                TRL {p.trl} · {p.ipStatus || "IP: -"}
              </div>
              <p className="project-desc line-clamp-3">{p.abstract}</p>
              <div className="project-actions">
                <button className="btn-secondary" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-form">
              <div className="modal-form-header">
                <h3>Edit Project</h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCancelEdit}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(editing);
                }}
              >
                <div className="form-row">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">Abstract</label>
                  <textarea
                    className="form-textarea"
                    value={editing.abstract}
                    onChange={(e) =>
                      setEditing({ ...editing, abstract: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-row">
                    <label className="form-label">TRL</label>
                    <input
                      className="form-input"
                      type="number"
                      min={1}
                      max={9}
                      value={editing.trl}
                      onChange={(e) =>
                        setEditing({ ...editing, trl: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">IP Status</label>
                    <select
                      className="form-input"
                      value={editing.ipStatus}
                      onChange={(e) =>
                        setEditing({ ...editing, ipStatus: e.target.value })
                      }
                    >
                      <option value="">Select IP Status</option>
                      <option value="Patented">Patented</option>
                      <option value="Not yet Patented">Not yet Patented</option>
                      <option value="Still in Process">Still in Process</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Funding Required</label>
                    <input
                      className="form-input"
                      type="number"
                      min={0}
                      value={editing.fundingRequired}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          fundingRequired: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
