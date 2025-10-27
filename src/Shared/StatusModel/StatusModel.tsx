import React, { useState, useEffect } from "react";
import { FaTimes, FaSyncAlt } from "react-icons/fa";

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  currentStatus?: string;
  onUpdate: (newStatus: string) => Promise<void> | void;
  statuses: string[];
  icon?: React.ReactNode;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  title = "Update Status",
  currentStatus = "",
  onUpdate,
  statuses,
  icon = <FaSyncAlt />,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    try {
      setLoading(true);
      await onUpdate(selectedStatus);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-xl shadow-2xl w-full max-w-md border border-[var(--color-border)] transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-4 bg-[var(--color-primary)] text-white rounded-t-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {icon} {title}
          </h2>
          <button onClick={onClose} className="hover:text-gray-200 transition">
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-medium mb-1">Select Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-[var(--color-border)] p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            >
              <option value="">Select status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
