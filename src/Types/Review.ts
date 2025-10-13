export interface Review {
  _id: string;
  comment: string;
  rate: number;
  user: {
    _id: string;
    userName: string;
    id: string;
  };
  product: {
    _id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

export interface AddReviewResponse {
  message: string;
  success: boolean;
  data: {
    avgRating: number;
    rate: string;
  };
}

export interface DeleteReviewResponse {
  message: string;
  success: boolean;
}

