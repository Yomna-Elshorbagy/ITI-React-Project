import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { addToWishlist, removeFromWishlist } from "../../Store/Slices/WishlistSlice";
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="relative w-full max-w-2xl bg-[var(--color-surface)] dark:bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)]">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2">
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

                {/* Content Section */}
                <div className="md:w-1/2 p-6">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-2xl transition-colors"
                  >
                    ×
                  </button>

                  <Dialog.Title className="text-2xl font-bold text-[var(--color-text)] mb-2">
                    {product.title}
                  </Dialog.Title>

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

                  <div className="space-y-3">
                    <button
                      onClick={handleAddToWishlist}
                      disabled={isAddingToWishlist}
                      className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 border border-[var(--color-border)] ${
                        inWishlist
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-[var(--color-text)]"
                      }`}
                    >
                      {isAddingToWishlist ? (
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className={`fa-solid fa-heart mr-2 ${inWishlist ? "text-red-500" : ""}`}></i>
                      )}
                      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || isOutOfStock}
                      title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      className={`w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
