// Prisma enums
export enum Role {
  USER = "USER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum StallType {
  // Legacy values (keep for backward compatibility)
  ELECTRONICS = "ELECTRONICS",

  // Food & Beverages
  RESTAURANT = "RESTAURANT",
  FAST_FOOD = "FAST_FOOD",
  CAFE = "CAFE",
  BAKERY = "BAKERY",
  BAR = "BAR",
  FOOD_VENDOR = "FOOD_VENDOR",
  CATERER = "CATERER",

  // Fashion & Beauty
  CLOTHING_STORE = "CLOTHING_STORE",
  FASHION_DESIGNER = "FASHION_DESIGNER",
  FOOTWEAR_STORE = "FOOTWEAR_STORE",
  BEAUTY_SHOP = "BEAUTY_SHOP",
  COSMETICS_VENDOR = "COSMETICS_VENDOR",
  JEWELRY_SHOP = "JEWELRY_SHOP",
  FRAGRANCE_SHOP = "FRAGRANCE_SHOP",
  SALON = "SALON",
  BARBERSHOP = "BARBERSHOP",

  // Electronics & Appliances
  ELECTRONICS_STORE = "ELECTRONICS_STORE",
  PHONE_SHOP = "PHONE_SHOP",
  COMPUTER_SHOP = "COMPUTER_SHOP",
  APPLIANCE_STORE = "APPLIANCE_STORE",
  GADGET_VENDOR = "GADGET_VENDOR",
  REPAIR_CENTER = "REPAIR_CENTER",

  // Home & Living
  FURNITURE_STORE = "FURNITURE_STORE",
  DECOR_VENDOR = "DECOR_VENDOR",
  HOME_SUPPLIES = "HOME_SUPPLIES",
  KITCHEN_SUPPLIES = "KITCHEN_SUPPLIES",

  // Health & Wellness
  PHARMACY = "PHARMACY",
  CLINIC = "CLINIC",
  HEALTH_STORE = "HEALTH_STORE",
  FITNESS_CENTER = "FITNESS_CENTER",
  SPA = "SPA",

  // Kids, Baby & Toys
  BABY_STORE = "BABY_STORE",
  TOY_SHOP = "TOY_SHOP",
  KIDS_STORE = "KIDS_STORE",

  // Automotive & Industrial
  AUTO_PARTS_STORE = "AUTO_PARTS_STORE",
  MECHANIC = "MECHANIC",
  MOTORCYCLE_SHOP = "MOTORCYCLE_SHOP",
  INDUSTRIAL_SUPPLIER = "INDUSTRIAL_SUPPLIER",
  TOOL_VENDOR = "TOOL_VENDOR",

  // Tech & Services
  TECH_VENDOR = "TECH_VENDOR",
  SOFTWARE_COMPANY = "SOFTWARE_COMPANY",
  HARDWARE_VENDOR = "HARDWARE_VENDOR",
  DIGITAL_SERVICES = "DIGITAL_SERVICES",
  FREELANCER = "FREELANCER",
  CONSULTANT = "CONSULTANT",

  // Books, Media & Education
  BOOKSTORE = "BOOKSTORE",
  PRINT_SHOP = "PRINT_SHOP",
  SCHOOL_SUPPLIER = "SCHOOL_SUPPLIER",
  ART_STORE = "ART_STORE",
  MUSIC_SHOP = "MUSIC_SHOP",

  // Agriculture & Energy
  FARM_SUPPLIER = "FARM_SUPPLIER",
  AGRO_VENDOR = "AGRO_VENDOR",
  SOLAR_COMPANY = "SOLAR_COMPANY",
  ENERGY_VENDOR = "ENERGY_VENDOR",
  ELECTRICAL_SHOP = "ELECTRICAL_SHOP",

  // Real Estate & Construction
  REAL_ESTATE_AGENT = "REAL_ESTATE_AGENT",
  BUILDING_MATERIALS = "BUILDING_MATERIALS",
  CONSTRUCTION_COMPANY = "CONSTRUCTION_COMPANY",
  FURNISHINGS_VENDOR = "FURNISHINGS_VENDOR",

  // Others
  SUPERMARKET = "SUPERMARKET",
  MINI_MART = "MINI_MART",
  GENERAL_STORE = "GENERAL_STORE",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  ONLINE_VENDOR = "ONLINE_VENDOR",
  OTHER = "OTHER",
}

export enum Category {
  // Food & Drinks
  MEAL = "MEAL",
  FOOD = "FOOD",
  DRINKS = "DRINKS",
  SNACKS = "SNACKS",
  GROCERIES = "GROCERIES",
  BEVERAGES = "BEVERAGES",

  // Fashion & Beauty
  FASHION = "FASHION",
  CLOTHING = "CLOTHING",
  FOOTWEAR = "FOOTWEAR",
  ACCESSORIES = "ACCESSORIES",
  JEWELRY = "JEWELRY",
  BEAUTY = "BEAUTY",
  COSMETICS = "COSMETICS",
  FRAGRANCE = "FRAGRANCE",
  HAIR_CARE = "HAIR CARE",
  SKIN_CARE = "SKIN CARE",

  // Electronics & Gadgets
  ELECTRONICS = "ELECTRONICS",
  PHONES = "PHONES",
  COMPUTERS = "COMPUTERS",
  LAPTOPS = "LAPTOPS",
  TABLETS = "TABLETS",
  ACCESSORIES_ELECTRONIC = "ELECTRONIC ACCESSORIES",
  APPLIANCES = "HOME APPLIANCES",
  TV_AUDIO = "TV & AUDIO",
  GAMING = "GAMING",
  CAMERAS = "CAMERAS",

  // Home & Living
  HOME = "HOME",
  FURNITURE = "FURNITURE",
  DECOR = "HOME DECOR",
  KITCHEN = "KITCHEN",
  BEDDING = "BEDDING",
  CLEANING = "CLEANING SUPPLIES",
  LIGHTING = "LIGHTING",

  // Health & Personal Care
  HEALTH = "HEALTH",
  PERSONAL_CARE = "PERSONAL CARE",
  MEDICAL_SUPPLIES = "MEDICAL SUPPLIES",
  FITNESS = "FITNESS",
  SUPPLEMENTS = "SUPPLEMENTS",

  // Baby, Kids & Toys
  BABY = "BABY",
  KIDS = "KIDS",
  TOYS = "TOYS",
  BABY_PRODUCTS = "BABY PRODUCTS",

  // Automotive & Industrial
  AUTOMOTIVE = "AUTOMOTIVE",
  MOTORCYCLE = "MOTORCYCLE",
  AUTO_PARTS = "AUTO PARTS",
  INDUSTRIAL = "INDUSTRIAL",
  TOOLS = "TOOLS",

  // Tech & Services
  SOFTWARE = "SOFTWARE",
  HARDWARE = "HARDWARE",
  SERVICES = "SERVICES",
  DIGITAL_GOODS = "DIGITAL GOODS",

  // Books, Media & Education
  BOOKS = "BOOKS",
  STATIONERY = "STATIONERY",
  EDUCATION = "EDUCATION",
  MUSIC = "MUSIC",
  MOVIES = "MOVIES",
  ART = "ART",

  // Agriculture & Energy
  AGRICULTURE = "AGRICULTURE",
  FARM_EQUIPMENT = "FARM EQUIPMENT",
  SOLAR = "SOLAR",
  ENERGY = "ENERGY",
  ELECTRICAL = "ELECTRICAL",

  // Real Estate & Construction
  REAL_ESTATE = "REAL ESTATE",
  BUILDING_MATERIALS = "BUILDING MATERIALS",
  CONSTRUCTION = "CONSTRUCTION",
  FURNISHINGS = "FURNISHINGS",

  // Miscellaneous
  PETS = "PETS",
  GARDEN = "GARDEN",
  SPORTS = "SPORTS",
  TRAVEL = "TRAVEL",
  STATIONERY_SUPPLIES = "STATIONERY SUPPLIES",
  OTHER = "OTHER",
  GENERAL = "GENERAL",
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified: boolean;
  lastLoginAt: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified: boolean;
  accountStatus: AccountStatus;
  lastLoginAt: string | null; // We keep this as string for frontend display
  createdAt: string; // Date from API converted to string
  updatedAt: string; // Date from API converted to string
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: Role;
  vendorName?: string;
  vendorDescription?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  area?: string;
  city?: string;
  state?: string;
  landmark?: string;
  mealPreferences?: string[];
  stallType?: StallType;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  tokens?: {
    accessToken: string;
    refreshToken?: string;
  };
}
