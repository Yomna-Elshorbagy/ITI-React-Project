import type { Image } from './Common';

export interface CartProduct {
  _id: string;
  productId: null | {
    _id: string;
    title: string;
    price: number;
    stock?: number;
    finalPrice?: number;
    imageCover?: Image;
  };
  price: number;
  quantity: number;
  category: null | { 
    name: string;
    _id?: string;
  };
}
