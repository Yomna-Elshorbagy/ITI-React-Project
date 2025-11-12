import type { BaseEntity } from '../common/base';

export interface CartProduct extends BaseEntity {
  productId: {
    _id: string;
    title: string;
    price: number;
    stock?: number;
    finalPrice?: number;
    imageCover?: {
      secure_url: string;
    };
  } | null;
  price: number;
  quantity: number;
  category: {
    name: string;
  } | null;
}

export interface CartState {
  noOfCartItems: number;
  noOfCartProducts: number;
  products: CartProduct[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

export interface CartResponse {
  noOfCartItems: number;
  noOfProducts: number;
  data: {
    products: CartProduct[];
    totalPrice: number;
  };
}

export interface CartMutationResponse {
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
}
