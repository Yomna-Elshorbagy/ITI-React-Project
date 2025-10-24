export interface ICoupon {
  _id?: string;
  code: string;
  type: string;
  fromDate: string | Date;
  expiryDate: string | Date;
  usageLimit: number;
  discount: number;
}
