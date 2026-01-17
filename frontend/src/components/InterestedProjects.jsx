import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./NavBar";

export default function InterestedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterestedProjects();
  }, []);

  const fetchInterestedProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects/interested");
      setProjects(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to remove this project?")) {
      return;
    }
    try {
      await API.delete(`/projects/interested/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove project");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Interested Projects</h1>
          <p className="text-gray-600 mb-8">
            Projects you have expressed interest in
          </p>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-gray-500">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                No interested projects yet
              </h3>
              <p className="text-gray-500 mt-2">
                Browse and express interest in projects to see them here
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 rounded-md bg-[#2a73d9] px-6 py-2 text-white hover:bg-[#1f66ca]"
              >
                Explore Projects
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="rounded-lg bg-white p-6 shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        By {project.createdBy?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeProject(project._id)}
                      className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{project.abstract}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Sector:</span>
                      <p className="font-medium">{project.sector}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{project.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">TRL:</span>
                      <p className="font-medium">{project.trl}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">IP Status:</span>
                      <p className="font-medium">{project.ipStatus}</p>
                    </div>
                  </div>

                  {project.fundingRequired && (
                    <div className="text-sm">
                      <span className="text-gray-500">Funding Required:</span>
                      <p className="font-medium text-green-600">
                        ${project.fundingRequired.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
