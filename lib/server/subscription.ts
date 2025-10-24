import { fetchWithTokenRefresh } from './token-refresh';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function subscribeToStall(stallId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/stalls/${stallId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to subscribe to stall");
  }

  return response.json();
}

export async function unsubscribeFromStall(stallId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/stalls/${stallId}/subscribe`, {
    method: 'DELETE',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unsubscribe from stall");
  }

  return response.json();
}

export async function subscribeToVendor(vendorId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/vendors/${vendorId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to subscribe to vendor");
  }

  return response.json();
}

export async function unsubscribeFromVendor(vendorId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/vendors/${vendorId}/subscribe`, {
    method: 'DELETE',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unsubscribe from vendor");
  }

  return response.json();
}

export async function subscribeToUser(userId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/users/${userId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to subscribe to user");
  }

  return response.json();
}

export async function unsubscribeFromUser(userId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/users/${userId}/subscribe`, {
    method: 'DELETE',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unsubscribe from user");
  }

  return response.json();
}

export async function getUserSubscriptions(accessToken?: string): Promise<{ success: boolean; data: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/subscriptions/user/subscriptions`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user subscriptions");
  }

  return response.json();
}
