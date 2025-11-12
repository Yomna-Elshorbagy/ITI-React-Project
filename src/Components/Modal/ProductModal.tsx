import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import { toast } from "react-hot-toast";
import type { RelatedProduct } from "../../Types/RelatedProduct";

interface ProductModalProps {
  product: RelatedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isOutOfStock = (product?.stock ?? 0) <= 0;

  if (!product) return null;
  const inWishlist = wishlistItems?.some((w) => w._id === product._id);

  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);
    try {
      if (inWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success("Removed from wishlist ❌");
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Out of stock ❌");
      return;
    }
    setIsAddingToCart(true);
    try {
      await dispatch(
        addProductToCart({ productId: product._id, quantity: 1 })
      ).unwrap();
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        {/* الخلفية (Backdrop) */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        />

        {/* المحتوى */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition
            show={isOpen}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <DialogPanel className="relative w-full max-w-2xl bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)]">
              <div className="flex flex-col md:flex-row relative">
                {/* Close Button - Moved to top-right corner */}
                <button
                  onClick={onClose}
                  className="absolute -top-10 right-0 text-2xl text-white hover:text-gray-300 z-10 md:top-2 md:right-2 md:text-gray-700 md:hover:text-gray-900 dark:md:text-gray-300 dark:md:hover:text-white"
                >
                  ×
                </button>
                
                {/* Product Image */}
                <div className="relative md:w-1/2">
                  <img
                    src={product.imageCover.secure_url}
                    alt={product.title}
                    className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* التفاصيل */}
                <div className="md:w-1/2 p-6">
                  <DialogTitle className="text-2xl font-bold text-[var(--color-text)] mb-2">
                    {product.title}
                  </DialogTitle>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-[var(--color-primary)]">
                        ${product.finalPrice}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-lg text-[var(--color-text-muted)] line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      {isOutOfStock ? (
                        <>
                          <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                          <span>Out of Stock</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check-circle text-[var(--color-success)]"></i>
                          <span>In Stock ({product.stock})</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={handleAddToWishlist}
                      disabled={isAddingToWishlist}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        inWishlist
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-[var(--color-text)]"
                      }`}
                    >
                      {isAddingToWishlist ? (
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i
                          className={`fa-solid fa-heart mr-2 ${
                            inWishlist ? "text-red-500" : ""
                          }`}
                        ></i>
                      )}
                      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || isOutOfStock}
                      title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                      }`}
                    >
                      {isAddingToCart ? (
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fa-solid fa-shopping-cart mr-2"></i>
                      )}
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
}
