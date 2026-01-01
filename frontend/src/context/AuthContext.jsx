import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user synchronously from localStorage so pages like Dashboard
  // can render immediately for already-authenticated users.
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      return token && role ? { token, role } : null;
    } catch (e) {
      return null;
    }
  });

  const loginUser = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    // redirect to home page on logout
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
