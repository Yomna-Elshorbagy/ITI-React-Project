import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaDesktop,
  FaGlobe,
  FaClock,
  FaNetworkWired,
  FaSignInAlt,
} from "react-icons/fa";
import type { LoginActivity } from "../../Types/LoginActivity";
import { baseURL } from "../../Constants/BaseUrls";

export default function LoginActivityTab() {
  const [activity, setActivity] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseURL}/auth/activity?page=${page}&size=5`, {
        headers: { authentication: `bearer ${token}` },
      })
      .then((res) => {
        setActivity(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FaSignInAlt className="text-[var(--color-primary)]" /> Login Activity
      </h3>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : activity.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <FaDesktop
            size={40}
            className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
          />
          <p>No login activity found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white text-left">
                  <th className="py-3 px-4 font-semibold">Device</th>
                  <th className="py-3 px-4 font-semibold">Browser</th>
                  <th className="py-3 px-4 font-semibold">IP Address</th>
                  <th className="py-3 px-4 font-semibold">Login Time</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900">
                {activity.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <FaDesktop
                          className="text-[var(--color-primary)]"
                          title="Device"
                        />
                        {a.device || "Unknown Device"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <FaGlobe
                          className="text-[var(--color-primary)]"
                          title="Browser"
                        />
                        {a.browser || "Unknown Browser"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <FaNetworkWired
                          className="text-[var(--color-primary)]"
                          title="IP"
                        />
                        {a.ip}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaClock
                          className="text-[var(--color-primary)]"
                          title="Time"
                        />
                        {new Date(a.loggedAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-md border transition-all ${
                  page === i + 1
                    ? "text-white border-transparent"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                style={
                  page === i + 1
                    ? { backgroundColor: "var(--color-primary)" }
                    : undefined
                }
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
