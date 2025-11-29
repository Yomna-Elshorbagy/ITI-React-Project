import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "./reduxHooks";
import type {
  Review,
  ReviewsResponse,
  AddReviewResponse,
  DeleteReviewResponse,
} from "../Types/Review";
import { baseURL } from "../Constants/BaseUrls";

// Hook to get reviews for a product
export function useReviews(productId: string | undefined) {
  const { token } = useAppSelector((state) => state.auth);

  return useQuery<Review[], unknown, Review[], [string, string | undefined]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${baseURL}/reviews/productReviews/${productId}`,
          {
            headers: {
              authentication: `bearer ${token}`,
            },
          }
        );
        console.log("[API] GET reviews", response.data);
        return (response.data as ReviewsResponse).data;
      } catch (err) {
        console.error("[API] reviews error", err);
        throw err;
      }
    },
    enabled: Boolean(productId) && Boolean(token),
  });
}

// Hook to add a review
export function useAddReview() {
  const queryClient = useQueryClient();
  const { token } = useAppSelector((state) => state.auth);

  return useMutation<
    AddReviewResponse,
    unknown,
    { productId: string; comment: string; rate: string }
  >({
    mutationFn: async ({ productId, comment, rate }) => {
      try {
        const response = await axios.post(
          `${baseURL}/reviews/addReview`,
          {
            comment,
            rate,
            product: productId,
          },
          {
            headers: {
              authentication: `bearer ${token}`,
            },
          }
        );
        console.log("[API] POST review", response.data);
        return response.data as AddReviewResponse;
      } catch (err) {
        console.error("[API] add review error", err);
        throw err;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews for this product
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
    },
  });
}

// Hook to delete a review
export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { token } = useAppSelector((state) => state.auth);

  return useMutation<
    DeleteReviewResponse,
    unknown,
    { reviewId: string; productId: string }
  >({
    mutationFn: async ({ reviewId }) => {
      try {
        const response = await axios.delete(`${baseURL}/reviews/${reviewId}`, {
          headers: {
            authentication: `bearer ${token}`,
          },
        });
        console.log("[API] DELETE review", response.data);
        return response.data;
      } catch (err) {
        console.error("[API] delete review error", err);
        throw err;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews for this product
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
    },
  });
}
