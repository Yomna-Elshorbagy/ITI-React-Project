import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaPlusCircle,
  FaImage,
  FaBoxOpen,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { addProduct } from "../../Apis/Products";
import { getAllCategories } from "../../Apis/CategoryApis";
import type { IProduct } from "../../DashBordInterfaces/ProductsInterfaces";

// Validation schema for new product
const addProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().positive("Price must be positive")
  ),
  discount: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(0, "Discount must be >= 0")
      .max(100, "Discount must be ≤ 100")
      .optional()
  ),
  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().int("Stock must be an integer").min(0, "Stock must be ≥ 0")
  ),
  category: z.string().min(1, "Please select a category"),
  imageCover: z.any().optional(),
  subImages: z.any().optional(),
});

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: IProduct) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onProductAdded,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
  });
  const [imageCover, setImageCover] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const validation = addProductSchema.safeParse(formData);

    if (!validation.success) {
      const errors = validation.error.issues.map((err) => err.message);
      setValidationErrors(errors);
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      if (imageCover) fd.append("imageCover", imageCover);
      if (subImages)
        Array.from(subImages).forEach((file) => fd.append("subImages", file));

      setLoading(true);
      const newProduct = await addProduct(fd);
      Swal.fire("Success", "Product added successfully!", "success");
      onProductAdded(newProduct);
      onClose();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] border border-gray-300 dark:border-gray-700 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[var(--color-primary)] text-white rounded-t-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaPlusCircle /> Add New Product
          </h2>
          <button onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {validationErrors.length > 0 && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaTag /> Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              rows={3}
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FaDollarSign /> Price (EGP)
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Discount (%)</label>
              <input
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
                placeholder="Optional discount"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
                placeholder="Stock quantity"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FaBoxOpen /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaImage /> Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageCover(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sub Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setSubImages(e.target.files)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
