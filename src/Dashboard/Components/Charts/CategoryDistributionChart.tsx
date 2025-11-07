import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCategoryStats } from "../../Apis/CategoryApis";
import type { ICategoryStats } from "../../DashBordInterfaces/categryInterfaces";

interface PieLabelProps {
  percent?: number;
  name?: string;
  value?: number;
}

const COLORS = [
  "var(--mist-300)",
  "var(--sage-500)",
  "var(--sand-200)",
  "var(--sky-300)",
  "var(--wood-100)",
  "var(--mist-500)",
];

export default function CategoryProductDistributionChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats: ICategoryStats = await getCategoryStats();
        const formatted = stats.productsPerCategory.map((c) => ({
          name: c.categoryName,
          value: c.count,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error loading category stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  return (
    <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface)] p-6 rounded-2xl elevate-soft elevate-hover transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)] header-font">
        🛒 Products per Category
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
