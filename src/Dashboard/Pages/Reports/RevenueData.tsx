import React, { useEffect, useState } from "react";
import {
  getRevenuePerMonth,
  exportOrdersToCSV,
  exportOrdersToPDF,
} from "../../Apis/OrderApis";

interface RevenueData {
  _id: { year: number; month: number };
  totalRevenue: number;
  totalOrders: number;
}

export default function RevenueTable() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [filteredData, setFilteredData] = useState<RevenueData[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const data = await getRevenuePerMonth();
      setRevenueData(data);
      setFilteredData(data);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) return setFilteredData(revenueData);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = revenueData.filter((item) => {
      const date = new Date(item._id.year, item._id.month - 1);
      return date >= start && date <= end;
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(revenueData);
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-pulse">
        Loading revenue data...
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)] tracking-wide">
          Monthly Revenue
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-[var(--color-border)] bg-transparent p-2 rounded-md text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-[var(--color-border)] bg-transparent p-2 rounded-md text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            onClick={handleFilter}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-200"
          >
            Filter
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Reset
          </button>

          <button
            onClick={exportOrdersToCSV}
            className="bg-[var(--color-success)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-200"
          >
            <i className="fa-solid fa-file-csv mr-2"></i> Export CSV
          </button>
          <button
            onClick={exportOrdersToPDF}
            className="bg-[var(--color-error)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-all duration-200"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left font-semibold">Month-Year</th>
              <th className="p-3 text-left font-semibold">Total Orders</th>
              <th className="p-3 text-left font-semibold">Total Income ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <td className="p-3 font-medium">
                    {months[item._id.month]} {item._id.year}
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)] font-medium hover:text-white ">
                    {item.totalOrders}
                  </td>
                  <td className="p-3 font-semibold text-green-600 dark:text-green-400">
                    ${item.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                  colSpan={3}
                >
                  No data found for selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
