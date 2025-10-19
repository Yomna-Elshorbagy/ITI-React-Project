export interface IOrderProduct {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  discount?: number;
  finalPrice: number;
}

export interface IOrder {
  _id: string;
  fullName: string;
  user: string;
  address: string;
  phone: string;
  orderPrice: number;
  finalPrice: number;
  products: IOrderProduct[];
  coupon?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrder {
  fullName: string;
  address: string;
  phone: string;
  couponCode?: string;
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  data: IOrder;
}
