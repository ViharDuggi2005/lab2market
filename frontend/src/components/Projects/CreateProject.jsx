import { useState } from "react";
import API from "../../api/axios";

export default function CreateProject({ closeModal }) {
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    trl: 1,
    ipStatus: "",
    fundingRequired: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/projects", form);
      alert("Project created!");
      setForm({
        title: "",
        abstract: "",
        trl: 1,
        ipStatus: "",
        fundingRequired: 0,
      });
      if (typeof closeModal === "function") closeModal();
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-form">
      <div className="modal-form-header">
        <h3>Create Project</h3>
        <button
          type="button"
          className="modal-close"
          onClick={() => typeof closeModal === "function" && closeModal()}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Abstract</label>
          <textarea
            className="form-textarea"
            placeholder="Short abstract of the project"
            value={form.abstract}
            onChange={(e) => setForm({ ...form, abstract: e.target.value })}
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label className="form-label">TRL</label>
            <input
              className="form-input"
              placeholder="TRL"
              type="number"
              min={1}
              max={9}
              value={form.trl}
              onChange={(e) =>
                setForm({ ...form, trl: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="form-row">
            <label className="form-label">IP Status</label>
            <input
              className="form-input"
              placeholder="Patented / Pending / None"
              value={form.ipStatus}
              onChange={(e) => setForm({ ...form, ipStatus: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Funding Required (INR)</label>
            <input
              className="form-input"
              placeholder="Amount"
              type="number"
              min={0}
              value={form.fundingRequired}
              onChange={(e) =>
                setForm({ ...form, fundingRequired: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => typeof closeModal === "function" && closeModal()}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
