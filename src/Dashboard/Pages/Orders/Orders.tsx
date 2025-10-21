import React, { useState } from "react";
import Swal from "sweetalert2";
import { softDeleteOrder, updateOrderStatus } from "../../Apis/OrderApis";
import { useOrders } from "../../DashboardHooks/Orders/useOrders";
import OrderModal from "./OrderModel";
import OrderTable from "./OrderTable";
import EditOrderModal from "./EditOrderModel";

const Orders = () => {
  const { orders, loading, page, totalPages, setPage, error, refetch } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await softDeleteOrder(id);
      Swal.fire("Deleted!", "Order has been deleted.", "success");
      refetch();
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    Swal.fire("Updated!", "Order status updated.", "success");
    refetch();
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Failed to fetch orders.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">Orders</h1>

      <OrderTable
        orders={orders}
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
