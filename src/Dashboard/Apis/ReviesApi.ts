import axios from "axios";
import type { IReview } from "../DashBordInterfaces/ReviewsInterfaces";

const BASE_URL = "http://localhost:3000/reviews";
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getProductReviewsWithContacts = async (
  productId: string
): Promise<IReview[]> => {
  const { data } = await axios.get(`${BASE_URL}/with-contacts/${productId}`, {
    headers,
  });
  return data.data;
};

export const contactReviewUser = async (
  reviewId: string,
  subject: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axios.post(
    `${BASE_URL}/contact-user/${reviewId}`,
    { subject, message },
    { headers }
  );
  return data;
};

export const getAllReviews = async (page: number = 1, size: number = 10) => {
  const { data } = await axios.get(`${BASE_URL}/all`, {
    headers,
    params: { page, size },
  });
  return data;
};
