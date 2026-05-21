import TopBar from "./TopBar";
import BottomNav from "../../components/BottomNav";
import "../../styles/app-shell.css";

const AppShell = ({ children, variant = "default" }) => {
  return (
    <div className="app-stage">
      <div className={`app-shell app-shell--${variant}`}>
        <TopBar />

        <main className="app-main">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
};

export default AppShell;
