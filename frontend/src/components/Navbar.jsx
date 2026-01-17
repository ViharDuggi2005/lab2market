import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();

  const showResearcherHero =
    user && user.role === "researcher" && location.pathname === "/dashboard";

  return (
    <>
      <nav className="flex items-center px-10 py-4 bg-white shadow">
        <div className="text-xl font-bold text-[#2a73d9]">lab2market</div>

        <div className="hidden md:flex flex-1 justify-end gap-6 pr-6 text-gray-800">
          <Link to="/" className={location.pathname === "/" ? "font-bold" : ""}>
            Home
          </Link>
          {user && user.role === "researcher" && (
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "font-bold" : ""}
            >
              Researcher Dashboard
            </Link>
          )}
          {user && user.role === "investor" && (
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "font-bold" : ""}
            >
              Investor Dashboard
            </Link>
          )}
          {user && (user.role === "investor" || user.role === "researcher") && (
            <Link
              to="/edit-profile"
              className={
                location.pathname === "/edit-profile" ? "font-bold" : ""
              }
            >
              Edit Profile
            </Link>
          )}
          {user && user.role === "investor" && (
            <Link
              to="/interested-projects"
              className={
                location.pathname === "/interested-projects" ? "font-bold" : ""
              }
            >
              Interested Projects
            </Link>
          )}
          {user && user.role === "researcher" && (
            <Link
              to="#"
              className={location.pathname === "#" ? "font-bold" : ""}
            >
              Explore Projects
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link
              to="#"
              className={location.pathname === "#" ? "font-bold" : ""}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex gap-3">
          {user ? (
            <button onClick={logoutUser} className="logout-btn">
              Log Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-[#1f66ca] px-4 py-2 text-white hover:bg-[#2a73d9]"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {showResearcherHero && (
        <div className="researcher-hero">
          <div className="researcher-hero-inner">
            <h1 className="researcher-title">Researcher Dashboard</h1>
            <p className="researcher-sub">
              Manage your research projects, connect with investors, and track
              engagement
            </p>
            <div className="action-row">
              <button
                className="action-btn primary"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("openCreateModal"))
                }
              >
                <span className="btn-icon">＋</span>
                <span> Create New Project</span>
              </button>
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
    </>
  );
}
