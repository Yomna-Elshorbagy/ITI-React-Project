import type { Product } from "./Prooduct";

export interface Order {
  _id: string;
  address: string;
  phone: string;
  payment: string;
  status: "placed" | "shipped" | "delivered" | "pending";
  finalPrice: number;
  createdAt: string;
  products: Product[];
}
