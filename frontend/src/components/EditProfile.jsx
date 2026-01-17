import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

export default function EditProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [institution, setInstitution] = useState(user?.institution || "");
  const [googleScholar, setGoogleScholar] = useState(user?.googleScholar || "");
  const [scopusLink, setScopusLink] = useState(user?.scopusLink || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        if (!mounted) return;
        setName(res.data.name || "");
        setInstitution(res.data.institution || "");
        setGoogleScholar(res.data.googleScholar || "");
        setScopusLink(res.data.scopusLink || "");
        setPhoneNumber(res.data.phoneNumber || "");
      } catch (err) {
        // silently ignore
      }
    };
    fetchProfile();
    return () => (mounted = false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.put("/auth/profile", {
        name,
        institution,
        googleScholar,
        scopusLink,
        phoneNumber,
      });
      updateUser({
        name: res.data.name,
        institution: res.data.institution,
        googleScholar: res.data.googleScholar,
        scopusLink: res.data.scopusLink,
        phoneNumber: res.data.phoneNumber,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow">
          <h2 className="mb-6 text-center text-2xl font-bold">Edit Profile</h2>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span>Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                           focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
                required
              />
            </div>

            {(user?.role === "researcher" || user?.role === "investor") && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span>Institution</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                             focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Scholar
              </label>
              <input
                type="url"
                placeholder="https://scholar.google.com/citations?user=..."
                value={googleScholar}
                onChange={(e) => setGoogleScholar(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                           focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Scopus Profile
              </label>
              <input
                type="url"
                placeholder="https://www.scopus.com/authid/detail.uri?authorId=..."
                value={scopusLink}
                onChange={(e) => setScopusLink(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                           focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                           focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-md bg-[#2a73d9] px-4 py-2 text-sm font-semibold text-white shadow-sm
                           hover:bg-[#2a73d9] disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700
                           shadow-sm hover:bg-gray-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
