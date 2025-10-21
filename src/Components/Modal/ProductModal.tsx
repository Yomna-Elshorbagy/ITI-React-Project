import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { addToWishlist } from "../../Store/Slices/WishlistSlice";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import { toast } from "react-hot-toast";
import type { RelatedProduct } from "../../Types/RelatedProduct";

interface ProductModalProps {
  product: RelatedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const dispatch = useAppDispatch();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) return null;

  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);
    try {
      await dispatch(addToWishlist(product._id));
      toast.success("Added to wishlist ❤️");
    } catch (error) {
      toast.error("Failed to add to wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await dispatch(addProductToCart(product._id));
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
          <div className="fixed inset-0 bg-black/50" />
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
            <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">
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
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>

                  <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </Dialog.Title>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.finalPrice}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="fa-solid fa-check-circle text-green-500"></i>
                      <span>In Stock ({product.stock})</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleAddToWishlist}
                      disabled={isAddingToWishlist}
                      className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isAddingToWishlist ? (
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fa-solid fa-heart mr-2"></i>
                      )}
                      Add to Wishlist
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isAddingToCart ? (
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fa-solid fa-shopping-cart mr-2"></i>
                      )}
                      Add to Cart
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
