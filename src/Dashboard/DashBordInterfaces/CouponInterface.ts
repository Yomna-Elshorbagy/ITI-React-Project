export interface ICoupon {
  _id?: string;
  code: string;
  type: string;
  fromDate: string | Date;
  expire: string | Date;
  discount: number;
}
