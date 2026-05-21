import { useEffect } from "react";

import socket from "../socket";

import useAuthStore from "../store/authStore";
import { SocketContext } from "./socketContext";

export const SocketProvider = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
