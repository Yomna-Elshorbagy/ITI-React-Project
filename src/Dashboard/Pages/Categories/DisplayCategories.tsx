import React, { useState, useMemo } from "react";
import CategoriesTable from "./CategoriesTable";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import CategoryModal from "./CategoryModal";
import { useCategories } from "../../DashboardHooks/Categories/useCategories";
import { updateCategory, deleteCategory } from "../../Apis/CategoryApis";
import { FaTag, FaHashtag } from "react-icons/fa";

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
const [searchId, setSearchId] = useState("");
const [searchName, setSearchName] = useState("");

// Filtered categories (by name or/and id)
const filteredCategories = useMemo(() => {
  return categories.filter((cat) => {
    const matchesId =
      !searchId.trim() ||
      cat._id.toLowerCase().includes(searchId.trim().toLowerCase());
    const matchesName =
      !searchName.trim() ||
      cat.name.toLowerCase().includes(searchName.trim().toLowerCase());
    return matchesId && matchesName;
  });
}, [categories, searchId, searchName]);


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
     {/* === Search Bar === */}
<div className="w-full flex flex-wrap items-center gap-4 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm">

  {/* Search by ID */}
  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
    <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
      <FaHashtag className="text-gray-500" />
    </div>
    <input
      type="text"
      placeholder="Search by ID..."
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
      className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full 
                 focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
    />
  </div>

  {/* Search by Name */}
  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
    <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
      <FaTag className="text-gray-500" />
    </div>
    <input
      type="text"
      placeholder="Search by Name..."
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
      className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full 
                 focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
    />
  </div>

  {/* Reset Button */}
  <div className="flex justify-end flex-1 min-w-[150px]">
    <button
      onClick={() => {
        setSearchId("");
        setSearchName("");
      }}
      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow 
                 hover:bg-[var(--color-primary-hover)] transition-colors w-full sm:w-auto"
    >
      Reset
    </button>
    </div>
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