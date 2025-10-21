import React from "react";
import { FaEye, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";

interface OrderTableProps {
  orders: IOrder[];
  onView: (order: IOrder) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onView,
  onDelete,
  onUpdateStatus,
}) => {
  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:shadow-lg transition-all">
      <table className="min-w-full text-sm">
        <thead>
          <tr
            className="text-white uppercase tracking-wide"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <th className="py-3 px-4 text-left">Customer</th>
            <th className="py-3 px-4 text-left">Phone</th>
            <th className="py-3 px-4 text-left">Payment</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Total</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr
              key={order._id}
              className={`transition-all border-b border-[var(--color-border)] ${
                i % 2 === 0
                  ? "bg-[var(--sage-300)]/60"
                  : "bg-[var(--sage-200)]/60"
              } hover:bg-[var(--color-border)]/80`}
            >
              <td className="py-3 px-4 font-medium">
                {order.fullName || "Unknown"}
              </td>
              <td className="py-3 px-4">{order.phone}</td>
              <td className="py-3 px-4">{order.payment}</td>
              <td
                className={`py-3 px-4 font-semibold text-center rounded-lg ${
                  order.status === "placed"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </td>
              <td className="py-3 px-4 font-semibold text-[var(--color-text)]">
                {order.finalPrice} EGP
              </td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <button
                  className="p-2 rounded-md text-white"
                  style={{ backgroundColor: "var(--color-success)" }}
                  onClick={() => onView(order)}
                  title="View Order"
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 rounded-md text-white"
                  style={{ backgroundColor: "var(--color-primary-hover)" }}
                  onClick={() => onUpdateStatus(order._id, "delivered")}
                  title="Mark Delivered"
                >
                  <FaCheckCircle />
                </button>
                <button
                  className="p-2 rounded-md text-white"
                  style={{ backgroundColor: "var(--color-error)" }}
                  onClick={() => onDelete(order._id)}
                  title="Delete Order"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
