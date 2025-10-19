import React, { useState } from "react";
import ProductTable from "./ProductsTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import { useProducts } from "../../DashboardHooks/Products/useProducts";
import ProductModal from "./productModel";

export default function ProductsPage() {
  const { products, page, pagesCount, loading, setPage } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null); // 👈 selected product state

  const handleView = (product: any) => {
    setSelectedProduct(product); // 👈 open modal with selected product
  };

  const handleEdit = (product: any) => {
    console.log("Edit:", product);
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
  };

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
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

      {/* 👇 Modal for viewing product details */}
      <ProductModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
