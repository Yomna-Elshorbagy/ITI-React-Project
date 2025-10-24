import React, { useState } from "react";
import CategoryModal from "./CategoryModal";
import { addCategory } from "../../Apis/CategoryApis";
import { useCategories } from "../../DashboardHooks/Categories/useCategories";

export default function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  const { categories, refetchAll } = useCategories();

  // Add new category
  const handleAdd = async (formData: FormData) => {
    try {
      await addCategory(formData);
      alert("✅ Category added successfully!");
      setOpen(false);
      await refetchAll();
    } catch (err) {
      console.error("Error adding category:", err);
      alert("❌ Failed to add category");
    }
  };

  return (
    <>
      <button
        onClick={() => {setOpen(true)}} 
        className="mb-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all"
      >
        + Add Category
      </button>

      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        isAdd={true}
        onAdd={handleAdd}
        categories={categories}
      />
    </>
  );
}