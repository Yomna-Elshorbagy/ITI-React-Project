import React, { useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaBox,
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import type { UserModalProps } from "../../DashBordInterfaces/userInterfaces";

const UserModal: React.FC<UserModalProps> = ({ open, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<"cart" | "orders" | "wishlist">(
    "cart"
  );

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-in-out">
      <div className="relative glass dark:glass-dark rounded-2xl shadow-2xl w-full max-w-2xl border border-[var(--color-border)] text-[var(--color-text)] transition-transform duration-500 ease-in-out transform hover:scale-[1.02]">
        <div className="flex justify-between items-center bg-[var(--sky-400)] text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaUser /> User Details
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[var(--mist-300)] transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-[var(--color-text)]">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <FaUser className="text-[var(--color-primary-hover)]" /> Basic
            Information
          </h3>
          <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface)]">
            <p>
              <strong>ID:</strong> {user._id}
            </p>
            <p>
              <strong>Name:</strong> {user.userName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b border-[var(--color-border)] pb-2 text-sm">
            {[
              { key: "cart", label: "Cart", icon: <FaShoppingCart /> },
              { key: "orders", label: "Orders", icon: <FaBox /> },
              { key: "wishlist", label: "Wishlist", icon: <FaHeart /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-300 ${
                  activeTab === key
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-hover)]"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] min-h-[120px] text-center">
            {activeTab === "cart" && <p className="text-sm">🛒 Empty cart</p>}
            {activeTab === "orders" && (
              <p className="text-sm">📦 No orders yet</p>
            )}
            {activeTab === "wishlist" && (
              <p className="text-sm">💖 Wishlist is empty</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
