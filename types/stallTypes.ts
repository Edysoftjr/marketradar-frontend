// constants/stallTypes.ts
import { StallType } from "./auth"; // or wherever your enum is

// Helper function to convert enum key to readable label
const formatLabel = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

// Color mapping for each type
const typeColorMap: Record<StallType, string> = {
  // Food & Beverages
  [StallType.RESTAURANT]: "#f97316",
  [StallType.FAST_FOOD]: "#fb923c",
  [StallType.CAFE]: "#ea580c",
  [StallType.BAKERY]: "#eab308",
  [StallType.BAR]: "#ef4444",
  [StallType.FOOD_VENDOR]: "#fdba74",
  [StallType.CATERER]: "#c2410c",

  // Fashion & Beauty
  [StallType.CLOTHING_STORE]: "#a855f7",
  [StallType.FASHION_DESIGNER]: "#9333ea",
  [StallType.FOOTWEAR_STORE]: "#c084fc",
  [StallType.BEAUTY_SHOP]: "#ec4899",
  [StallType.COSMETICS_VENDOR]: "#f472b6",
  [StallType.JEWELRY_SHOP]: "#ca8a04",
  [StallType.FRAGRANCE_SHOP]: "#d8b4fe",
  [StallType.SALON]: "#db2777",
  [StallType.BARBERSHOP]: "#3b82f6",

  // Electronics & Appliances
  [StallType.ELECTRONICS]: "#f59e0b",
  [StallType.ELECTRONICS_STORE]: "#3b82f6",
  [StallType.PHONE_SHOP]: "#60a5fa",
  [StallType.COMPUTER_SHOP]: "#2563eb",
  [StallType.APPLIANCE_STORE]: "#06b6d4",
  [StallType.GADGET_VENDOR]: "#93c5fd",
  [StallType.REPAIR_CENTER]: "#4b5563",

  // Home & Living
  [StallType.FURNITURE_STORE]: "#92400e",
  [StallType.DECOR_VENDOR]: "#f59e0b",
  [StallType.HOME_SUPPLIES]: "#d97706",
  [StallType.KITCHEN_SUPPLIES]: "#f97316",

  // Health & Wellness
  [StallType.PHARMACY]: "#22c55e",
  [StallType.CLINIC]: "#16a34a",
  [StallType.HEALTH_STORE]: "#4ade80",
  [StallType.FITNESS_CENTER]: "#dc2626",
  [StallType.SPA]: "#14b8a6",

  // Kids, Baby & Toys
  [StallType.BABY_STORE]: "#f472b6",
  [StallType.TOY_SHOP]: "#facc15",
  [StallType.KIDS_STORE]: "#818cf8",

  // Automotive & Industrial
  [StallType.AUTO_PARTS_STORE]: "#374151",
  [StallType.MECHANIC]: "#4b5563",
  [StallType.MOTORCYCLE_SHOP]: "#b91c1c",
  [StallType.INDUSTRIAL_SUPPLIER]: "#475569",
  [StallType.TOOL_VENDOR]: "#6b7280",

  // Tech & Services
  [StallType.TECH_VENDOR]: "#8b5cf6",
  [StallType.SOFTWARE_COMPANY]: "#7c3aed",
  [StallType.HARDWARE_VENDOR]: "#a78bfa",
  [StallType.DIGITAL_SERVICES]: "#6366f1",
  [StallType.FREELANCER]: "#818cf8",
  [StallType.CONSULTANT]: "#4f46e5",

  // Books, Media & Education
  [StallType.BOOKSTORE]: "#57534e",
  [StallType.PRINT_SHOP]: "#64748b",
  [StallType.SCHOOL_SUPPLIER]: "#1d4ed8",
  [StallType.ART_STORE]: "#d946ef",
  [StallType.MUSIC_SHOP]: "#a855f7",

  // Agriculture & Energy
  [StallType.FARM_SUPPLIER]: "#15803d",
  [StallType.AGRO_VENDOR]: "#16a34a",
  [StallType.SOLAR_COMPANY]: "#eab308",
  [StallType.ENERGY_VENDOR]: "#ca8a04",
  [StallType.ELECTRICAL_SHOP]: "#f59e0b",

  // Real Estate & Construction
  [StallType.REAL_ESTATE_AGENT]: "#57534e",
  [StallType.BUILDING_MATERIALS]: "#78716c",
  [StallType.CONSTRUCTION_COMPANY]: "#c2410c",
  [StallType.FURNISHINGS_VENDOR]: "#d97706",

  // Others
  [StallType.SUPERMARKET]: "#10b981",
  [StallType.MINI_MART]: "#34d399",
  [StallType.GENERAL_STORE]: "#0d9488",
  [StallType.SERVICE_PROVIDER]: "#0891b2",
  [StallType.ONLINE_VENDOR]: "#3b82f6",
  [StallType.OTHER]: "#6b7280",
};

export const stallTypeCategories = [
  {
    label: "Food & Beverages",
    types: [
      StallType.RESTAURANT,
      StallType.FAST_FOOD,
      StallType.CAFE,
      StallType.BAKERY,
      StallType.BAR,
      StallType.FOOD_VENDOR,
      StallType.CATERER,
    ],
  },
  {
    label: "Fashion & Beauty",
    types: [
      StallType.CLOTHING_STORE,
      StallType.FASHION_DESIGNER,
      StallType.FOOTWEAR_STORE,
      StallType.BEAUTY_SHOP,
      StallType.COSMETICS_VENDOR,
      StallType.JEWELRY_SHOP,
      StallType.FRAGRANCE_SHOP,
      StallType.SALON,
      StallType.BARBERSHOP,
    ],
  },
  {
    label: "Electronics & Appliances",
    types: [
      StallType.ELECTRONICS,
      StallType.ELECTRONICS_STORE,
      StallType.PHONE_SHOP,
      StallType.COMPUTER_SHOP,
      StallType.APPLIANCE_STORE,
      StallType.GADGET_VENDOR,
      StallType.REPAIR_CENTER,
    ],
  },
  {
    label: "Home & Living",
    types: [
      StallType.FURNITURE_STORE,
      StallType.DECOR_VENDOR,
      StallType.HOME_SUPPLIES,
      StallType.KITCHEN_SUPPLIES,
    ],
  },
  {
    label: "Health & Wellness",
    types: [
      StallType.PHARMACY,
      StallType.CLINIC,
      StallType.HEALTH_STORE,
      StallType.FITNESS_CENTER,
      StallType.SPA,
    ],
  },
  {
    label: "Kids, Baby & Toys",
    types: [StallType.BABY_STORE, StallType.TOY_SHOP, StallType.KIDS_STORE],
  },
  {
    label: "Automotive & Industrial",
    types: [
      StallType.AUTO_PARTS_STORE,
      StallType.MECHANIC,
      StallType.MOTORCYCLE_SHOP,
      StallType.INDUSTRIAL_SUPPLIER,
      StallType.TOOL_VENDOR,
    ],
  },
  {
    label: "Tech & Services",
    types: [
      StallType.TECH_VENDOR,
      StallType.SOFTWARE_COMPANY,
      StallType.HARDWARE_VENDOR,
      StallType.DIGITAL_SERVICES,
      StallType.FREELANCER,
      StallType.CONSULTANT,
    ],
  },
  {
    label: "Books, Media & Education",
    types: [
      StallType.BOOKSTORE,
      StallType.PRINT_SHOP,
      StallType.SCHOOL_SUPPLIER,
      StallType.ART_STORE,
      StallType.MUSIC_SHOP,
    ],
  },
  {
    label: "Agriculture & Energy",
    types: [
      StallType.FARM_SUPPLIER,
      StallType.AGRO_VENDOR,
      StallType.SOLAR_COMPANY,
      StallType.ENERGY_VENDOR,
      StallType.ELECTRICAL_SHOP,
    ],
  },
  {
    label: "Real Estate & Construction",
    types: [
      StallType.REAL_ESTATE_AGENT,
      StallType.BUILDING_MATERIALS,
      StallType.CONSTRUCTION_COMPANY,
      StallType.FURNISHINGS_VENDOR,
    ],
  },
  {
    label: "General & Others",
    types: [
      StallType.SUPERMARKET,
      StallType.MINI_MART,
      StallType.GENERAL_STORE,
      StallType.SERVICE_PROVIDER,
      StallType.ONLINE_VENDOR,
      StallType.OTHER,
    ],
  },
];

export { typeColorMap, formatLabel };
