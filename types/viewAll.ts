import { StallWithDetails } from "./stall";
import { Product } from "./product";

export interface ViewAllMetadata {
  hasNextPage: boolean;
  nextCursor?: string;
  total?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  metadata: ViewAllMetadata;
  userLocation?: {
    latitude: number;
    longitude: number;
    addressRaw: string;
    email?: string;
  };
}

export interface ViewAllFilters {
  category?: string;
  searchQuery?: string;
  minRating?: number;
  maxPrice?: number;
  maxDistance?: number; // Added this property
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  location?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
}

export type ViewAllType = "stalls" | "products";

export interface ViewAllProps {
  type: ViewAllType;
  initialData?: PaginatedResponse<StallWithDetails>;
  category?: string;
  searchQuery?: string;
}
