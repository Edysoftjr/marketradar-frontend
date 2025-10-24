export * from "./auth";
export * from "./dashboard";
export * from "./notification";
export * from "./stall";
export * from "./product";
export * from "./comment";
export * from "./post";

// Extra types that don't fit in other files
export interface CreateStallData {
  name: string;
  description: string;
  type: "FOOD" | "CLOTHING" | "ELECTRONICS" | "OTHER";
  area: string;
  city: string;
  state: string;
  landmark: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
