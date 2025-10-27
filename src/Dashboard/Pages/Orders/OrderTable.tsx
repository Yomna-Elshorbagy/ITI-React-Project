import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBan,
  FaSyncAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../Apis/OrderApis";
import type { OrderTableProps } from "../../DashBordInterfaces/OrderInterfaces";
import StatusUpdateModal from "../../../Shared/StatusModel/StatusModel";
const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onView,
  onDelete,
  onSoftDelete,
  onEdit,
  onUpdateStatus,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const openModal = (id: string, currentStatus: string) => {
    setSelectedOrderId(id);
    setSelectedStatus(currentStatus);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrderId) return;
    try {
      await updateOrderStatus(selectedOrderId, newStatus);
      toast.success("Status updated successfully");
      if (onUpdateStatus) onUpdateStatus(selectedOrderId, newStatus);
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update status", "error");
    }
  };

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
    <>
      <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] transition-all duration-500">
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
                className={`transition-all duration-300 border-b border-[var(--color-border)] ${
                  index % 2 === 0
                    ? "bg-[var(--sage-400)]/60"
                    : "bg-[var(--sage-300)]/60"
                } hover:bg-[var(--color-border)]/70 hover:scale-[1.01] hover:shadow-md`}
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

                <td className="py-3 px-4 capitalize flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <button
                    onClick={() => openModal(order._id, order.status)}
                    className="text-gray-500 hover:text-[var(--color-primary)] transition-all duration-200"
                    title="Update Status"
                  >
                    <FaSyncAlt />
                  </button>
                </td>

                <td className="py-3 px-4 font-semibold text-[var(--color-text)]">
                  {order.finalPrice?.toLocaleString() || 0} EGP
                </td>

                <td className="py-3 px-4 flex justify-center gap-2">
                  <button
                    className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: "var(--color-success)" }}
                    title="View"
                    onClick={() => onView(order)}
                  >
                    <FaEye />
                  </button>

                  <button
                    className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: "var(--color-primary-hover)" }}
                    title="Edit"
                    onClick={() => onEdit(order)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: "var(--color-error)" }}
                    title="Delete"
                    onClick={() => onDelete(order._id)}
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: "var(--color-text-muted)" }}
                    title="Soft Delete"
                    onClick={() => onSoftDelete(order._id)}
                  >
                    <FaBan />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StatusUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update Order Status"
        currentStatus={selectedStatus}
        onUpdate={handleStatusUpdate}
        statuses={["placed", "shipping", "completed", "canceled", "refund"]}
      />
    </>
  );
};

export default OrderTable;
