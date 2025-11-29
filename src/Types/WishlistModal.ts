import type { WishlistItem } from "./Wishlist";
import type { BaseState } from "./Common";

export interface WishlistModalProps {
  open: boolean;
  onClose: () => void;
  onAddToCart?: (id: string) => void;
}

export interface WishlistStateFromStore extends BaseState<WishlistItem> {}
