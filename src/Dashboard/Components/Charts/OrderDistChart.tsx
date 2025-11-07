import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getOrdersDistribution } from "../../Apis/OrderApis";

export default function OrdersDistributionChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders-distribution"],
    queryFn: getOrdersDistribution,
  });

  if (isLoading) return <p>Loading orders distribution...</p>;
  if (error) return <p>Error loading data</p>;

  if (!data || !data.length) return <p>No order data available</p>;

  return (
    <div className="bg-white dark:bg-[var(--color-surface)] p-6 rounded-xl shadow-md elevate-soft">
      <h3 className="text-[var(--color-text)] dark:text-[var(--color-text)] font-semibold text-lg mb-4 flex items-center gap-2">
        📦 Orders Distribution by Status
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="status"
            tick={{ fill: "var(--color-text-muted)" }}
            label={{
              value: "Order Status",
              position: "bottom",
              fill: "var(--color-text-muted)",
              dy: 15,
            }}
          />
          <YAxis
            tick={{ fill: "var(--color-text-muted)" }}
            label={{
              value: "Orders Count",
              angle: -90,
              position: "insideLeft",
              fill: "var(--color-text-muted)",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--color-success)"
            strokeWidth={3}
            dot={<Dot r={6} stroke="white" fill="var(--color-success)" />}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
