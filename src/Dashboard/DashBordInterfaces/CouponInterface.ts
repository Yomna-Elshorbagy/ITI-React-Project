export interface ICoupon {
  _id?: string;
  id?: string;
  code: string;
  type: string;
  fromDate: string | Date;
  expire: string | Date;
  discount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  isDeleted?: boolean;
  assignedUser?: string;
}

export type IUpdateCoupon = Omit<
  ICoupon,
  "_id" | "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedUser" | "isDeleted"
>;