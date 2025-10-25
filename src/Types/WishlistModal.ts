import type { WishlistItem } from "./Wishlist";

export interface WishlistModalProps {
  open: boolean;
  onClose: () => void;
  onAddToCart?: (id: string) => void;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface WishlistStateFromStore {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}
