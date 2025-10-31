import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTimes,
  FaEnvelope,
  FaUser,
  FaCommentDots,
} from "react-icons/fa";
import { z } from "zod";
import type { IContact } from "../../DashBordInterfaces/Contact";
import { updateContact } from "../../Apis/Contact";

const contactSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  replyStatus: z
    .string()
    .nonempty("Status is required")
    .refine(
      (val) => ["pending", "inProgress", "replied"].includes(val),
      "Invalid status"
    ),
  replyMessage: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 3,
      "Reply message must be at least 3 characters if provided"
    ),
});

interface ContactEditModalProps {
  contact: IContact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const ContactEditModal: React.FC<ContactEditModalProps> = ({
  contact,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
    replyStatus: "",
    replyMessage: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (contact) {
      setFormData({
        fullName: contact.fullName || "",
        email: contact.email || "",
        message: contact.message || "",
        replyStatus: contact.replyStatus || "",
        replyMessage: contact.replyMessage || "",
      });
    }
  }, [contact]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const validation = contactSchema.safeParse(formData);

    if (!validation.success) {
      const errors = validation.error.issues.map((err) => err.message);
      setValidationErrors(errors);
      return;
    }

    if (!contact?._id) return;

    try {
      await updateContact(contact._id, formData);
      Swal.fire("Success", "Contact updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (error: any) {
      Swal.fire("Error", "Failed to update contact", "error");
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-in-out">
      <div className="relative glass dark:glass-dark rounded-2xl shadow-2xl w-full max-w-2xl border border-[var(--color-border)] text-[var(--color-text)] transition-transform duration-500 ease-in-out transform hover:scale-[1.02]">
        <div className="flex justify-between items-center bg-[var(--sky-400)] text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaEdit /> Edit Contact
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[var(--mist-300)] transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationErrors.length > 0 && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface)] space-y-3">
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaUser /> Full Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaEnvelope /> Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaCommentDots /> Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                readOnly
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-700 h-24 resize-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="replyStatus"
                value={formData.replyStatus}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Reply Message</label>
              <textarea
                name="replyMessage"
                value={formData.replyMessage}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent h-20 resize-none"
              />
            </div>
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

export default ContactEditModal;
