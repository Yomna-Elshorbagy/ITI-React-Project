import type { BaseEntity, Image, UserReference } from '../common/base';

export interface Product extends BaseEntity {
  title: string;
  description: string;
  price: number;
  finalPrice: number;
  discount: number;
  stock: number;
  rate: number;
  imageCover: Image;
  subImages: Image[];
  category: {
    _id: string;
    name: string;
  };
  product: {
    _id: string;
    id: string;
    name: string;
    image: Image;
    createdBy: string;
  };
  createdBy: UserReference;
  updatedBy: string;
  Reviews: any[];
}

export interface ProductCardProps {
  product: Product;
  onClose: () => void;
  isOpen: boolean;
}
