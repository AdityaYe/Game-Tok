import AppRoutes from "./routes/AppRoutes";

import React, {lazy,Suspense} from "react";
import { useAuthBootstrap } from "./features/auth/hooks/useAuthBootstrap";
import { useAuth } from "./features/auth/hooks/useAuth";
import ToastContainer from "./components/ui/ToastContainer";

import "./styles/toast.css";

function App() {
  useAuth();
  useAuthBootstrap();

  return<>
  <AppRoutes />
  <ToastContainer />
  </>
}

export default App;