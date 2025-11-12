import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Order } from "../Types";

export const useOrderTracking = (orderId: string) => {
  const token = localStorage.getItem("accessToken");

  return useQuery<Order>({
    queryKey: ["orderTracking", orderId],
    queryFn: async (): Promise<Order> => {
      const res = await axios.get<{ data: Order }>(
        `https://iti-react-backend.vercel.app/order/${orderId}`,
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
      return res.data.data;
    },
    enabled: !!orderId,
  });
};
