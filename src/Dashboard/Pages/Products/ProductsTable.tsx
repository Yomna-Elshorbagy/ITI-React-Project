import React from "react";
import { FaEye, FaEdit, FaTrash, FaBan } from "react-icons/fa";
import type { IProduct } from "../../DashBordInterfaces/ProductsInterfaces";

interface ProductTableProps {
  products: IProduct[];
  onView: (product: IProduct) => void;
  onEdit: (product: IProduct) => void;
  onSoftDelete: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onView,
  onEdit,
  onSoftDelete,
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
            <th className="py-3 px-4 text-left font-semibold">Image</th>
            <th className="py-3 px-4 text-left font-semibold">Name</th>
            <th className="py-3 px-4 text-left font-semibold">Price</th>
            <th className="py-3 px-4 text-left font-semibold">Discount</th>
            <th className="py-3 px-4 text-left font-semibold">Stock</th>
            <th className="py-3 px-4 text-left font-semibold">Category</th>
            <th className="py-3 px-4 text-left font-semibold">Seller</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr
              key={p._id}
              className={`transition-all duration-300 ease-in-out border-b border-[var(--color-border)] ${
                index % 2 === 0
                  ? "bg-[var(--sage-400)]/60"
                  : "bg-[var(--sage-300)]/60"
              } hover:bg-[var(--color-border)]/80 hover:scale-[1.01] hover:shadow-md`}
            >
              <td className="py-3 px-4">
                <img
                  src={p.imageCover?.secure_url}
                  alt={p.title}
                  className="w-14 h-14 object-cover rounded-md border border-gray-300"
                />
              </td>

              <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                {p.title}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                ${p.finalPrice?.toLocaleString() || p.price?.toLocaleString()}
              </td>

              <td className="py-3 px-4 text-red-500 font-semibold">
                {p.discount ? `${p.discount}%` : "-"}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                {p.stock}
              </td>

              <td className="py-3 px-4 text-[var(--color-primary)] font-semibold">
                {p.category?.name || "N/A"}
              </td>

              <td className="py-3 px-4 text-[var(--color-text-muted)]">
                {p.createdBy?.userName || "Unknown"}
              </td>

              <td className="py-3 px-4 flex justify-center gap-2">
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-success)" }}
                  title="View Product"
                  onClick={() => onView(p)}
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-primary-hover)" }}
                  title="Edit Product"
                  onClick={() => onEdit(p)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-error)" }}
                  title="Delete Product"
                  onClick={() => onDelete(p._id)}
                >
                  <FaTrash />
                </button>
                <button
                  className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: "var(--color-text-muted)" }}
                  title="Block User"
                  onClick={() => onSoftDelete(p._id)}
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

export default ProductTable;
