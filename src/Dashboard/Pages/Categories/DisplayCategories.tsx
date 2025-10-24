import React, { useState, useMemo } from "react";
import CategoriesTable from "./CategoriesTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import CategoryModal from "./CategoryModal";
import { useCategories } from "../../DashboardHooks/Categories/useCategories";
import { updateCategory, deleteCategory } from "../../Apis/CategoryApis";

export default function DisplayCategories() {
  const {
    categories,
    page,
    pagesCount,
    loading,
    setPage,
    refetchAll,
  } = useCategories();

//search filter
const [searchTerm, setSearchTerm] = useState("");

// Filtered categories (by name or id)
const filteredCategories = useMemo(() => {
  if (!searchTerm.trim()) return categories;
  return categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat._id.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [categories, searchTerm]);


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
      <div className="flex justify-end mb-4">    {/*search bar*/}
    <input
      type="text"
      placeholder="Search by name or ID..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)} 
      onKeyDown={(e) => {
       if (e.key === "Enter") {
         setSearchTerm(e.currentTarget.value);
       }
      }}
      className="w-full sm:w-80 px-4 py-2 rounded-lg border border-[var(--color-border)] 
               focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none 
               text-[var(--color-text)] bg-[var(--color-surface)]"
       />
  </div>
      <CategoriesTable
        categories={filteredCategories}
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
        categories={categories}
      />
    </div>
  );
}