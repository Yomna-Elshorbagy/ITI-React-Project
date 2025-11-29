import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IUser } from "../../DashBordInterfaces/userInterfaces";
import { useUsers } from "../../DashboardHooks/Users/useUseres";
import { baseURL } from "../../../Constants/BaseUrls";

const UserStatusOverview: React.FC = () => {
  const { loading } = useUsers();

  const { data: allUsers = [], isLoading } = useQuery<IUser[]>({
    queryKey: ["users-status"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const allData: IUser[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const res = await axios.get(
          `${baseURL}/user/allUsers?page=${page}&size=10`,
          {
            headers: {
              authentication: `bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const usersData = (res.data.data || []).filter(
          (u: IUser) => u.role?.toLowerCase() === "user"
        );

        allData.push(...usersData);
        totalPages = res.data.meta?.totalPages || 1;
        page++;
      } while (page <= totalPages);

      return allData;
    },
  });

  const finalLoading = loading || isLoading;

  if (finalLoading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading users status data...
      </div>
    );
  }

  const active = allUsers.filter((u) => u.status?.toLowerCase() === "verified");
  const pending = allUsers.filter((u) => u.status?.toLowerCase() === "pending");
  const deleted = allUsers.filter((u) => u.status?.toLowerCase() === "deleted");
  const blocked = allUsers.filter((u) => u.status?.toLowerCase() === "blocked");

  const total = allUsers.length;
  const getPercent = (count: number) =>
    total ? ((count / total) * 100).toFixed(1) : "0";

  (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "deleted":
        return "bg-red-500 text-white";
      case "blocked":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text)] tracking-wide">
        Users Status Overview
      </h2>

      <div className="space-y-4 mb-6">
        {[
          { label: "Active", count: active.length, color: "bg-green-500" },
          { label: "Pending", count: pending.length, color: "bg-yellow-500" },
          { label: "Deleted", count: deleted.length, color: "bg-red-500" },
          { label: "Blocked", count: blocked.length, color: "bg-blue-500" },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{s.label} Users</span>
              <span>
                {s.count} ({getPercent(s.count)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`${s.color} h-3 transition-all duration-700`}
                style={{ width: `${getPercent(s.count)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* === Users Table === */}
      {/* <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">#</th>
              <th className="p-3 text-left font-semibold">User Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, i) => (
              <tr
                key={user._id}
                className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                  i % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                <td className="p-3 font-medium">{i + 1}</td>
                <td className="p-3">{user.userName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getColor(
                      user.status?.toLowerCase() || "unknown"
                    )}`}
                  >
                    {user.status || "Unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default UserStatusOverview;
