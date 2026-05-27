import TopBar from "./TopBar";
import BottomNav from "../../components/BottomNav";
import { OverlayVisibilityProvider } from "../context/OverlayVisibilityProvider";
import { useOverlayVisibility } from "../context/useOverlayVisibility";
import "../../styles/app-shell.css";

const AppShellFrame = ({ children, variant }) => {
  const { controlsVisible, revealControls } = useOverlayVisibility();
  const isFeed = variant === "feed";

  return (
    <div className="app-stage">
      <div
        className={`app-shell app-shell--${variant} ${
          isFeed && controlsVisible ? "is-overlay-active" : ""
        } ${isFeed && !controlsVisible ? "is-overlay-idle" : ""}`}
        onMouseMove={isFeed ? revealControls : undefined}
        onTouchStart={isFeed ? revealControls : undefined}
        onPointerDown={isFeed ? revealControls : undefined}
      >
        <TopBar />

        <main className="app-main">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
};

const AppShell = ({ children, variant = "default" }) => {
  return (
    <OverlayVisibilityProvider enabled={variant === "feed"}>
      <AppShellFrame variant={variant}>{children}</AppShellFrame>
    </OverlayVisibilityProvider>
  );
};

export default AppShell;
