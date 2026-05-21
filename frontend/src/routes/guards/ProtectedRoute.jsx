import React from "react";

import { Navigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") {
    return null;
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
