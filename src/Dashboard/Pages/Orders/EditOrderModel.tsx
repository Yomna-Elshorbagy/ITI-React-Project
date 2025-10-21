import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaEdit,
  FaTruck,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaMoneyBill,
} from "react-icons/fa";
import Swal from "sweetalert2";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";
import { updateOrderInfo } from "../../Apis/OrderApis";

interface EditOrderModalProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    status: "",
    finalPrice: 0,
  });

  useEffect(() => {
    if (order) {
      setFormData({
        fullName: order.fullName || "",
        phone: order.phone || "",
        address: order.address || "",
        status: order.status || "",
        finalPrice: order.finalPrice || 0,
      });
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "finalPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrderInfo(order._id, formData);
      Swal.fire("Success", "Order updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-xl shadow-2xl w-full max-w-2xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center px-6 py-4 bg-[var(--color-primary)] text-white rounded-t-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaEdit /> Edit Order
          </h2>
          <button onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaUser /> Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaPhone /> Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaMapMarkerAlt /> Address
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              placeholder="Enter delivery address"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaTruck /> Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
            >
              <option value="">Select status</option>
              <option value="placed">Placed</option>
              <option value="shipping">Shipping</option>
              <option value="Completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="refund">Refund</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaMoneyBill /> Total Price (EGP)
            </label>
            <input
              type="number"
              name="finalPrice"
              value={formData.finalPrice}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              placeholder="Enter total price"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
