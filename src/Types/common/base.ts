// Base interfaces for common entity properties

export interface BaseEntity {
  _id: string;
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Image {
  secure_url: string;
  public_id: string;
}

export interface UserReference {
  _id: string;
  id: string;
  userName: string;
  mobileNumber: string;
}
