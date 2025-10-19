import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProducts } from "../../Apis/Products";
import type { IUseProducts } from "../../DashBordInterfaces/ProductsInterfaces";

export const useProducts = (): IUseProducts => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof getProducts>>
  >({
    queryKey: ["products", page],
    queryFn: async () => await getProducts(page, 8),
  });

  const products = data?.data || [];
  const pagesCount = data?.metadata?.numberOfPages || 1;

  return {
    products,
    page,
    pagesCount,
    loading: isLoading,
    error: isError,
    setPage,
    refetch,
  };
};
