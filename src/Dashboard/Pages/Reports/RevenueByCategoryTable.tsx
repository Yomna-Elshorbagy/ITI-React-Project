import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getRevenueDistribution } from "../../Apis/CategoryApis";

interface RevenueCategory {
  category: string;
  totalRevenue: number;
}

const RevenueByCategoryTable: React.FC = () => {
  const {
    data: revenueData = [],
    isLoading,
    isError,
    error,
  } = useQuery<RevenueCategory[], Error>({
    queryKey: ["revenueByCategory"],
    queryFn: async () => {
      const res = await getRevenueDistribution();
      return res;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading revenue data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading revenue: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text)] tracking-wide">
        💰 Revenue by Category
      </h2>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">#</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Total Revenue ($)</th>
              <th className="p-3 text-left font-semibold">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const total = revenueData.reduce(
                (sum, r) => sum + r.totalRevenue,
                0
              );

              return revenueData.map((row, idx) => (
                <tr
                  key={row.category}
                  className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <td className="p-3 font-medium text-[var(--color-text-muted)]">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-semibold">{row.category}</td>
                  <td className="p-3 font-medium">
                    ${row.totalRevenue.toFixed(2)}
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)]">
                    {((row.totalRevenue / total) * 100).toFixed(1)}%
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueByCategoryTable;
