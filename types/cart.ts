// types/cart.ts
import { Product, Size, Addon } from "./product";

export interface CartItem extends Product {
  selectedSize: Size;
  selectedAddons: Addon[];
  paymentMethod: string;
}
