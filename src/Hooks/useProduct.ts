import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../Types";

type UseProductResult = {
  data: Product | undefined;
  isLoading: boolean;
  error: unknown;
};

export function useProduct(productId: string | undefined): UseProductResult {
  const query = useQuery<
    Product,
    unknown,
    Product,
    [string, string | undefined]
  >({
    queryKey: ["productDetails", productId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://iti-react-backend.vercel.app/products/${productId}`
        );
        console.log("[API] GET product details", response.data);
        return (response.data as { message: string; data: Product }).data;
      } catch (err) {
        console.error("[API] product details error", err);
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
