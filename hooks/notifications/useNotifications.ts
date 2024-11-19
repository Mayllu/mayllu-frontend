import { useEffect, useState } from "react";
import { fetchNotifications } from "@/api/notifications";
import { NotificationItemInterface } from "@/types";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<
    NotificationItemInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        if (
          Array.isArray(data) &&
          data.every((item) => isNotificationItem(item))
        ) {
          setNotifications(data);
        } else {
          console.error("Received invalid data format from fetchNotifications");
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  return { notifications, isLoading };
};

function isNotificationItem(item: any): item is NotificationItemInterface {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "title" in item &&
    "description" in item &&
    "status" in item &&
    "createdAt" in item
  );
}
