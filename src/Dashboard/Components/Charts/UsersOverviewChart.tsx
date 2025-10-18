import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useUsersOverview } from "../../DashboardHooks/useUsersOverview";

export default function UsersOverviewChart() {
  const { data, loading } = useUsersOverview();

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found.</p>;

  const chartData = [
    { name: "Pending", value: data.pendingUsers },
    { name: "Verified", value: data.verifiedUsers },
    { name: "Blocked", value: data.blockedUsers },
    { name: "Deleted", value: data.deletedUsers },
  ];

  const COLORS = [
    getComputedStyle(document.documentElement).getPropertyValue(
      "--color-warning"
    ) || "#eadca6",
    getComputedStyle(document.documentElement).getPropertyValue(
      "--color-success"
    ) || "#6ba368",
    getComputedStyle(document.documentElement).getPropertyValue(
      "--color-error"
    ) || "#c97c5d",
    getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text-muted"
    ) || "#3a5a40",
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
        Users Overview
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label
          >
            {chartData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
