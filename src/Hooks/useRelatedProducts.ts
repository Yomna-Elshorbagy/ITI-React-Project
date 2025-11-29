import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type {
  RelatedProduct,
  RelatedProductsResponse,
} from "../Types/RelatedProduct";
import { baseURL } from "../Constants/BaseUrls";

type UseRelatedResult = {
  data: RelatedProduct[] | undefined;
  isLoading: boolean;
  error: unknown;
};

export function useRelatedProducts(
  productId: string | undefined
): UseRelatedResult {
  const query = useQuery<
    RelatedProduct[],
    unknown,
    RelatedProduct[],
    [string, string | undefined]
  >({
    queryKey: ["relatedProducts", productId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${baseURL}/products/related/${productId}`
        );
        console.log("[API] GET related products", response.data);
        return (response.data as RelatedProductsResponse).relatedProducts;
      } catch (err) {
        console.error("[API] related products error", err);
        // Return empty array instead of throwing error
        return [];
      }
    },
    enabled: Boolean(productId),
    retry: false, // Don't retry on 404 errors
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
