export interface Comment {
  id: string;
  content: string;
  rating: number | null;
  userId: string;
  stallId: string | null;
  postId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentWithUser extends Comment {
  user: {
    id: string;
    name: string;
    images: string[];
  };
}

export interface CreateCommentData {
  content: string;
  rating?: number;
  stallId?: string;
  postId?: string;
}

export interface UpdateCommentData {
  content?: string;
  rating?: number;
}

export interface CommentResponse {
  comments: CommentWithUser[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}
