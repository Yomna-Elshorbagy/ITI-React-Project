import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useDemographics } from "../../DashboardHooks/Users/useDemographics";

export default function DemographicsChart() {
  const { data, loading } = useDemographics();

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No demographic data</p>;
  console.log(data);

  const gender = data.data.gender ?? {};
  const roles = data.data.roles ?? {};

  const genderData = Object.entries(gender).map(([name, value]) => ({
    name,
    value,
  }));

  Object.entries(roles).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <h3 className="font-medium mb-2">Gender Distribution</h3>
        <BarChart width={300} height={250} data={genderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#dad7cd" />
        </BarChart>
      </div>

      {/* <div>
        <h3 className="font-medium mb-2">Role Distribution</h3>
        <BarChart width={300} height={250} data={roleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#a3b18a" />
        </BarChart>
      </div> */}
    </div>
  );
}
