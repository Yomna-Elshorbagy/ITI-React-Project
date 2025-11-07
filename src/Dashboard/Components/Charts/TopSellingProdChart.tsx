import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getTopSellingProducts } from "../../Apis/Products";

interface TopProduct {
  title: string;
  totalSold: number;
}

export default function TopSellingProductsChart() {
  const {
    data: topProducts,
    isLoading,
    isError,
    error,
  } = useQuery<TopProduct[]>({
    queryKey: ["topSellingProducts"],
    queryFn: getTopSellingProducts,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
        <p className="text-gray-600 dark:text-gray-300">Loading chart...</p>
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
        <p className="text-red-500">Failed to load top-selling products.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        🏆 Top-Selling Products
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={topProducts || []}
          margin={{ top: 10, right: 20, bottom: 10, left: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis type="number" />
          <YAxis dataKey="title" type="category" width={150} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface, white)",
              borderColor: "#ddd",
              borderRadius: "0.5rem",
              color: "var(--color-text, #333)",
            }}
          />
          <Legend />
          <Bar
            dataKey="totalSold"
            name="Units Sold"
            fill="#60a5fa"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
