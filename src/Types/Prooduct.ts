export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: { _id: string; name: string };
  images: string[];
  ratingsAverage: number;
}

export interface RelatedProduct extends Product {
  image: string;
}
