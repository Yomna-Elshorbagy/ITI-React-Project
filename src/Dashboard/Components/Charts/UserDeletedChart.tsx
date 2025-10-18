import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDeletedUsersAnalysis } from "../../DashboardHooks/useDeletedUsersAnalysis";

export default function DeletedUsersChart() {
  const { data, loading } = useDeletedUsersAnalysis();
  if (loading) return <p>Loading...</p>;
  console.log(data);

  if (!data?.history?.length) return <p>No deleted users data</p>;

  const chartData = data.history.map((item) => ({
    date: item._id,
    count: item.count,
  }));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Deleted Users Over Time</h2>
      <LineChart width={300} height={220} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#6ba368" />
      </LineChart>
    </div>
  );
}
