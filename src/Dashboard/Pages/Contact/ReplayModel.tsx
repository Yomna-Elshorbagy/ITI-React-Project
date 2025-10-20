import { useState } from "react";
import Swal from "sweetalert2";
import { replyToContact } from "../../Apis/Contact";

export default function ReplyModal({
  isOpen,
  onClose,
  contact,
  onReplied,
}: any) {
  const [message, setMessage] = useState("");

  if (!isOpen || !contact) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      Swal.fire("Error", "Reply message cannot be empty", "error");
      return;
    }
    try {
      await replyToContact(contact._id, message);
      Swal.fire("Success", "Reply sent successfully!", "success");
      onReplied();
      onClose();
      setMessage("");
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to send reply",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Reply to {contact.fullName}
        </h2>

        <p className="text-gray-500 text-sm mb-3">Email: {contact.email}</p>

        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-transparent text-gray-700 dark:text-gray-200"
          placeholder="Write your reply..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)]"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}
