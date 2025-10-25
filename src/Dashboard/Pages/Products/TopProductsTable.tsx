import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../Apis/OrderApis";

interface ProductStats {
  name: string;
  price: number;
  salesCount: number;
  totalRevenue: number;
}

const TopProductsTable: React.FC = () => {
  const {
    data: topProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery<ProductStats[], Error>({
    queryKey: ["topProducts"],
    queryFn: async () => {
      const { data: orders } = await getAllOrders(1, 1000);

      const productMap = new Map<string, ProductStats>();

      for (const order of orders) {
        if (order.products && Array.isArray(order.products)) {
          for (const p of order.products) {
            const name = p.title || "Unknown";
            const price = Number(p.price) || 0;
            const qty = Number(p.quantity) || 0;

            if (!productMap.has(name)) {
              productMap.set(name, {
                name,
                price,
                salesCount: qty,
                totalRevenue: qty * price,
              });
            } else {
              const existing = productMap.get(name)!;
              existing.salesCount += qty;
              existing.totalRevenue += qty * price;
            }
          }
        }
      }

      // Sort by sales count and take top 5
      return Array.from(productMap.values())
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5);
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: true, // refetch when window gains focus
  });

  const maxSales = Math.max(...topProducts.map((p) => p.salesCount), 1);

  const getColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading top selling products...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text)] tracking-wide">
        Top 5 Selling Products
      </h2>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">#</th>
              <th className="p-3 text-left font-semibold">Product Name</th>
              <th className="p-3 text-left font-semibold">Sales Count</th>
              <th className="p-3 text-left font-semibold">Price (EGP)</th>
              <th className="p-3 text-left font-semibold">
                Total Revenue (EGP)
              </th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, i) => {
              const percent = (p.salesCount / maxSales) * 100;
              return (
                <tr
                  key={p.name}
                  className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                    i % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{p.salesCount}</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${getColor(
                            percent
                          )} h-2 transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{p.price.toFixed(2)}</td>
                  <td className="p-3 font-medium">
                    {p.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsTable;
