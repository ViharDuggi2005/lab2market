import { useState } from "react";
import API from "../../api/axios";
import SECTORS from "../../constants/sectors";

export default function CreateProject({ closeModal }) {
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    trl: 1,
    ipStatus: "",
    fundingRequired: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/projects", form);
      window.dispatchEvent(new CustomEvent("projectCreated"));
      setForm({
        title: "",
        abstract: "",
        trl: 1,
        ipStatus: "",
        fundingRequired: "",
        sector: "",
        location: "",
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

        <div className="form-row">
          <label className="form-label">Sector</label>
          <select
            className="form-input"
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
            required
          >
            <option value="">Select Sector</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Location</label>
          <input
            className="form-input"
            placeholder="City or State"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
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
            <select
              className="form-input"
              value={form.ipStatus}
              onChange={(e) => setForm({ ...form, ipStatus: e.target.value })}
            >
              <option value="">Select IP Status</option>
              <option value="Patented">Patented</option>
              <option value="Not yet Patented">Not yet Patented</option>
              <option value="Still in Process">Still in Process</option>
              <option value="None">None</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Funding Required (INR)</label>
            <input
              className="form-input no-spinner"
              placeholder="Amount"
              type="number"
              min={0}
              value={form.fundingRequired}
              onChange={(e) =>
                setForm({ ...form, fundingRequired: Number(e.target.value) })
              }
              inputMode="numeric"
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
