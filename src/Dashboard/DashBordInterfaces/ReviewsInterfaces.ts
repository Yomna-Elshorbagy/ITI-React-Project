export interface IReview {
  _id: string;
  comment: string;
  rate: number;
  createdAt: string;
  user: {
    _id: string;
    userName: string;
    email: string;
    mobileNumber?: string;
  };
  product: {
    _id: string;
    title: string;
  };
}


export interface IUser {
  _id: string;
  userName: string;
  email?: string;
  mobileNumber?: string;
}

export interface IProduct {
  _id: string;
  title: string;
}