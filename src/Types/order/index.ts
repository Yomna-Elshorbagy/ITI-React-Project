import type { BaseEntity } from '../common/base';

export type PaymentMethod = 'Cash on Delivery' | 'Online';

export interface CreateOrderInput {
  fullName: string;
  phone: string;
  address: string;
  payment: PaymentMethod;
  couponCode?: string;
}

export interface OrderProduct {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  finalPrice: number;
  _id: string;
}

export interface Order extends BaseEntity {
  user: string;
  fullName: string;
  products: OrderProduct[];
  address: string;
  phone: string;
  payment: PaymentMethod | string;
  status: 'placed' | 'shipped' | 'delivered' | string;
  orderPrice: number;
  totalPrice: number;
  couponCode?: string;
  discount?: number;
  taxPrice: number;
  shippingPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
}
