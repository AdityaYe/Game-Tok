import { useEffect } from "react";

import { useSocket } from "../../../providers/useSocket";

export function useNotificationsSocket(callback) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("new_notification", callback);

    return () => {
      socket.off("new_notification", callback);
    };
  }, [socket, callback]);
}
