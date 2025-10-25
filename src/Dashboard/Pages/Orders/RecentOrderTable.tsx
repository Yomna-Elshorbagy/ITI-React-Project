import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../Apis/OrderApis";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";

const RecentOrdersTable: React.FC = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<IOrder[], Error>({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const { data } = await getAllOrders(1, 9);
      return data.slice(-9).reverse();
    },
    staleTime: 1000 * 60 * 5, 
    // refetchOnWindowFocus: true, 
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-black";
      case "shipping":
      case "shipped":
        return "bg-cyan-500 text-white";
      case "canceled":
        return "bg-red-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading recent orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text)] tracking-wide">
        Recent Orders
      </h2>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Customer</th>
              <th className="p-3 text-left font-semibold">Total</th>
              <th className="p-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order._id}
                className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                  idx % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                <td className="p-3 text-[var(--color-text-muted)] font-medium">
                  {order._id.slice(-3)}
                </td>
                <td className="p-3">{order.fullName || "Unknown"}</td>
                <td className="p-3 font-medium">
                  {order.finalPrice.toFixed(2)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
