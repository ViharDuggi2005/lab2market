import { useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "researcher",
    institution: "",
    googleScholar: "",
    scopusLink: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      loginUser(loginRes.data.token, loginRes.data.role);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="register form"
    >
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <span>Name</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <span>Email</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <span>Password</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span>Role</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                       focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9] bg-white"
          >
            <option value="researcher">Researcher</option>
            <option value="investor">Investor</option>
          </select>
        </div>

        {/* Institution */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span>Institution</span>
            {(form.role === "researcher" || form.role === "investor") && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Your institution"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            required={form.role === "researcher" || form.role === "investor"}
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                       focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
          />
        </div>
      </div>

      {/* Google Scholar */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Google Scholar
        </label>
        <input
          type="url"
          placeholder="https://scholar.google.com/citations?user=..."
          value={form.googleScholar}
          onChange={(e) => setForm({ ...form, googleScholar: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Scopus link */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Scopus profile
        </label>
        <input
          type="url"
          placeholder="https://www.scopus.com/authid/detail.uri?authorId=..."
          value={form.scopusLink}
          onChange={(e) => setForm({ ...form, scopusLink: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="Your phone number"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[#2a73d9] px-4 py-2 text-sm font-semibold text-white shadow-sm
                   hover:bg-[#2a73d9] disabled:opacity-60 mt-2"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {/* Already have account */}
      <div className="pt-2 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-[#2a73d9] hover:underline">
          Sign in
        </a>
      </div>
    </form>
  );
}
