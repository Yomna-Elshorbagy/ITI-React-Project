export interface Wishlist {
  items: Array<{
    _id: string;
    title?: string;
    price?: number;
    imageCover?: { secure_url: string };
  }>;
  loading: boolean;
  error: string | null;
}