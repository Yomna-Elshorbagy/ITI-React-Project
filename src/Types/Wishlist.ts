export type WishlistItem = {
  _id: string;
  title?: string;
  price?: number;
  imageCover?: { secure_url: string };
  [key: string]: unknown;
  stock: number;
};

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
  justFetched: boolean;
}

export interface Wishlist {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}
