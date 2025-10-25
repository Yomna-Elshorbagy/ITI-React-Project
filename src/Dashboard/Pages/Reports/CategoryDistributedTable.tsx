import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryStats } from "../../Apis/CategoryApis";
import type { ICategoryStats } from "../../DashBordInterfaces/categryInterfaces";

const CategoryDistributionTable: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<ICategoryStats, Error>({
    queryKey: ["categoryStats"],
    queryFn: getCategoryStats,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading category distribution...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading categories: {error?.message || "Unknown error"}
      </div>
    );
  }

  const totalProducts = data.productsPerCategory.reduce(
    (acc, c) => acc + c.count,
    0
  );

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text)] tracking-wide">
        🛒 Products per Category
      </h2>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Products</th>
              <th className="p-3 text-left font-semibold">Share</th>
            </tr>
          </thead>
          <tbody>
            {data.productsPerCategory.map((cat, idx) => (
              <tr
                key={cat.categoryName}
                className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                  idx % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                <td className="p-3 font-medium text-[var(--color-text)]">
                  {cat.categoryName}
                </td>
                <td className="p-3 font-semibold">{cat.count}</td>
                <td className="p-3 text-[var(--color-text-muted)]">
                  {((cat.count / totalProducts) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDistributionTable;
