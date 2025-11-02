import { useEffect, useState } from "react";
import { FaBell, FaClock, FaDesktop, FaTruck } from "react-icons/fa";
import axios from "axios";
import type { LoginActivity } from "../../Types/LoginActivity";
import type { IOrder } from "../../Dashboard/DashBordInterfaces/OrderInterfaces";

export default function NotificationBell() {
  const [activity, setActivity] = useState<LoginActivity[]>([]);
  const [orderUpdates, setOrderUpdates] = useState<
    { id: string; oldStatus: string; newStatus: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("https://iti-react-backend.vercel.app/auth/activity?page=1&size=5", {
        headers: { authentication: `bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data || [];
        setActivity(data);

        const lastSeen = localStorage.getItem("lastSeenActivityId");
        if (data[0]?._id && data[0]._id !== lastSeen) {
          setHasNew(true);
        }
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "https://iti-react-backend.vercel.app/order/",
          { headers: { authentication: `bearer ${token}` } }
        );

        const orders: IOrder[] = data.data || [];
        const stored = localStorage.getItem("ordersStatus");
        const prevData: Record<string, string> = stored ? JSON.parse(stored) : {};

        // ===> detect changed orders
        const changedOrders = orders
          .filter((o) => prevData[o._id] && prevData[o._id] !== o.status)
          .map((o) => ({
            id: o._id,
            oldStatus: prevData[o._id],
            newStatus: o.status,
          }));

        if (changedOrders.length > 0) {
          console.log("🔔 Detected changed orders:", changedOrders);
          setOrderUpdates((prev) => [...prev, ...changedOrders]);
          setHasNew(true);
        }

        // ===> update storage for next check
        const newMap: Record<string, string> = {};
        orders.forEach((o) => (newMap[o._id] = o.status));
        localStorage.setItem("ordersStatus", JSON.stringify(newMap));
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) {
      if (activity[0]?._id) {
        localStorage.setItem("lastSeenActivityId", activity[0]._id);
      }
      setHasNew(false);
    }
  };

  const hasNotifications =
    activity.length > 0 || orderUpdates.length > 0;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={handleToggle}
        className="relative text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition"
      >
        <FaBell size={22} />
        {hasNew && (
          <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Notifications
            </h4>
          </div>

          {!hasNotifications ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No new notifications
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
              {/* Order updates */}
              {orderUpdates.map((item, i) => (
                <li
                  key={`${item.id}-${i}`}
                  className="p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <FaTruck
                    className="text-[var(--color-primary)] mt-1"
                    size={18}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Order status updated
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Order #{item.id.slice(-5)} changed from{" "}
                      <span className="font-semibold text-yellow-500">
                        {item.oldStatus}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-green-500">
                        {item.newStatus}
                      </span>
                    </p>
                  </div>
                </li>
              ))}

              {/* Login activities */}
              {activity.map((item) => (
                <li
                  key={item._id}
                  className="p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <FaDesktop
                    className="text-[var(--color-primary)] mt-1"
                    size={18}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.device || "Unknown Device"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.browser || "Unknown Browser"} — {item.ip}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <FaClock className="mr-1 text-[var(--color-primary)]" />
                      {new Date(item.loggedAt).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="text-center p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => (window.location.hash = "#activity")}
              className="text-[var(--color-primary)] hover:underline text-sm font-medium"
            >
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
