import React from "react";
import { FaEye, FaEdit, FaTrash, FaBan } from "react-icons/fa";
import type { UserTableProps } from "../../DashBordInterfaces/userInterfaces";


const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onEdit,
  onHardDelete,
  onSoftDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl elevate-soft border border-[var(--color-border)] transition-all duration-500 ease-in-out hover:shadow-lg">
      <table className="min-w-full text-sm rounded-xl overflow-hidden">
        <thead>
          <tr
            className="text-white uppercase tracking-wide"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <th className="py-3 px-4 text-left font-semibold">ID</th>
            <th className="py-3 px-4 text-left font-semibold">NAME</th>
            <th className="py-3 px-4 text-left font-semibold">EMAIL</th>
            <th className="py-3 px-4 text-left font-semibold">PHONE</th>
            <th className="py-3 px-4 text-left font-semibold">ROLE</th>
            <th className="py-3 px-4 text-center font-semibold">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr
              key={u._id}
              className={`transition-all duration-300 ease-in-out border-b border-[var(--color-border)] ${
                index % 2 === 0
                  ? "bg-[var(--sage-400)]/60"
                  : "bg-[var(--sage-300)]/60"
              } hover:bg-[var(--color-border)]/80 hover:scale-[1.01] hover:shadow-md`}
            >
              <td className="py-3 px-4">{u._id.slice(-4)}</td>
              <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                {u.userName}
              </td>
              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                {u.email}
              </td>
              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                {u.mobileNumber}
              </td>
              <td className="py-3 px-4 text-[var(--color-primary)] font-semibold">
                {u.role}
              </td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-success)" }}
                  title="View Details"
                  onClick={() => onView(u)}
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-primary-hover)" }}
                  title="Edit User"
                  onClick={() => onEdit(u)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-error)" }}
                  title="Delete User"
                  onClick={() => onHardDelete(u._id)}
                >
                  <FaTrash />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-text-muted)" }}
                  title="Block User"
                  onClick={() => onSoftDelete(u._id)}
                >
                  <FaBan />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
