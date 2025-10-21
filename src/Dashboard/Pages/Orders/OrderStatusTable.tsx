import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../Apis/OrderApis";

interface StatusSummary {
  status: string;
  count: number;
  percentage: string;
}

const OrderStatusTable: React.FC = () => {
  const [data, setData] = useState<StatusSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data: orders } = await getAllOrders(1, 1000);
        const totalOrders = orders.length;
        setTotal(totalOrders);

        const statusCount = orders.reduce<Record<string, number>>(
          (acc, order) => {
            const key = order.status?.toLowerCase() || "pending";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          },
          {}
        );

        const summary = Object.entries(statusCount).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
          percentage: ((count / totalOrders) * 100).toFixed(1),
        }));

        setData(summary);
      } catch (err) {
        console.error("Error loading order summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading order summary...
      </div>
    );
  }

  const getColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text)] tracking-wide">
        Order Status Overview
      </h2>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Count</th>
              <th className="p-3 text-left font-semibold">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const percentNum = parseFloat(row.percentage);
              return (
                <tr
                  key={row.status}
                  className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <td className="p-3 font-medium">{row.status}</td>
                  <td className="p-3">{row.count}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{row.percentage}%</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${getColor(
                            percentNum
                          )} h-2 transition-all duration-500`}
                          style={{ width: `${percentNum}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
              <td className="p-3">TOTAL</td>
              <td className="p-3">{total}</td>
              <td className="p-3">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderStatusTable;
