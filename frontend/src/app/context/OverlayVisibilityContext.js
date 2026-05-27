import { createContext } from "react";

export const OverlayVisibilityContext = createContext({
  controlsVisible: true,
  revealControls: () => {},
});
