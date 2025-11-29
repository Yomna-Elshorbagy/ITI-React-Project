// Common types used across the application

export interface Image {
  secure_url: string;
  public_id: string;
}

export interface CategoryRef {
  _id: string;
  name: string;
}

export interface UserRef {
  _id: string;
  id: string;
  userName: string;
  mobileNumber?: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface BaseState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}
