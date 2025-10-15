import React, { useState } from "react";
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
      const res = await axios.get(
        "https://iti-react-backend.vercel.app/order",
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
      return res.data.data;
    },
    enabled: !!token,
  });

  if (isLoading) return <LoaderPage />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load your orders.
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="text-center text-gray-500 py-10">
        <FaBoxOpen size={40} className="mx-auto mb-3 text-gray-400" />
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
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h3>

      {currentOrders.map((order: any) => (
        <div
          key={order._id}
          className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <FaBoxOpen /> Order #{order._id.slice(-6).toUpperCase()}
            </h4>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                order.status === "placed"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "shipped"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-700" /> {order.address}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-green-700" /> {order.phone}
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-700" /> Payment:{" "}
              <span className="font-medium">{order.payment}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaClock className="text-green-700" />{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-800 mb-3">Products:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {order.products.map((p: any) => (
                <div
                  key={p._id}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <p className="font-semibold text-gray-800">{p.title}</p>
                  <p className="text-sm text-gray-600">
                    Qty: <span className="font-medium">{p.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Price:{" "}
                    <span className="font-medium">
                      {p.finalPrice.toLocaleString()} EGP
                    </span>
                  </p>
                  {p.discount > 0 && (
                    <p className="text-xs text-green-700 font-medium">
                      Discount: {p.discount}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-right">
            <p className="text-lg font-semibold text-gray-800">
              Total:{" "}
              <span className="text-green-700">
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
          className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-2 rounded-md border ${
              currentPage === i + 1
                ? "bg-green-700 text-white border-green-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
