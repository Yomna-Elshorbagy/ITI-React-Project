import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { softDeleteOrder, updateOrderStatus } from "../../Apis/OrderApis";
import { useOrders } from "../../DashboardHooks/Orders/useOrders";
import OrderModal from "./OrderModel";
import OrderTable from "./OrderTable";
import EditOrderModal from "./EditOrderModel";
import toast from "react-hot-toast";
import { filterOrders } from "../../Components/filter/filter";
import {
  FaHashtag,
  FaUser,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";

const Orders: React.FC = () => {
  const { orders, loading, page, totalPages, setPage, error, refetch } =
    useOrders();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const MySwal = withReactContent(Swal);

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await softDeleteOrder(id);
        toast.success("Order deleted successfully 🗑️");
        refetch();
      } catch {
        toast.error("Failed to delete order ❌");
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    Swal.fire("Updated!", "Order status updated.", "success");
    refetch();
  };

  // === Filtering ===
  const filteredOrders = useMemo(
    () =>
      filterOrders(orders, {
        searchId,
        searchUser,
        status,
        payment,
        fromDate,
        toDate,
      }),
    [orders, searchId, searchUser, status, payment, fromDate, toDate]
  );

  const handleReset = () => {
    setSearchId("");
    setSearchUser("");
    setStatus("");
    setPayment("");
    setFromDate("");
    setToDate("");
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Failed to fetch orders.</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md min-h-screen transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1
          className="text-3xl font-semibold mb-6 text-gradient dark:text-gray-100"
          style={{ fontFamily: "var(--font-header)" }}
        >
          Orders Management
        </h1>
      </div>

      {/* === Filter Bar === */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm">
        <div className="flex flex-wrap items-center gap-4 flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 w-full sm:w-[230px]">
            <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
              <FaHashtag className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-[230px]">
            <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
              <FaUser className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by User Name..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-[280px]">
            <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
              <FaCalendarAlt className="text-gray-500" />
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-end flex-shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-[180px]">
            <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
              <FaClipboardList className="text-gray-500" />
            </div>
            <select
              value={status || "All"}
              onChange={(e) =>
                setStatus(e.target.value === "All" ? "" : e.target.value)
              }
              className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="All">All Status</option>
              <option value="placed">Placed</option>
              <option value="completed">Completed</option>
              <option value="shipping">Shipping</option>
              <option value="refund">Refund</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <OrderTable
        orders={filteredOrders}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateStatus={handleStatusUpdate}
      />

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <OrderModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        order={selectedOrder}
      />

      <EditOrderModal
        order={selectedOrder}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdated={refetch}
      />
    </div>
  );
};

export default Orders;
