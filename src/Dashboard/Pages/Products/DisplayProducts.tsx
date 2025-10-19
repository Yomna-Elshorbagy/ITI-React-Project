// import  { useState } from "react";
// import ProductTable from "./ProductsTable";
// import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
// import EditProductModal from "./EditProductModal";
// import { useProducts } from "../../DashboardHooks/Products/useProducts";

// export default function ProductsPage() {
//   const { products, page, pagesCount, loading, setPage, refetch } =
//     useProducts();
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [editOpen, setEditOpen] = useState(false);

//   const handleEdit = (product: any) => {
//     setSelectedProduct(product);
//     setEditOpen(true);
//   };

//   if (loading) return <LoaderPage />;

//   return (
//     <div className="p-4">
//       <ProductTable
//         products={products}
//         onView={(p) => console.log("View:", p)}
//         onEdit={handleEdit}
//         onDelete={(id) => console.log("Delete:", id)}
//       />

//       <div className="flex justify-center items-center gap-2 mt-6">
//         <button
//           onClick={() => setPage(page - 1)}
//           disabled={page === 1}
//           className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="text-sm text-gray-500 dark:text-gray-300">
//           Page {page} of {pagesCount}
//         </span>
//         <button
//           onClick={() => setPage(page + 1)}
//           disabled={page === pagesCount}
//           className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       <EditProductModal
//         isOpen={editOpen}
//         onClose={() => setEditOpen(false)}
//         product={selectedProduct}
//         onUpdated={refetch}
//       />
//     </div>
//   );
// }

import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import ProductTable from "./ProductsTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import EditProductModal from "./EditProductModal";
import { useProducts } from "../../DashboardHooks/Products/useProducts";
import { deleteProduct } from "../../Apis/Products";

const MySwal = withReactContent(Swal);

export default function ProductsPage() {
  const { products, page, pagesCount, loading, setPage, refetch } =
    useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

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
        refetch(); // refresh product list
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      <ProductTable
        products={products}
        onView={(p) => console.log("View:", p)}
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

      <EditProductModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
        onUpdated={refetch}
      />
    </div>
  );
}
