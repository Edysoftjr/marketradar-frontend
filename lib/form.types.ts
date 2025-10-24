// Types for signup form and geolocation
export interface SignupForm {
  name: string;
  email: string;
  password: string;
  vendorName: string;
  vendorDesc: string;
  mealPrefs: string[];
  address: string;
  area: string;
  city: string;
  state: string;
  landmark: string;
}

export type CoordinatesType = { latitude: number; longitude: number } | null;

// Utility methods for geolocation and address handling
export function handleFormChange<T extends object>(
  form: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  e: React.ChangeEvent<HTMLInputElement>
) {
  setForm({ ...form, [e.target.name]: e.target.value });
}

export function handleArrayToggle<T>(
  arr: T[],
  value: T
): T[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}
