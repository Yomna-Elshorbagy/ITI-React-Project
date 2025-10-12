export type CartProduct = {
  _id: string;
  productId: null | {
    _id: string;
    title: string;
    price: number;
    finalPrice?: number;
    imageCover?: { secure_url: string };
  };
  price: number;
  quantity: number;
  category: null |{
    name:string
  }
};
