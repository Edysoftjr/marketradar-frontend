import { userAddress } from "./homepage";

// profile.ts
export type { userAddress } from "./homepage";

export type UserRole = "USER" | "VENDOR" | "ADMIN"; // expand if you have more roles

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string | null;
  isOwner: boolean;
  followers: number;
  stallSubscribers: number;
  subscribers: number;
  phoneNumber: string | null;
  vendorSubscribers?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  image: string[];
  address: userAddress;
  isSubscribed: boolean;
  isVendorSubscribed?: boolean;
  emailVerified: boolean | null;
  createdAt: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Stats for USER
export interface Stats {
  orders?: number;
  reviews?: number;
  spent?: number;
  followers: number;
  stallSubscribers: number;
  vendorSubscribers?: number;
  isSubscribed: boolean;
  isVendorSubscribed?: boolean;
  subscribers: number;
  favorites?: number;
  sales?: number;
  products?: number;
  rating?: number;
}

// UserStalls for vendor view
export interface ProfileStall {
  id: string;
  name: string;
  area: string;
  city: string;
  state: string;
  status: string;
  rating: number;
  products: number;
  orders: number;
  subscribers: number;
  reviews: number;
  revenue: number;
}

export interface ProfileData {
  user: ProfileUser;
  stats: Stats;
  userStalls: ProfileStall[];
  isOwner: boolean;
}

export interface ProfileResponse {
  success: boolean;
  data?: ProfileData;
  message?: string;
}
