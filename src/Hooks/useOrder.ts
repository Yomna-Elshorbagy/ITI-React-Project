import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "./reduxHooks";
import type { CreateOrderInput, Order } from "../Types/Order";
import { baseURL } from "../Constants/BaseUrls";

export function useCreateOrder() {
  const { token } = useAppSelector((s) => s.auth);
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; success: boolean; data: Order },
    unknown,
    CreateOrderInput
  >({
    mutationFn: async (body: CreateOrderInput) => {
      const res = await axios.post(`${baseURL}/order`, body, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate cart and orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

export function useUserOrders() {
  const { token } = useAppSelector((s) => s.auth);
  return useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/order`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data as Order[];
    },
    enabled: Boolean(token),
  });
}
