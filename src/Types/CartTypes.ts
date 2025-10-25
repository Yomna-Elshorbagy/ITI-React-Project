// src/Types/CartTypes.ts
import type { CartProduct } from "./CartProducts";

export type CartResponse = {
  noOfCartItems: number;
  noOfProducts: number;
  data: {
    products: CartProduct[];
    totalPrice: number;
  };
};

export type CartMutationResponse = {
  noOfCartItems: number;
  noOfProducts: number;
  cart?: {
    products: CartProduct[];
    totalPrice: number;
  };
  data?: {
    products: CartProduct[];
    totalPrice: number;
  };
};
