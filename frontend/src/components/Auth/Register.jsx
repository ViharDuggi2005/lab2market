import { useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "researcher",
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
      className="space-y-4 max-w-md mx-auto p-6 rounded-lg shadow-md border border-gray-200"
      aria-label="register form"
    >
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9]"
        />
      </div>

      {/* Role */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                     focus:border-[#2a73d9] focus:ring-1 focus:ring-[#2a73d9] bg-white"
        >
          <option value="researcher">Researcher</option>
          <option value="investor">Investor</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[#2a73d9] px-4 py-2 text-sm font-semibold text-white shadow-sm
                   hover:bg-[#1f7ea3] disabled:opacity-60"
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
