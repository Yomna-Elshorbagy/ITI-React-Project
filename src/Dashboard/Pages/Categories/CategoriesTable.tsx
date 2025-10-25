import React from "react";
import { FaEye, FaEdit, FaTrash, FaBan } from "react-icons/fa";
import type { ICategory } from "../../DashBordInterfaces/categryInterfaces";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface CategoryTableProps {
  categories: ICategory[];
  // productCounts: Record<string, number>; // categoryId → count
  onView: (category: ICategory) => void;
  onEdit: (category: ICategory) => void;
  onSoftDelete: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

const CategoriesTable: React.FC<CategoryTableProps> = ({
  categories,
  // productCounts,
  onView,
  onEdit,
  onSoftDelete,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-xl elevate-soft border border-[var(--color-border)] transition-all duration-500 ease-in-out hover:shadow-lg">
      <table className="min-w-full text-sm rounded-xl overflow-hidden">
        <thead>
          <tr
            className="text-white uppercase tracking-wide"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <th className="py-3 px-4 text-left font-semibold">Image</th>
            <th className="py-3 px-4 font-semibold">Name</th>
            <th className="py-3 px-4 font-semibold ">No. Products</th>
            <th className="py-3 px-4  font-semibold">Updated At</th>
            <th className="py-3 px-4  font-semibold">Created By</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c, index) => (
            <tr
              key={c._id}
              className={`transition-all duration-300 ease-in-out border-b border-[var(--color-border)] ${
                index % 2 === 0
                  ? "bg-[var(--sage-400)]/60"
                  : "bg-[var(--sage-300)]/60"
              } hover:bg-[var(--color-border)]/80 hover:scale-[1.01] hover:shadow-md`}
            >
              <td className="py-3 px-4">
                <img
                  src={c.image?.secure_url || "/placeholder.jpg"}
                  alt={c.name}
                  className="w-14 h-14 object-cover rounded-md border border-gray-300"
                />
              </td>

              <td className="py-3 px-4 font-medium text-[var(--color-text)] text-center">
                {c.name}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)] text-center">
                {c.productCount ?? 0}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)] text-center">
                {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "—"}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)] text-center">
                {c.createdBy?.userName || "Unknown"}
              </td>

              <td className="py-3 px-4 flex justify-center gap-2">
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-success)" }}
                  title="View Category"
                  onClick={() => onView(c)}
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-primary-hover)" }}
                  title="Edit Category"
                  onClick={() => onEdit(c)}
                >
                  <FaEdit />
                </button>
                {/*<button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-error)" }}
                  title="Delete Category"
                  onClick={() => onDelete(c._id, c.name)}
                >
                  <FaTrash />
                </button>*/}
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-error)" }}
                  title="Delete Category"
                  onClick={async () => {
                    setDeletingId(c._id);
                    await onDelete(c._id, c.name);
                    setDeletingId(null);
                  }}
                  disabled={deletingId === c._id}
                >
                  {deletingId === c._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-text-muted)" }}
                  title="Block User"
                  onClick={() => onSoftDelete(c._id)}
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

export default CategoriesTable;
