import { CommentData } from "./stall";

export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  userId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithUser extends Post {
  user: {
    id: string;
    name: string;
    email: string;
  };
  comments: CommentData[];
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface UpdatePostData {
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface PostFilters {
  userId?: string;
  page?: number;
  limit?: number;
}

export interface PostResponse {
  posts: PostWithUser[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
