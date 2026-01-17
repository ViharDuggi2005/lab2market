import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user synchronously from localStorage
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const name = localStorage.getItem("name");
      const institution = localStorage.getItem("institution");

      if (token && role) {
        const decoded = jwtDecode(token);
        return { token, role, name, institution, id: decoded.id };
      }
      return null;
    } catch {
      return null;
    }
  });

  const loginUser = (token, role, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    const decoded = jwtDecode(token);
    setUser({ token, role, name, id: decoded.id });
  };

  const updateUser = ({ name, institution }) => {
    if (name) {
      localStorage.setItem("name", name);
    }
    if (typeof institution !== "undefined") {
      localStorage.setItem("institution", institution || "");
    }

    setUser((prev) => ({
      ...(prev || {}),
      name: name || prev?.name,
      institution: institution ?? prev?.institution,
    }));
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUser(null);

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
