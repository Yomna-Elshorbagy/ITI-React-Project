import type { CartProduct } from "./CartProducts";

export type CartState = {
  noOfCartItems: number;
  noOfCartProducts: number;
  products: CartProduct[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
};
