import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { RelatedProduct } from "../Types/Prooduct";

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
          `https://iti-react-backend.vercel.app/products//products/related/${productId}`
        );
        console.log("[API] GET related products", response.data);
        return (response.data as { data: RelatedProduct[] }).data;
      } catch (err) {
        console.error("[API] related products error", err);
        throw err;
      }
    },
    enabled: Boolean(productId),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
