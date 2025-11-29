import type { CategoryRef, Image, UserRef } from './Common';

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
  imageCover: Image;
  subImages: Image[];
  category: CategoryRef;
  product: {
    _id: string;
    id: string;
    name: string;
    image: Image;
    createdBy: string;
  };
  createdBy: UserRef;
  updatedBy: string;
  Reviews: any[]; // Consider creating a proper Review type
  createdAt: string;
  updatedAt: string;
}

export interface RelatedProduct extends Omit<Product, 'imageCover' | 'subImages'> {
  image: string;
}

export interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}
