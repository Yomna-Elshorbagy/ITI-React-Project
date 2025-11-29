import type { BaseState, Image } from './Common';

export interface WishlistItem {
  _id: string;
  title?: string;
  price?: number;
  imageCover?: Image;
  stock?: number;
  [key: string]: unknown;
}

export interface WishlistState extends BaseState<WishlistItem> {
  fetched: boolean;
  justFetched: boolean;
}
