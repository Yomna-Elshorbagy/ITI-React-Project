import { useState } from "react";     //React
import CategoryModal from "./CategoryModal";
import { addCategory } from "../../Apis/CategoryApis";
import { useCategories } from "../../DashboardHooks/Categories/useCategories";
import toast from "react-hot-toast";

export default function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  const { categories, refetchAll } = useCategories();

  // Add new category
  const handleAdd = async (formData: FormData) => {
    try {
      await addCategory(formData);
      //alert(" Category added successfully!");
      toast.success(" Category added successfully!");
      setOpen(false);
      await refetchAll();
    } catch (err) {
      console.error("Error adding category:", err);
      //alert(" Failed to add category");
      toast.error("Failed to add category");
    }
  };

  return (
    <>
    <div className="flex justify-between items-center px-4">
         <h1
          className="text-3xl font-semibold mb-6 text-gradient dark:text-gray-100"
          style={{ fontFamily: "var(--font-header)" }}
        >
          Categories Managment
        </h1>
      <button
        onClick={() => {setOpen(true)}} 
        className="mb-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all "
      >
        + Add Category
      </button>
      </div>

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