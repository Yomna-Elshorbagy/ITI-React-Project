export interface Product {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  finalPrice: number;
  discount: number;
  stock: number;
  rate: number;
  imageCover: {
    secure_url: string;
    public_id: string;
  };
  subImages: Array<{
    secure_url: string;
    public_id: string;
  }>;
  category: {
    _id: string;
    name: string;
  };
  product: {
    _id: string;
    id: string;
    name: string;
    image: {
      secure_url: string;
      public_id: string;
    };
    createdBy: string;
  };
  createdBy: {
    _id: string;
    id: string;
    userName: string;
    mobileNumber: string;
  };
  updatedBy: string;
  Reviews: import("./Review").Review[];
  createdAt: string;
  updatedAt: string;
}

export interface RelatedProduct extends Product {
  image: string;
}
export interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (id: string) => void;
}
