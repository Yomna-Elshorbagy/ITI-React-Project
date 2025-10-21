import React from "react";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaPhone,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  order?: IOrder;
}

const OrderModal: React.FC<OrderModalProps> = ({ open, onClose, order }) => {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-2xl shadow-2xl border border-[var(--color-border)] transition-all duration-300">
        <div className="flex justify-between items-center bg-[var(--color-primary)] text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaInfoCircle /> Order Details
          </h2>
          <button
            onClick={onClose}
            className="hover:text-[var(--mist-300)] transition-all duration-300"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* order Info */}
          <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-hover)] transition-all duration-300 space-y-2 shadow-sm">
            <p>
              <strong>ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{order.status}</span>
            </p>
            <p>
              <strong>Payment:</strong> {order.payment}
            </p>
            <p>
              <FaDollarSign className="inline mr-2 text-[var(--color-primary)]" />
              <strong>Total:</strong>{" "}
              <span className="font-semibold text-[var(--color-primary)]">
                {order.finalPrice} EGP
              </span>
            </p>
          </div>

          {/* customer Info */}
          <section>
            <h3 className="text-[var(--color-primary)] font-semibold flex items-center gap-2 mb-2">
              <FaUser /> Customer Info
            </h3>
            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-hover)] transition-all duration-300 space-y-2 shadow-sm">
              <p>
                <strong>Name:</strong> {order.fullName}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[var(--color-primary)]" />
                {order.phone}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[var(--color-primary)]" />
                {order.address}
              </p>
            </div>
          </section>

          {/* Products */}
          <section>
            <h3 className="text-[var(--color-primary)] font-semibold flex items-center gap-2 mb-2">
              <FaBox /> Products
            </h3>
            <ul className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-hover)] transition-all duration-300 shadow-sm space-y-2">
              {order.products.map((p) => (
                <li
                  key={p.productId}
                  className="flex justify-between border-b border-[var(--color-border)] pb-2 last:border-0 last:pb-0"
                >
                  <span>
                    {p.title}{" "}
                    <span className="text-sm text-gray-500">
                      (x{p.quantity})
                    </span>
                  </span>
                  <span className="font-semibold text-[var(--color-primary)]">
                    {p.finalPrice} EGP
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
