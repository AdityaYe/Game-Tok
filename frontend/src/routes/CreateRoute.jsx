import { Navigate, Outlet } from "react-router-dom";

import useAuthStore from "../store/authStore";

const CreatorRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/creator/login" replace />;
  }

  if (!user.isCreator) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default CreatorRoute;
