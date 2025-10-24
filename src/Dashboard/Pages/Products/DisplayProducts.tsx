import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import ProductTable from "./ProductsTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import EditProductModal from "./EditProductModal";
import ProductModal from "./productModel";
import { useProducts } from "../../DashboardHooks/Products/useProducts";
import { deleteProduct } from "../../Apis/Products";
import AddProductModal from "./AddProducts";
import { FaTag, FaBoxOpen, FaHashtag } from "react-icons/fa";
import { filterProducts } from "../../Components/filter/filter";
const MySwal = withReactContent(Swal);

export default function ProductsPage() {
  const { products, loading, refetch } = useProducts();

  const [category, setCategory] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [searchStock, setSearchStock] = useState<string>("");

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

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        category,
        searchId,
        searchName,
        searchStock,
      }),
    [products, category, searchId, searchName, searchStock]
  );

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Products
        </h1>
        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 rounded-md text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200 shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* === Filter Bar === */}
      <div className="w-full flex flex-wrap items-center gap-4 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm">
        {/* Category */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Category:
          </label>
          <select
            value={category || "All"}
            onChange={(e) =>
              setCategory(e.target.value === "All" ? "" : e.target.value)
            }
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          >
            <option value="All">All</option>
            <option value="bracelets">bracelets</option>
            <option value="chains">chains</option>
            <option value="earrings">earrings</option>
            <option value="necklace">necklace</option>
            <option value="rings">rings</option>
          </select>
        </div>

        {/* ID */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
            <FaHashtag className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Product ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
            <FaTag className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Product Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
            <FaBoxOpen className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Stock..."
            value={searchStock}
            onChange={(e) => setSearchStock(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Reset Button */}
        <div className="flex justify-end flex-1 min-w-[150px]">
          <button
            onClick={() => {
              setCategory("");
              setSearchId("");
              setSearchName("");
              setSearchStock("");
            }}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow hover:bg-[var(--color-primary-hover)] transition-colors w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
