import  { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getRevenueDistribution } from "../../Apis/CategoryApis";

interface PieLabelProps {
  percent?: number;
  name?: string;
  value?: number;
}

const COLORS = [
  "var(--sky-200)",
  "var(--sage-500)",
  "var(--mist-300)",
  "var(--sand-300)",
  "var(--wood-200)",
  "var(--sky-400)",
];

export default function RevenueByCategoryChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await getRevenueDistribution();
        const formatted = res.map((r: any) => ({
          name: r.category,
          value: r.totalRevenue,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error fetching revenue distribution:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  return (
    <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface)] p-6 rounded-2xl elevate-soft elevate-hover transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)] header-font">
        📊 Revenue Distribution by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label={({ percent }: PieLabelProps) =>
              percent ? `${(percent * 100).toFixed(1)}%` : ""
            }
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
