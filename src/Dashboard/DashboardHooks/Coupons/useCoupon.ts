import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "../../Apis/CouponApis";
import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";

export const useCoupons = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const { data, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof getCoupons>>
  >({
    queryKey: ["coupons", page, search],
    queryFn: async () => await getCoupons(page, 8, search),
  });

  const coupons: ICoupon[] = data?.data || [];
  const pagination = data?.metadata || {
    currentPage: 1,
    numberOfPages: 1,
    limit: 8,
    prevPage: null,
    nextPage: null,
  };

  return {
    coupons,
    page,
    search,
    totalPages: pagination.numberOfPages,
    loading: isLoading,
    error: isError,
    setPage,
    setSearch,
    refetch,
  };
};
