import { fetchWithTokenRefresh } from './token-refresh';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getUserNotifications(accessToken?: string, page = 1, limit = 20): Promise<{ success: boolean; data: unknown; pagination?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/notifications?page=${page}&limit=${limit}`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function getUnreadCount(accessToken?: string): Promise<number> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/notifications/unread/count`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  const result = await response.json();
  return result.data.count;
}

export async function markAsRead(notificationId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/notifications/${notificationId}/read`, {
    method: 'POST',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark notification as read");
  }

  return response.json();
}

export async function markAllAsRead(accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/notifications/read/all`, {
    method: 'POST',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark all notifications as read");
  }

  return response.json();
}

export async function deleteNotification(notificationId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/notifications/${notificationId}`, {
    method: 'DELETE',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete notification");
  }

  return response.json();
}

export async function deleteAllNotifications(accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/notifications`, {
    method: 'DELETE',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete all notifications");
  }

  return response.json();
}
