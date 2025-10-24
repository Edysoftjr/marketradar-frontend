"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  Notification,
  NotificationState,
  NotificationType,
} from "@/types/notification";

// Define actions
type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const NotificationContext = createContext<
  | {
      state: NotificationState;
      dispatch: React.Dispatch<NotificationAction>;
      addNotification: (
        notification: Omit<Notification, "id" | "createdAt">
      ) => void;
      markAsRead: (notificationId: string) => void;
      markAllAsRead: () => void;
      removeNotification: (notificationId: string) => void;
    }
  | undefined
>(undefined);

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
        unreadCount: state.notifications.filter(
          (n) => !n.read && n.id !== action.payload
        ).length,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Actions
  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  const removeNotification = (notificationId: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: notificationId });
  };

  // Provide the context value
  const value = {
    state,
    dispatch,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
