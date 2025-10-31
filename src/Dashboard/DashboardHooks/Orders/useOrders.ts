import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllOrders, getUserOrderCounts } from "../../Apis/OrderApis";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";

export const useOrders = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof getAllOrders>>
  >({
    queryKey: ["orders", page],
    queryFn: async () => await getAllOrders(page, 8),
  });

  const orders: IOrder[] = data?.data || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  };

  return {
    orders,
    page,
    totalPages: pagination.totalPages,
    loading: isLoading,
    error: isError,
    setPage,
    refetch,
  };
};

export const useUserOrderCounts = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userOrderCounts"],
    queryFn: getUserOrderCounts,
  });

  return { data, isLoading, isError, refetch };
};