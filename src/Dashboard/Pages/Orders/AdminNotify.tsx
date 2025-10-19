import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const OrderNotificationBell: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [open, setOpen] = useState(false);
  const lastIdsRef = useRef<string[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://iti-react-backend.vercel.app/order/allorders",
          {
            headers: { authentication: `bearer ${token}` },
          }
        );
console.log(res.data.data);

        const data = res.data.data || [];

        const newOnes = data.filter(
          (order: any) => !lastIdsRef.current.includes(order._id)
        );

        if (newOnes.length > 0 && lastIdsRef.current.length > 0) {
          setHasNew(true);
        }

        lastIdsRef.current = data.map((order: any) => order._id);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setHasNew(false);
    setOpen(!open);
  };

  const latestOrders = orders
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-[var(--color-accent)] transition"
      >
        <Bell size={20} />
        {hasNew && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
          <p className="font-semibold mb-2 text-gray-800 dark:text-white flex items-center gap-1">
            🛒 New Orders
          </p>
          <ul className="max-h-64 overflow-y-auto">
            {latestOrders.length > 0 ? (
              latestOrders.map((order) => (
                <li
                  key={order._id}
                  className="border-b border-gray-200 dark:border-gray-700 py-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <strong>{order.fullName || "Unknown User"}</strong> placed an order
                  <br />
                  <small>
                    Total: ${order.finalPrice || 0} —{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </small>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 text-center">
                No recent orders
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderNotificationBell;
