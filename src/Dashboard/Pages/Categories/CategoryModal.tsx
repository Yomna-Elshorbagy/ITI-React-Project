import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaBoxOpen,
  FaUser,
  FaImage,
  FaInfoCircle,
} from "react-icons/fa";
import type { ICategory } from "../../DashBordInterfaces/categryInterfaces";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: ICategory | null;
  isEdit?: boolean;
  isAdd?: boolean; // 
  productCount?: number;
  onSave?: (updatedCategory: FormData, id: string) => Promise<void>;
  onAdd?: (newCategory: FormData) => Promise<void>; 
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  category,
  isEdit = false,
  isAdd = false, 
  productCount = 0,
  onSave,
  onAdd, 
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (isAdd) {
      // Default values for new category
      setName("");
      setImage(null);
      setCreatedAt(new Date().toISOString());
    } else if (category) {
      setName(category.name || "");
      setImage(null);
      setCreatedAt(category.createdAt || "");
    }
  }, [category, isAdd]);

  useEffect(() => {          //open clean modal everytime
  if (!open) {
    setName("");
    setImage(null);
  }
}, [open]);

  if (!open) return null;
  

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    if (isAdd && onAdd) {
      await onAdd(formData);
    } else if (isEdit && onSave && category) {
      await onSave(formData, category._id);
    }

    onClose();
  };

  const modalTitle = isAdd
    ? "Add New Category"
    : isEdit
    ? "Edit Category"
    : "Category Details";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-2xl shadow-2xl border border-[var(--color-border)] animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center bg-[var(--color-primary)] text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaInfoCircle /> {modalTitle}
          </h2>
          <button onClick={onClose} className="hover:text-[var(--mist-300)] transition">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
              <FaBoxOpen /> Basic Information
            </h3>

            <div className="border items-center border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)] grid grid-cols-2 gap-x-6 gap-y-3">
              {!isAdd && (
                <p>
                  <strong>ID:</strong> {category?._id}
                </p>
              )}

             <div className="flex items-center gap-2">
           <strong >Name:</strong>
          <input
           type="text"
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Enter category name"
           required
           disabled={!isEdit && !isAdd} // disable in view mode
           className={`flex-1 p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] 
          ${!isEdit && !isAdd ? "opacity-70 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"}
    `}
  />
</div>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(createdAt).toLocaleDateString()}
              </p>

              {!isAdd && category?.updatedAt && (
             <p>
             <strong>Updated At:</strong>{" "}
             {new Date(category.updatedAt).toLocaleDateString()}
            </p>
            )}

            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
              <FaImage /> Category Image
            </h3>

            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)] flex flex-col sm:flex-row items-center gap-4">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : category?.image?.secure_url || "/placeholder.jpeg"
                }
                alt={name}
                className="w-24 h-24 rounded-lg object-cover border"
              />

              <div className="space-y-2">
                {( isAdd || isEdit ) &&(
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="block text-sm text-gray-500 border border-[var(--color-border)] rounded-md p-1"
                />
                )}
                {!isAdd && (
                  <p>
                    <strong>No. of Products:</strong> {productCount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Created By */}
          {!isAdd && category?.createdBy && (
            <div>
              <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
                <FaUser /> Created By
              </h3>
              <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)]">
                <p>
                  <strong>Name:</strong> {category.createdBy.userName}
                </p>
                <p>
                  <strong>Phone:</strong> {category.createdBy.mobileNumber || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {category.createdBy.address || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        {(isAdd || isEdit) ? (
         <button
         onClick={handleSave}
        className={`px-4 py-2 rounded-lg text-white ${
        isAdd
          ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
          : "bg-[var(--color-success)] hover:bg-green-600"
        } transition-all duration-300`}
       >
      {isAdd ? "Add Category" : "Save Changes"}
      </button>
      ) : (
      <button
      onClick={onClose}
      className="px-4 py-2 rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-300"
      >
      Close
      </button>
       )}
       </div>
      </div>
    </div>
  );
};

export default CategoryModal;