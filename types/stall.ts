import { StallType, Role, Category } from "./auth";
import { Product, Size, Addon } from "@/types/product";
import { userAddress } from "@/types/homepage";

export interface StallMetrics {
  subscribers: number;
  products: number;
  reviews: number;
}

export interface StallWithDetails {
  id: string;
  name: string;
  description: string | null;
  category: Category;
  quantity: number;
  stallId: string;
  price: number;
  payOnOrder: boolean;
  sizes?: Size[];
  isFavorite?: boolean;
  addons?: Addon[];
  type: StallType;
  images: string[];
  area: string | null;
  city: string | null;
  state: string | null;
  landmark: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  avgRating: number;
  metrics: StallMetrics;
  isOwner?: boolean;
  isSubscribed?: boolean;
}

export interface StallDetails {
  id: string;
  name: string;
  description: string | null;
  type: StallType;
  images: string[];
  area: string | null;
  city: string | null;
  state: string | null;
  landmark: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  subscribers: number;
  revenue: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface StallFilters {
  type?: StallType;
  area?: string;
  city?: string;
  state?: string;
}

export interface StallFullData {
  stallData: StallDetails;
  products: Product[];
  comments: CommentData[];
  memberships: MembershipData[];
  userAddress: userAddress;
  isOwner: boolean;
  userEmail: string | undefined;
  isSubscribed: boolean;
}

export interface CommentData {
  id: string;
  content: string;
  rating: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    images: string[];
  };
  isOwner: boolean;
}

export interface MembershipData {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    role: Role;
  };
}

export interface CreateStallData {
  name: string;
  description: string;
  type: StallType;
  area: string;
  city: string;
  state: string;
  landmark: string;
  address: string;
  latitude?: number;
  longitude?: number;
}
