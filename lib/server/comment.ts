import { CreateCommentData, UpdateCommentData } from "@/types";
import { fetchWithTokenRefresh } from './token-refresh';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function createComment(data: CreateCommentData, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create comment");
  }

  return response.json();
}

export async function updateComment(commentId: string, data: UpdateCommentData, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update comment");
  }

  return response.json();
}

export async function deleteComment(commentId: string, accessToken?: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete comment");
  }

  return response.json();
}

export async function getCommentsByStall(stallId: string, page = 1, limit = 20, accessToken?: string): Promise<{ success: boolean; data: unknown; pagination?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/stall/${stallId}?page=${page}&limit=${limit}`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stall comments");
  }

  return response.json();
}

export async function getCommentsByPost(postId: string, page = 1, limit = 20, accessToken?: string): Promise<{ success: boolean; data: unknown; pagination?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/post/${postId}?page=${page}&limit=${limit}`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch post comments");
  }

  return response.json();
}

export async function getCommentById(commentId: string, accessToken?: string): Promise<{ success: boolean; data: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/${commentId}`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comment");
  }

  return response.json();
}

export async function getStallAverageRating(stallId: string, accessToken?: string): Promise<number> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/stall/${stallId}/rating`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stall rating");
  }

  const result = await response.json();
  return result.rating;
}

export async function getStallRatingDistribution(stallId: string, accessToken?: string): Promise<{ success: boolean; data: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/comments/stall/${stallId}/rating/distribution`, {
    cache: "no-store",
    accessToken: accessToken,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stall rating distribution");
  }

  return response.json();
}
