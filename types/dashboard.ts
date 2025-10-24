import { UserProfile } from "./auth";
import type { StallType } from "./auth";

export interface DashboardStats {
  orders: number;
  favorites: number;
  rating: number;
  reviews: number;
  stallSubscribers: number;
  vendorSubscribers: number;
}

export type OrderStatus =
  | "PAID"
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type RecentOrder = {
  id: string;
  images: string[];
  productName: string;
  vendor: string;
  date: string;
  amount: string;
  status: OrderStatus;
};

export type VendorRecentOrder = {
  id: string;
  images: string[];
  productName: string;
  customer: string;
  stall: string;
  date: string;
  amount: string;
  status: OrderStatus;
};

export interface UserStall {
  id: string;
  name: string;
  description: string;
  type: StallType;
  images: string[];
  area: string;
  city: string;
  state: string;
  address: string;
  landmark: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
  status: "Active" | "Inactive";
}

export interface DashboardData {
  user: UserProfile;
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  vendorRecentOrders: VendorRecentOrder[];
  userStalls: UserStall[];
}

export interface DashboardClientProps {
  userProfile: UserProfile;
  dashboardData: DashboardData;
  accessToken: string;
}

export interface DashboardPageProps {
  params?: Promise<any>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// API Response Types
export interface DashboardApiResponse {
  success: boolean;
  userProfile?: UserProfile;
  dashboardData?: DashboardData;
  error?: string;
}

export type CuisineType =
  | "Japanese"
  | "Indian"
  | "Italian"
  | "American"
  | "Chinese"
  | "Mexican"
  | "Thai"
  | "Mediterranean";
