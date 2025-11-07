import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaImage,
  FaInfoCircle,
  FaBoxOpen,
} from "react-icons/fa";
import type { IProduct } from "../../DashBordInterfaces/ProductsInterfaces";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: IProduct;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  product,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-2xl shadow-2xl border border-[var(--color-border)] animate-fadeIn">
        {/* header */}
        <div className="flex justify-between items-center bg-[var(--color-primary)] text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaInfoCircle /> Product Details
          </h2>
          <button
            onClick={onClose}
            className="hover:text-[var(--mist-300)] transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* basic Info */}
          <div className="space-y-3">
            <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
              <FaInfoCircle /> Basic Information
            </h3>
            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <p>
                  <strong>ID:</strong> {product._id}
                </p>
                <p>
                  <strong>Title:</strong> {product.title}
                </p>
                <p className="col-span-2">
                  <strong>Description:</strong> {product.description}
                </p>
                <p>
                  <span className="flex items-center gap-1 inline">
                    <p>
                      <strong>Price:</strong>{" "}
                      <span className="text-green-600 font-semibold">
                        {product.price} EGP
                      </span>
                    </p>
                  </span>
                </p>
                <p>
                  <strong>Discount:</strong> {product.discount}%
                </p>
                <p>
                  <strong>Final Price:</strong> {product.finalPrice}
                </p>
                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>
                <p>
                  <strong>Rating:</strong> ⭐ {product.rate}
                </p>
              </div>
            </div>
          </div>

          {/* category info */}
          <div>
            <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
              <FaBoxOpen /> Category
            </h3>
            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)] flex items-center gap-4">
              <img
                src={product.category?.image?.secure_url}
                alt={product.category?.name}
                className="w-16 h-16 rounded-lg object-cover border"
              />
              <div>
                <p>
                  <strong>Name:</strong> {product.category?.name}
                </p>
                <p>
                  <strong>ID:</strong> {product.category?._id}
                </p>
              </div>
            </div>
          </div>

          {/* seller info */}
          <div>
            <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
              <FaUser /> Seller Information
            </h3>
            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)]">
              <p>
                <strong>Name:</strong> {product.createdBy?.userName}
              </p>
              <p>
                <strong>Phone:</strong> {product.createdBy?.mobileNumber}
              </p>
              <p>
                <strong>Address:</strong> {product.createdBy?.address || "N/A"}
              </p>
            </div>
          </div>

          {/* images */}
          <div>
            <h3 className="text-[var(--color-primary)] font-semibold text-lg flex items-center gap-2">
              <FaImage /> Images
            </h3>
            <div className="flex flex-wrap gap-3 mt-3">
              {[product.imageCover, ...(product.subImages || [])].map(
                (img, idx) => (
                  <img
                    key={idx}
                    src={img.secure_url}
                    alt={`Product image ${idx + 1}`}
                    onClick={() => setSelectedImage(img.secure_url)}
                    className="w-24 h-24 rounded-lg object-cover border cursor-pointer hover:scale-105 transition-transform"
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-2xl max-h-[80vh] rounded-lg shadow-lg border border-gray-600"
          />
        </div>
      )}
    </div>
  );
};

export default ProductModal;
