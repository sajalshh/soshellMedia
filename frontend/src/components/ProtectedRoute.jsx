// src/components/ProtectedRoute.jsx

import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // If we have an access token, render the child route.
  // Otherwise, navigate to the login page.
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
