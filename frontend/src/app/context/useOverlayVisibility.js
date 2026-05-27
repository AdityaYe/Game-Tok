import { useContext } from "react";
import { OverlayVisibilityContext } from "./OverlayVisibilityContext";

export const useOverlayVisibility = () => useContext(OverlayVisibilityContext);
