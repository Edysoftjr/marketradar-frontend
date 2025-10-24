// constants/stallTypes.ts
import { StallType } from "@/types/auth"; // or wherever your enum is

// Define color palettes for each category
const COLOR_PALETTES = {
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    hex: "#f97316",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    hex: "#f59e0b",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    hex: "#eab308",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    hex: "#ef4444",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    hex: "#a855f7",
  },
  pink: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    hex: "#ec4899",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    hex: "#3b82f6",
  },
  cyan: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    hex: "#06b6d4",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    hex: "#22c55e",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hex: "#10b981",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    hex: "#14b8a6",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    hex: "#6366f1",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    hex: "#8b5cf6",
  },
  fuchsia: {
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
    hex: "#d946ef",
  },
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    hex: "#6b7280",
  },
  slate: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    hex: "#64748b",
  },
  stone: {
    bg: "bg-stone-50",
    text: "text-stone-700",
    border: "border-stone-200",
    hex: "#78716c",
  },
};

// Map each stall type to a color palette
const stallTypeColorPalette: Record<StallType, keyof typeof COLOR_PALETTES> = {
  // Legacy & Food
  [StallType.RESTAURANT]: "orange",
  [StallType.FAST_FOOD]: "amber",
  [StallType.CAFE]: "yellow",
  [StallType.BAKERY]: "yellow",
  [StallType.BAR]: "red",
  [StallType.FOOD_VENDOR]: "orange",
  [StallType.CATERER]: "amber",

  // Fashion & Beauty
  [StallType.CLOTHING_STORE]: "purple",
  [StallType.FASHION_DESIGNER]: "purple",
  [StallType.FOOTWEAR_STORE]: "purple",
  [StallType.BEAUTY_SHOP]: "pink",
  [StallType.COSMETICS_VENDOR]: "pink",
  [StallType.JEWELRY_SHOP]: "yellow",
  [StallType.FRAGRANCE_SHOP]: "purple",
  [StallType.SALON]: "pink",
  [StallType.BARBERSHOP]: "blue",

  // Electronics
  [StallType.ELECTRONICS]: "blue",
  [StallType.ELECTRONICS_STORE]: "blue",
  [StallType.PHONE_SHOP]: "blue",
  [StallType.COMPUTER_SHOP]: "blue",
  [StallType.APPLIANCE_STORE]: "cyan",
  [StallType.GADGET_VENDOR]: "blue",
  [StallType.REPAIR_CENTER]: "gray",

  // Home & Living
  [StallType.FURNITURE_STORE]: "amber",
  [StallType.DECOR_VENDOR]: "amber",
  [StallType.HOME_SUPPLIES]: "amber",
  [StallType.KITCHEN_SUPPLIES]: "orange",

  // Health & Wellness
  [StallType.PHARMACY]: "green",
  [StallType.CLINIC]: "green",
  [StallType.HEALTH_STORE]: "green",
  [StallType.FITNESS_CENTER]: "red",
  [StallType.SPA]: "teal",

  // Kids, Baby & Toys
  [StallType.BABY_STORE]: "pink",
  [StallType.TOY_SHOP]: "yellow",
  [StallType.KIDS_STORE]: "indigo",

  // Automotive & Industrial
  [StallType.AUTO_PARTS_STORE]: "gray",
  [StallType.MECHANIC]: "gray",
  [StallType.MOTORCYCLE_SHOP]: "red",
  [StallType.INDUSTRIAL_SUPPLIER]: "slate",
  [StallType.TOOL_VENDOR]: "gray",

  // Tech & Services
  [StallType.TECH_VENDOR]: "violet",
  [StallType.SOFTWARE_COMPANY]: "violet",
  [StallType.HARDWARE_VENDOR]: "violet",
  [StallType.DIGITAL_SERVICES]: "indigo",
  [StallType.FREELANCER]: "indigo",
  [StallType.CONSULTANT]: "indigo",

  // Books, Media & Education
  [StallType.BOOKSTORE]: "stone",
  [StallType.PRINT_SHOP]: "slate",
  [StallType.SCHOOL_SUPPLIER]: "blue",
  [StallType.ART_STORE]: "fuchsia",
  [StallType.MUSIC_SHOP]: "purple",

  // Agriculture & Energy
  [StallType.FARM_SUPPLIER]: "green",
  [StallType.AGRO_VENDOR]: "green",
  [StallType.SOLAR_COMPANY]: "yellow",
  [StallType.ENERGY_VENDOR]: "yellow",
  [StallType.ELECTRICAL_SHOP]: "amber",

  // Real Estate & Construction
  [StallType.REAL_ESTATE_AGENT]: "stone",
  [StallType.BUILDING_MATERIALS]: "stone",
  [StallType.CONSTRUCTION_COMPANY]: "orange",
  [StallType.FURNISHINGS_VENDOR]: "amber",

  // Others
  [StallType.SUPERMARKET]: "emerald",
  [StallType.MINI_MART]: "emerald",
  [StallType.GENERAL_STORE]: "teal",
  [StallType.SERVICE_PROVIDER]: "cyan",
  [StallType.ONLINE_VENDOR]: "blue",
  [StallType.OTHER]: "gray",
};

// Export hex colors for dot indicators
export const typeColorMap: Record<StallType, string> = Object.entries(
  stallTypeColorPalette
).reduce(
  (acc, [type, palette]) => ({
    ...acc,
    [type]: COLOR_PALETTES[palette].hex,
  }),
  {} as Record<StallType, string>
);

// Updated getStallTypeColor function
export const getStallTypeColor = (type: string): string => {
  const palette = stallTypeColorPalette[type as StallType];
  if (!palette) {
    return `${COLOR_PALETTES.gray.bg} ${COLOR_PALETTES.gray.text} ${COLOR_PALETTES.gray.border}`;
  }
  const colors = COLOR_PALETTES[palette];
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

// Helper function to format labels
export const formatLabel = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

// Export stall type categories for select dropdowns
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
