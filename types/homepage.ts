import type { StallWithDetails } from "./stall";
import type { Product } from "./product";

export interface StallMetrics {
  subscribers: number;
  products: number;
  reviews: number;
}

export interface CategorySection {
  category: string;
  stalls: StallWithDetails[];
}

export interface userLocation {
  latitude: number;
  longitude: number;
}

export interface userAddress {
  addressCity?: string;
  addressLandmark?: string;
  addressRaw?: string;
  addressState?: string;
}

export interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: {
    budget: number;
    location: { latitude: number; longitude: number } | null;
    type?: string;
    minRating?: number;
    maxPrice?: number;
  }) => void;
  accessToken?: string;
  loading?: boolean;
}

export interface HomepageData {
  distance: number | undefined;
  email: string | undefined;
  featuredStalls: StallWithDetails[];
  trendingProducts: Product[];
  stallsByCategory: CategorySection[];
  nearbyStalls?: StallWithDetails[];
  userAddress: userAddress;
  userLocation?: userLocation;
}

export interface SearchFilters {
  type?: string;
  location: { latitude: number; longitude: number } | null;
  minRating?: number;
  maxPrice?: number;
}

export interface SearchResults {
  stalls: StallWithDetails[];
  products: Product[];
}

export interface HomepageProps {
  initialData?: HomepageData;
  accessToken: string;
}
