import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import CreateProject from "../components/Projects/CreateProject";
import ProjectList from "../components/Projects/ProjectList";
import ResearcherProjects from "../components/Projects/ResearcherProjects";
import Chat from "../components/Chat";
import SECTORS from "../constants/sectors";

export default function Dashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [refreshProjects, setRefreshProjects] = useState(0);

  if (!user) return <p>Please login</p>;

  const title =
    user.role === "admin"
      ? "Admin Dashboard"
      : user.role === "investor"
      ? "Investor Dashboard"
      : "Researcher Dashboard";
  const subtitle =
    user.role === "admin"
      ? "Overview and manage all projects"
      : user.role === "investor"
      ? "Browse projects and connect with researchers"
      : "Manage your research projects, connect with investors";

  useEffect(() => {
    const handler = () => setShowModal(true);
    const chatHandler = (e) => {
      setShowChat(true);
      // Forward the researcher ID to the Chat component
      if (e.detail?.researcherId) {
        // Wait a bit longer to ensure messages are fetched
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("selectChatByResearcher", {
              detail: { researcherId: e.detail.researcherId },
            })
          );
        }, 500);
      }
    };
    const projectCreatedHandler = () => setRefreshProjects((prev) => prev + 1);
    window.addEventListener("openCreateModal", handler);
    window.addEventListener("openChatModal", chatHandler);
    window.addEventListener("projectCreated", projectCreatedHandler);
    return () => {
      window.removeEventListener("openCreateModal", handler);
      window.removeEventListener("openChatModal", chatHandler);
      window.removeEventListener("projectCreated", projectCreatedHandler);
    };
  }, []);

  return (
    <div>
      <Navbar />
      {/* Investor hero (full-width) */}
      {user.role === "investor" && (
        <div className="investor-hero">
          <div className="investor-hero-inner">
            <h2>Discover Breakthrough Research</h2>
            <p>
              Connect with India's leading researchers and invest in tomorrow's
              innovations across biotech, energy, ICT, and more
            </p>
            <div className="action-row">
              <button
                className="action-btn outline"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("openChatModal"))
                }
              >
                <span className="btn-icon">✉️</span>
                <span> View Messages</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "auto", padding: "30px" }}>
        {/* Investor view: search + project listings (inside centered container) */}
        {user.role === "investor" && (
          <div className="investor-container">
            <div className="search-panel">
              <div className="search-panel-heading">
                <h3>Search & Browse Projects</h3>
              </div>

              <div className="form-row">
                <label className="form-label">Search Projects</label>
                <input
                  type="text"
                  placeholder="Search by title, description, or research area"
                  id="invest-search"
                  className="search-input"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  alignItems: "start",
                }}
              >
                <div className="filter-col" style={{ gridRow: "span 3" }}>
                  <label className="form-label">Sector</label>
                  <div className="checkbox-group">
                    {SECTORS.map((s) => (
                      <label key={s} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={s}
                          className="sector-checkbox"
                        />{" "}
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-col">
                  <label className="form-label">TRL Level</label>
                  <select id="invest-trl" className="filter-select">
                    <option>All Levels</option>
                    <option>TRL 1</option>
                    <option>TRL 2</option>
                    <option>TRL 3</option>
                  </select>
                </div>

                <div className="filter-col">
                  <label className="form-label">Location</label>
                  <input
                    id="invest-location"
                    className="filter-input"
                    placeholder="Enter city or state"
                  />
                </div>

                <div className="filter-col">
                  <label className="form-label">Institution</label>
                  <input
                    id="invest-institution"
                    className="filter-input"
                    placeholder="Enter institution name"
                  />
                </div>

                <div className="filter-action" style={{ gridColumn: "span 2" }}>
                  <button className="search-button" id="invest-search-btn">
                    Search Projects
                  </button>
                  <button
                    type="button"
                    className="reset-button"
                    onClick={() => {
                      document.getElementById("invest-search").value = "";
                      document
                        .querySelectorAll(".sector-checkbox")
                        .forEach((cb) => (cb.checked = false));
                      document.getElementById("invest-trl").value =
                        "All Levels";
                      document.getElementById("invest-location").value = "";
                      document.getElementById("invest-institution").value = "";
                      window.dispatchEvent(new CustomEvent("filterApplied"));
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* ProjectList will render results into a grid */}
            <ProjectList />
          </div>
        )}

        {/* MODAL (INLINE CSS) */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CreateProject closeModal={() => setShowModal(false)} />
            </div>
          </div>
        )}

        {user.role === "admin" && <ProjectList />}

        {user.role === "researcher" && (
          <ResearcherProjects refreshTrigger={refreshProjects} />
        )}

        {/* Chat Modal */}
        {showChat && <Chat closeChat={() => setShowChat(false)} />}
      </div>
    </div>
  );
}
