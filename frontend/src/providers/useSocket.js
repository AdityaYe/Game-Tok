import { useContext } from "react";
import { SocketContext } from "./socketContext";

export function useSocket() {
  return useContext(SocketContext);
}
