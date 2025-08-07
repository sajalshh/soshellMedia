// src/context/AuthContext.js

import React, { createContext, useState, useContext } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initialize state from localStorage
  // This function runs only once when the component first loads.
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token ? { accessToken: token } : {};
  });
 // <-- ADD THIS LINE
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const accessToken = response.data.accessToken;

    // 2. Save the new token to localStorage
    localStorage.setItem("accessToken", accessToken);

    setAuth({ accessToken });
    return response;
  };

  const logout = () => {
    // 3. Remove the token from localStorage
    localStorage.removeItem("accessToken");

    setAuth({});
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
