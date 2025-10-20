import React from "react";
import { FaTrash, FaReply } from "react-icons/fa";
import type { IContact } from "../../DashBordInterfaces/Contact";

interface ContactTableProps {
  contacts: IContact[];
  onReply: (contact: IContact) => void;
  onDelete: (id: string) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onReply,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl elevate-soft border border-[var(--color-border)] transition-all duration-500 ease-in-out hover:shadow-lg">
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
                {contact.reply ? (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700 border border-green-300">
                    Replied
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                    Pending
                  </span>
                )}
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
                colSpan={5}
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
