import { createContext, useContext, useEffect } from "react";

import socket from "../socket";

import useAuthStore from "../store/authStore";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    socket.connect();

    socket.emit("join", user._id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}
