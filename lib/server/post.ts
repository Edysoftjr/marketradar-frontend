import { CreatePostData, UpdatePostData } from "@/types";
import { fetchWithTokenRefresh } from "./token-refresh";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function createPost(
  data: CreatePostData,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    accessToken: accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create post");
  }

  return response.json();
}

export async function updatePost(
  postId: string,
  data: UpdatePostData,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/posts/${postId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update post");
  }

  return response.json();
}

export async function deletePost(
  postId: string,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/posts/${postId}`,
    {
      method: "DELETE",
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete post");
  }

  return response.json();
}

export async function getPostsByUser(
  userId: string,
  page = 1,
  limit = 20,
  accessToken?: string
): Promise<{ success: boolean; data: unknown; pagination?: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/posts/user/${userId}?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user posts");
  }

  return response.json();
}

export async function getFeedPosts(
  page = 1,
  limit = 20,
  accessToken?: string
): Promise<{ success: boolean; data: unknown; pagination?: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/posts/feed?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch feed posts");
  }

  return response.json();
}

export async function getPostById(
  postId: string,
  accessToken?: string
): Promise<{ success: boolean; data: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/posts/${postId}`,
    {
      cache: "no-store",
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}
