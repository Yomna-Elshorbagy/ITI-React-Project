import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  getProductReviewsWithContacts,
  contactReviewUser,
} from "../../Apis/ReviesApi";
import toast from "react-hot-toast";
import type { IReview } from "../../DashBordInterfaces/ReviewsInterfaces";

export interface IUseProductReviews {
  reviews: IReview[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
  contactUser: (reviewId: string, subject: string, message: string) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pagesCount: number;
  productInfo?: object;
}

export const useProductReviews = (productId: string): IUseProductReviews => {
  const [page, setPage] = useState<number>(1);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<Awaited<ReturnType<typeof getProductReviewsWithContacts>>>({
    queryKey: ["productReviews", productId, page],
    queryFn: async () => await getProductReviewsWithContacts(productId),
    enabled: !!productId,
  });

  const reviews = data || [];
  const pagesCount = 1; 

  const mutation = useMutation({
    mutationFn: ({
      reviewId,
      subject,
      message,
    }: {
      reviewId: string;
      subject: string;
      message: string;
    }) => contactReviewUser(reviewId, subject, message),
    onSuccess: (data) => {
      toast.success(data.message || "Email sent successfully!");
      refetch();
    },
    onError: () => toast.error("Failed to send email."),
  });

  const contactUser = (reviewId: string, subject: string, message: string) => {
    mutation.mutate({ reviewId, subject, message });
  };

  return {
    reviews,
    loading: isLoading,
    error: isError,
    refetch,
    contactUser,
    page,
    setPage,
    pagesCount,
  };
};
