"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NotificationData {
  [key: string]: unknown;
}

interface NotificationMetadata {
  priority?: "low" | "medium" | "high";
  category?: string;
  actions?: Array<{
    label: string;
    url: string;
  }>;
  [key: string]: unknown;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: NotificationData;
  metadata?: NotificationMetadata;
}

interface NotificationPanelProps {
  accessToken: string;
}

export default function NotificationPanel({
  accessToken,
}: NotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState<string[]>([]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!open || notifications.length > 0) return;

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications?limit=20`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json();
        if (data.success) {
          setNotifications(data.data.notifications);
          setUnreadCount(data.data.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [open, accessToken, notifications.length]);

  // Fetch unread count periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            cache: "no-store",
          }
        );
        if (!res.ok) {
          console.error(
            "Error fetching unread count:",
            res.status,
            await res.text()
          );
          return;
        }
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.data.count);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up interval
    const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [accessToken]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (markingRead.includes(notificationId)) return;

    setMarkingRead((prev) => [...prev, notificationId]);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/mark-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setMarkingRead((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors hover:bg-muted/50",
                    !notification.read && "bg-muted/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markingRead.includes(notification.id)}
                      >
                        {markingRead.includes(notification.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
