import { useEffect, useState } from "react";
import { getRevenuePerMonth } from "../../Apis/OrderApis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RevenueData {
  _id: { year: number; month: number };
  totalRevenue: number;
  totalOrders: number;
}

export default function TotalIncomeAnalysis() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    const data = await getRevenuePerMonth();
    setRevenueData(data);
  };

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = revenueData.map((item) => ({
    name: `${months[item._id.month]} ${item._id.year}`,
    revenue: item.totalRevenue,
    orders: item.totalOrders,
  }));

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
          💰 Total Income per Month
        </h2>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
