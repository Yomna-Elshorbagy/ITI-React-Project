import React, { useState } from "react";
import CategoriesTable from "./CategoriesTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import CategoryModal from "./CategoryModal";
import { useCategories } from "../../DashboardHooks/Categories/useCategories";
import { updateCategory, deleteCategory } from "../../Apis/CategoryApis";

export default function DisplayCategories() {
  const {
    categories,
   // productCounts,
    page,
    pagesCount,
    loading,
    setPage,
    refetchAll,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const handleView = (category: any) => setSelectedCategory(category);
  const handleEdit = (category: any) =>
    setSelectedCategory({ ...category, isEdit: true });
//updateCateogery
  const handleSave = async (formData: FormData, id: string) => {
    try {
      await updateCategory(id, formData);
      alert("✅ Category updated successfully");
      await refetchAll(); // refresh table + stats
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error updating category:", err);
      alert("❌ Failed to update category");
    }
  };

 // Delete category
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      alert("🗑️ Category deleted successfully");
      await refetchAll(); // refresh categories + stats
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("❌ Failed to delete category");
    }
  };

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      <CategoriesTable
        categories={categories}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete} // now active
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

      <CategoryModal
        open={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
        isEdit={selectedCategory?.isEdit || false}
        productCount={selectedCategory?.productCount?? 0}
        onSave={handleSave}
      />
    </div>
  );
}