export interface RelatedProduct {
  _id: string;
  title: string;
  description: string;
  imageCover: {
    secure_url: string;
    public_id: string;
  };
  subImages: Array<{
    secure_url: string;
    public_id: string;
  }>;
  price: number;
  discount: number;
  stock: number;
  category: string;
  createdBy: string;
  updatedBy: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
  finalPrice: number;
  id: string;
}

export interface RelatedProductsResponse {
  success: boolean;
  relatedProducts: RelatedProduct[];
}


