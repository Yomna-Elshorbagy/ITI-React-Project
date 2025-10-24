import { useState } from "react";
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

const MySwal = withReactContent(Swal);

export default function ProductsPage() {
  const { products, page, pagesCount, loading, setPage, refetch } =
    useProducts();

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

  // === VIEW handler
  const handleView = (product: any) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  // === EDIT handler
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Products
        </h1>
        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 rounded-md text-white font-medium
                     bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
                     transition-colors duration-200 shadow-md"
        >
          + Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
