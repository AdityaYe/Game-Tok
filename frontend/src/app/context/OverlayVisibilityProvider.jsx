import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OverlayVisibilityContext } from "./OverlayVisibilityContext";

export const OverlayVisibilityProvider = ({ children, enabled = false }) => {
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimerRef = useRef(null);

  const revealControls = useCallback(() => {
    if (!enabled) {
      return;
    }

    setControlsVisible(true);
    window.clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setControlsVisible(true);
      return undefined;
    }

    revealControls();

    return () => {
      window.clearTimeout(controlsTimerRef.current);
    };
  }, [enabled, revealControls]);

  const value = useMemo(
    () => ({
      controlsVisible: enabled ? controlsVisible : true,
      revealControls,
    }),
    [controlsVisible, enabled, revealControls],
  );

  return (
    <OverlayVisibilityContext.Provider value={value}>
      {children}
    </OverlayVisibilityContext.Provider>
  );
};
