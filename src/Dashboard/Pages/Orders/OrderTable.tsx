import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";

interface OrderTableProps {
  orders: IOrder[];
  onView: (order: IOrder) => void;
  onDelete: (id: string) => void;
  onEdit: (order: IOrder) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onView,
  onDelete,
  onEdit,
}) => {
  // 🎨 Status color logic
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "placed":
        return "bg-blue-200 text-blue-800";
      case "shipping":
        return "bg-sky-200 text-sky-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "canceled":
        return "bg-red-200 text-red-800";
      case "refund":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl elevate-soft border border-[var(--color-border)] transition-all duration-500 ease-in-out hover:shadow-lg">
      <table className="min-w-full text-sm rounded-xl overflow-hidden">
        <thead>
          <tr
            className="text-white uppercase tracking-wide"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <th className="py-3 px-4 text-left font-semibold">Customer</th>
            <th className="py-3 px-4 text-left font-semibold">Phone</th>
            <th className="py-3 px-4 text-left font-semibold">Payment</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">Total</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order._id}
              className={`transition-all duration-300 ease-in-out border-b border-[var(--color-border)] ${
                index % 2 === 0
                  ? "bg-[var(--sage-400)]/60"
                  : "bg-[var(--sage-300)]/60"
              } hover:bg-[var(--color-border)]/80 hover:scale-[1.01] hover:shadow-md`}
            >
              <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                {order.fullName || "Unknown"}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                {order.phone}
              </td>

              <td className="py-3 px-4 capitalize text-[var(--color-text-muted)]">
                {order.payment}
              </td>

              <td className="py-3 px-4 capitalize">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>

              <td className="py-3 px-4 font-semibold text-[var(--color-text)]">
                {order.finalPrice?.toLocaleString() || 0} EGP
              </td>

              <td className="py-3 px-4 flex justify-center gap-2">
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-success)" }}
                  title="View Order"
                  onClick={() => onView(order)}
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-primary-hover)" }}
                  title="Edit Order"
                  onClick={() => onEdit(order)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-error)" }}
                  title="Delete Order"
                  onClick={() => onDelete(order._id)}
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
