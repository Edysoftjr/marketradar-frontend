import { Category } from "./auth";
import { StallDetails } from "./stall";

export interface Product {
  id: string;
  name: string;
  images: string[];
  description: string | null;
  category: Category;
  quantity: number;
  stallId: string;
  price: number;
  payOnOrder: boolean;
  sizes?: Size[];
  isFavorite?: boolean;
  addons?: Addon[];
  createdAt: string;
  updatedAt?: string;
  stall?: StallDetails;
  _count?: {
    orders: number;
    favouritedBy: number;
  };
}

export interface Size {
  id?: number;
  label: string;
  price: number;
}

export interface Addon {
  id?: string;
  label: string;
  price: number;
}

export interface CreateProductData {
  id?: string;
  name: string;
  description: string | null;
  price?: number;
  category: string;
  images: string[] | File[];
  quantity: number;
  payOnOrder: boolean;
  stallId: string;
  sizes?: Size[];
  addons?: Addon[];
  discount?: number;
  discountType?: "percentage" | "fixed";
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  stallId?: string;
}

export interface ProductWithStall extends Omit<Product, "stall"> {
  stall: StallDetails;
}
