import React from "react";
import { FaTrash, FaReply, FaEdit } from "react-icons/fa";
import type { IContact } from "../../DashBordInterfaces/Contact";

interface ContactTableProps {
  contacts: IContact[];
  onReply: (contact: IContact) => void;
  onDelete: (id: string) => void;
  onEdit: (contact: IContact) => void;
}

const getStatusStyle = (replyStatus: string) => {
  switch (replyStatus?.toLowerCase()) {
    case "replied":
      return "bg-green-100 text-green-700 border-green-300";
    case "in progress":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
  }
};

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onReply,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:shadow-lg transition-all duration-500 ease-in-out">
      <table className="min-w-full text-sm rounded-xl overflow-hidden">
        <thead>
          <tr
            className="text-white uppercase tracking-wide"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <th className="py-3 px-4 text-left font-semibold">Full Name</th>
            <th className="py-3 px-4 text-left font-semibold">Email</th>
            <th className="py-3 px-4 text-left font-semibold">Message</th>
            <th className="py-3 px-4 text-center font-semibold">Status</th>
            <th className="py-3 px-4 text-center font-semibold">Reply</th>
            <th className="py-3 px-4 text-center font-semibold">
              Time Response
            </th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact, index) => (
            <tr
              key={contact._id}
              className={`transition-all duration-300 ease-in-out border-b border-[var(--color-border)] ${
                index % 2 === 0
                  ? "bg-[var(--sage-400)]/60"
                  : "bg-[var(--sage-300)]/60"
              } hover:bg-[var(--color-border)]/80 hover:scale-[1.01] hover:shadow-md`}
            >
              <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                {contact.fullName}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                {contact.email}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)] truncate max-w-xs">
                {contact.message}
              </td>

              <td className="py-3 px-4 text-center">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusStyle(
                    contact.replyStatus || "pending"
                  )}`}
                >
                  {contact.replyStatus ? contact.replyStatus : "pending"}
                </span>
              </td>

              <td className="py-3 px-4 text-center text-[var(--color-text-muted)]">
                {contact.replyMessage ? contact.replyMessage : "No"}
              </td>

              <td className="py-3 px-4 text-center text-[var(--color-text-muted)]">
                {contact.repliedAt || "—"}
              </td>

              <td className="py-3 px-4 flex justify-center gap-2">
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-primary-hover)" }}
                  title="Reply"
                  onClick={() => onReply(contact)}
                >
                  <FaReply />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  title="Edit"
                  onClick={() => onEdit(contact)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-error)" }}
                  title="Delete"
                  onClick={() => onDelete(contact._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}

          {contacts.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center py-6 text-gray-400 dark:text-gray-500"
              >
                No messages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
