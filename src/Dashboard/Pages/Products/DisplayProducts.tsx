import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import ProductTable from "./ProductsTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import EditProductModal from "./EditProductModal";
import ProductModal from "./productModel";
import { useProducts } from "../../DashboardHooks/Products/useProducts";
import { deleteProduct, softDeleteProducts } from "../../Apis/Products";
import AddProductModal from "./AddProducts";
import { FaTag, FaBoxOpen, FaHashtag } from "react-icons/fa";
import { filterProducts } from "../../Components/filter/filter";

const MySwal = withReactContent(Swal);

export default function ProductsPage() {
  const { products, loading, refetch, page, setPage, pagesCount } =
    useProducts();

  const [category, setCategory] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [searchStock, setSearchStock] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // === DELETE handler
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized");

    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully!");
        refetch();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  // === SOFT DELETE handler
  const handleSoftDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized");

    const result = await MySwal.fire({
      title: "Soft delete this product?",
      text: "The product will be marked as deleted but not removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, soft delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#fbbf24",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await softDeleteProducts(id, token);
        toast.success("Product soft deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to soft delete product");
      }
    }
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const filteredProducts = useMemo(() => {
    let filtered = filterProducts(products, {
      category,
      searchId,
      searchName,
      searchStock,
    });

    if (status) {
      filtered = filtered.filter((p) => {
        if (status === "out") return p.stock === 0;
        if (status === "low") return p.stock > 0 && p.stock <= 5;
        if (status === "available") return p.stock > 5;
        return true;
      });
    }

    return filtered;
  }, [products, category, searchId, searchName, searchStock, status]);

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1
          className="text-3xl font-semibold mb-6 text-gradient dark:text-gray-100"
          style={{ fontFamily: "var(--font-header)" }}
        >
          Products Management
        </h1>
        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 rounded-md text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200 shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* === Filter Bar === */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm overflow-x-auto">
        {/* Category */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <label className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
            Category:
          </label>
          <select
            value={category || "All"}
            onChange={(e) =>
              setCategory(e.target.value === "All" ? "" : e.target.value)
            }
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors w-[150px]"
          >
            <option value="All">All</option>
            <option value="bracelets">bracelets</option>
            <option value="chains">chains</option>
            <option value="earrings">earrings</option>
            <option value="necklace">necklace</option>
            <option value="rings">rings</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <label className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
            Status:
          </label>
          <select
            value={status || "All"}
            onChange={(e) =>
              setStatus(e.target.value === "All" ? "" : e.target.value)
            }
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors w-[150px]"
          >
            <option value="All">All</option>
            <option value="available">Available</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* ID */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <FaHashtag className="text-gray-500" />
          <input
            type="text"
            placeholder="🔍ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-[140px] focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <FaTag className="text-gray-500" />
          <input
            type="text"
            placeholder="🔍Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-[140px] focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <FaBoxOpen className="text-gray-500" />
          <input
            type="text"
            placeholder="🔍Stock..."
            value={searchStock}
            onChange={(e) => setSearchStock(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-[140px] focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setCategory("");
            setSearchId("");
            setSearchName("");
            setSearchStock("");
            setStatus("");
          }}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow hover:bg-[var(--color-primary-hover)] transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      <ProductTable
        products={filteredProducts}
        onView={handleView}
        onEdit={handleEdit}
        onSoftDelete={handleSoftDelete}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Page {page} of {pagesCount}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagesCount}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onProductAdded={refetch}
      />
      <EditProductModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
        onUpdated={refetch}
      />
      <ProductModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
