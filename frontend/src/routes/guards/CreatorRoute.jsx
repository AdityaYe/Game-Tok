import React from "react";

import { Navigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const CreatorRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/creator/login" replace />;
  }

  if (!user.isCreator) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CreatorRoute;
