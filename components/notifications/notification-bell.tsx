"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications } from "./notification-provider";
import { Badge } from "@/components/ui/badge";
import { NotificationType } from "@/types/notification";

export function NotificationBell() {
  const { state, markAsRead, markAllAsRead } = useNotifications();
  const { notifications, unreadCount } = state;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return "🛍️";
      case NotificationType.CHAT:
        return "💬";
      case NotificationType.SOCIAL:
        return "👥";
      case NotificationType.SYSTEM:
        return "🔔";
      default:
        return "📌";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="text-xs"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-accent transition-colors cursor-pointer",
                    !notification.read && "bg-accent/50"
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    // Handle notification click based on metadata
                    if (notification.metadata?.action?.url) {
                      window.location.href = notification.metadata.action.url;
                    }
                  }}
                >
                  <span className="text-xl">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()} •{" "}
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
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
