import AppRoutes from "./routes/AppRoutes";

import { useAuthBootstrap } from "./features/auth/hooks/useAuthBootstrap";

import ToastContainer from "./components/ui/ToastContainer";

import "./styles/toast.css";
import "./styles/form.css";

import useThemeStore from "./store/themeStore";

function App() {
  useAuthBootstrap();

  const theme = useThemeStore((state) => state.theme);

  return (
    <div className={`${theme}-theme`}>
      <AppRoutes />

      <ToastContainer />
    </div>
  );
}

export default App;
