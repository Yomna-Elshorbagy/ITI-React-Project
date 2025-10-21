import React from "react";
import { FaTimes, FaUser, FaBox, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  order?: IOrder;
}

const OrderModal: React.FC<OrderModalProps> = ({ open, onClose, order }) => {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl w-full max-w-2xl border border-[var(--color-border)]">
        {/* header */}
        <div className="flex justify-between items-center bg-[var(--color-primary)] text-white px-6 py-4 rounded-t-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaBox /> Order Details
          </h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment:</strong> {order.payment}</p>
            <p><strong>Total Price:</strong> {order.finalPrice} EGP</p>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4">
            <h3 className="font-semibold flex items-center gap-2 text-[var(--color-primary)]">
              <FaUser /> Customer Info
            </h3>
            <p><strong>Name:</strong> {order.fullName}</p>
            <p><FaPhone className="inline mr-2" />{order.phone}</p>
            <p><FaMapMarkerAlt className="inline mr-2" />{order.address}</p>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4">
            <h3 className="font-semibold flex items-center gap-2 text-[var(--color-primary)]">
              <FaBox /> Products
            </h3>
            <ul className="space-y-2 mt-2">
              {order.products.map((p) => (
                <li
                  key={p.productId}
                  className="flex justify-between border-b border-[var(--color-border)] pb-2"
                >
                  <span>{p.title} (x{p.quantity})</span>
                  <span>{p.finalPrice} EGP</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
