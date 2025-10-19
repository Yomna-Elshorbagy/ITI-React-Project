import React, { useEffect, useState } from "react";
import { FaTimes, FaEdit, FaImage, FaTag, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { updateProduct } from "../../Apis/Products";
import type { IProduct } from "../../DashBordInterfaces/ProductsInterfaces";
import { getAllCategories } from "../../Apis/CategoryApis";

const productSchema =  z.object({
  title: z.string().min(1, "Title must not be empty").optional(),
  description: z.string().min(3, "Description too short").optional(),
  price: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().positive("Price must be positive").optional()
    ),
  discount: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0).max(100, "Discount must be between 0–100").optional()
    ),
  stock: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().int().min(0, "Stock must be >= 0").optional()
    ),
  category: z.string().optional(),
  imageCover: z.any().optional(),
  subImages: z.any().optional(),
});

interface EditProductModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdated,
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
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        console.log(res);
        
        setCategories(res|| []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        discount: product.discount?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category?._id || "",
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = productSchema.safeParse(formData);
    if (!result.success) {
      Swal.fire("Validation Error", "Please check your input fields", "error");
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      if (imageCover) fd.append("imageCover", imageCover);
      if (subImages) {
        Array.from(subImages).forEach((file) => fd.append("subImages", file));
      }

      await updateProduct(product._id, fd);
      Swal.fire("Success", "Product updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (error: any) {
      Swal.fire("Error", error.response?.data?.message || "Update failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] border border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center px-6 py-4 bg-[var(--color-primary)] text-white rounded-t-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaEdit /> Edit Product
          </h2>
          <button onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaTag /> Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
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
            <input type="file" onChange={(e) => setImageCover(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label className="block font-medium mb-1">Sub Images</label>
            <input type="file" multiple onChange={(e) => setSubImages(e.target.files)} />
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
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
