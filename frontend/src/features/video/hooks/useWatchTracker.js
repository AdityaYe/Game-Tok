import { useEffect, useRef } from "react";

import api from "../../../lib/api";

export function useWatchTracker({ clipId, isVisible }) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!isVisible || sentRef.current) {
      return;
    }

    const timer = setTimeout(
      async () => {
        try {
          await api.post(`/clips/${clipId}/view`);

          sentRef.current = true;
        } catch (err) {
          console.log(err);
        }
      },

      3000,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [clipId, isVisible]);
}
