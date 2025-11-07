import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
} from "react-icons/fa";

export default function UserOrders() {
  const token = localStorage.getItem("accessToken");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await axios.get("https://iti-react-backend.vercel.app/order", {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  if (isLoading) return <LoaderPage />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        Failed to load your orders.
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        <FaBoxOpen
          size={40}
          className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
        />
        <p>No orders found yet.</p>
      </div>
    );

  const totalPages = Math.ceil(data.length / ordersPerPage);
  const currentOrders = data.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        My Orders
      </h3>

      {currentOrders.map((order: any) => (
        <div
          key={order._id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h4
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: "var(--color-primary)" }}
            >
              <FaBoxOpen /> Order #{order._id}
            </h4>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                order.status === "placed"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  : order.status === "shipped"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                  : order.status === "delivered"
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              }`}
              style={
                order.status === "delivered"
                  ? { color: "var(--color-primary)" }
                  : undefined
              }
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 mb-4">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt style={{ color: "var(--color-primary)" }} />{" "}
              {order.address}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone style={{ color: "var(--color-primary)" }} />{" "}
              {order.phone}
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyBillWave style={{ color: "var(--color-primary)" }} />{" "}
              Payment: <span className="font-medium">{order.payment}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaClock style={{ color: "var(--color-primary)" }} />{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              Products:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {order.products.map((p: any) => (
                <div
                  key={p._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--color-surface)] dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  {p.productId.imageCover?.secure_url && (
                    <img
                      src={p.productId.imageCover.secure_url}
                      alt={p.title}
                      className="w-full h-25 object-cover rounded-md mb-3"
                    />
                  )}

                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {p.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Qty: <span className="font-medium">{p.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Price:{" "}
                    <span className="font-medium">
                      {p.finalPrice.toLocaleString()} EGP
                    </span>
                  </p>
                  {p.discount > 0 && (
                    <p
                      className="text-xs font-medium"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Discount: {p.discount}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-right">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Total:{" "}
              <span style={{ color: "var(--color-primary)" }}>
                {order.finalPrice.toLocaleString()} EGP
              </span>
            </p>
          </div>
        </div>
      ))}

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-2 rounded-md border transition-all ${
              currentPage === i + 1
                ? "text-white border-transparent"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            style={
              currentPage === i + 1
                ? { backgroundColor: "var(--color-primary)" }
                : undefined
            }
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
