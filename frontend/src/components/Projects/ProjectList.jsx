import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProjectList({ filters = {} }) {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // Only fetch all projects for investors or admins
    if (!user || (user.role !== "investor" && user.role !== "admin")) return;
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err.response?.data);
      }
    };
    fetchProjects();
  }, [user]);

  useEffect(() => {
    // basic filtering: if search inputs exist in DOM (rendered by Dashboard), read them
    const searchInput = document.getElementById("invest-search");
    const sectorInput = document.getElementById("invest-sector");
    const trlInput = document.getElementById("invest-trl");
    const locationInput = document.getElementById("invest-location");

    const applyFilters = () => {
      const s = searchInput?.value?.toLowerCase() || "";
      const sector = sectorInput?.value || "All Sectors";
      const trl = trlInput?.value || "All Levels";
      const loc = locationInput?.value?.toLowerCase() || "";

      const out = projects.filter((p) => {
        if (s) {
          const hay = `${p.title} ${p.abstract} ${
            p.sector || ""
          }`.toLowerCase();
          if (!hay.includes(s)) return false;
        }
        if (sector && sector !== "All Sectors" && (p.sector || "") !== sector)
          return false;
        if (
          trl &&
          trl !== "All Levels" &&
          `TRL ${p.trl}` !== trl &&
          String(p.trl) !== trl
        )
          return false;
        if (loc && p.location && !p.location.toLowerCase().includes(loc))
          return false;
        return true;
      });
      setFiltered(out);
    };

    // attach simple listener to search button
    const btn = document.getElementById("invest-search-btn");
    btn?.addEventListener("click", applyFilters);

    // initial filter
    applyFilters();

    return () => btn?.removeEventListener("click", applyFilters);
  }, [projects]);

  const expressInterest = async (id) => {
    alert("Interest expressed successfully.");
  };

  const list = filtered.length ? filtered : projects;

  return (
    <div className="project-grid">
      {list.map((p) => (
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
              {p.createdBy?.name}, {p.createdBy?.affiliation}
            </div>
            <div className="project-tags">
              {p.sector && <span className="tag">{p.sector}</span>}
              {p.trl && <span className="tag">TRL {p.trl}</span>}
              {p.location && <span className="tag">{p.location}</span>}
            </div>
            <p className="project-desc">{p.abstract}</p>

            <div className="project-actions">
              <button
                className="express-btn"
                onClick={() => expressInterest(p._id)}
              >
                Express Interest
              </button>
              <a className="view-btn" href={`/projects/${p._id}`}>
                View Details
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
