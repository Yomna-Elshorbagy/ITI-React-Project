export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  finalPrice?: number;
  discount?: number;
  stock: number;
  rate: number;
   category: {
    _id: string;
    name: string;
    image: { secure_url: string };
  };

  imageCover: {
    secure_url: string;
    public_id: string;
  };
  subImages: {
    secure_url: string;
    public_id: string;
  }[];
  createdBy: {
    _id: string;
    userName: string;
    address?: string;
    mobileNumber?: string;
  };
  updatedBy?: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRelatedProduct {
  _id: string;
  title: string;
  price: number;
  discount?: number;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  imageCover: {
    secure_url: string;
    public_id: string;
  };
}

export interface IProductStats {
  totalProducts: number;
  lowStockProducts: number;
  trendingProducts: IProduct[];
  [key: string]: any;
}
