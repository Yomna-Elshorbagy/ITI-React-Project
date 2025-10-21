import React, { useState } from "react";
import { softDeleteOrder, updateOrderStatus } from "../../Apis/OrderApis";
import Swal from "sweetalert2";
import OrderModal from "./OrderModel";
import OrderTable from "./OrderTable";
import { useOrders } from "../../DashboardHooks/Orders/useOrders";

const Orders = () => {
  const { orders, loading, error, refetch } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
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
        onDelete={handleDelete}
        onUpdateStatus={handleStatusUpdate}
      />
      <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} order={selectedOrder} />
    </div>
  );
};

export default Orders;
