import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notificationsApi";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
}
