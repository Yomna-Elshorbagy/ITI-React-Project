import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


import {
  fetchWishlist,
  clearWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { addProductToCart } from "../../Store/Slices/CartSlice";

import type { AppDispatch, RootState } from "../../Store/store";
import type { WishlistModalProps } from "../../Types/WishlistModal";
import type { WishlistItem } from "../../Types/Wishlist";

export default function WishlistModal({ open, onClose }: WishlistModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  //const [addingToCart, setAddingToCart] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const MySwal = withReactContent(Swal);
  const [clearing, setClearing] = useState(false);

  const { items, loading, error } = useSelector(
    (state: RootState) => state.wishlist
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 8;

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage >= totalPages && currentPage > 0) {
      setCurrentPage(totalPages > 0 ? totalPages - 1 : 0);
    }
  }, [items, currentPage, itemsPerPage]);

  // Fetch wishlist when modal opens
  useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const result = await dispatch(fetchWishlist());
      if (result.meta.requestStatus === "rejected") {
        throw new Error("Failed to load wishlist");
      }
      return result.payload;
    },
    enabled: open,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  const handleRemove = async (id: string) => {
    const product = items.find((p) => p._id === id);

    try {
      await dispatch(removeFromWishlist(id)).unwrap();
      toast.success(`${product?.title || "Item"} removed from wishlist ❌`);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error(`Failed to remove ${product?.title || "item"} from wishlist ❌`);
    }
  };

  const handleClear = async () => {
    const result = await MySwal.fire({
      title: "Clear Wishlist?",
      text: "This will remove all items from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b9894e",
      cancelButtonColor: "#444",
      background: "var(--color-surface)",
      color: "var(--color-text)",
      customClass: {
        popup: "rounded-2xl shadow-lg",
        title: "font-serif text-xl",
        confirmButton: "px-4 py-2 font-medium rounded-md",
        cancelButton: "px-4 py-2 font-medium rounded-md",
      },
    });

    if (result.isConfirmed) {
      try {
        setClearing(true);
        await dispatch(clearWishlist())
        toast.success("Wishlist Cleared 🖤");

      } catch (err) {
        toast.error("Failed to clear wishlist");
      } finally {
        setClearing(false);
      }
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/40" />
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
            <Dialog.Panel className="relative w-full max-w-3xl rounded-2xl bg-[#FAF9F7]/90 dark:bg-[#101b31ff]/80 py-6 shadow-xl">
              <div className="px-6 py-2 h-[85vh]">
                {/* Clear All Button */}
                <button
                  onClick={handleClear}
                  title="Clear entire wishlist"
                  disabled={clearing}
                  className={`absolute top-4 left-4 rounded-full p-2 shadow transition border-b-2 ${clearing
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white hover:bg-black hover:text-white text-gray-600"
                    }`}
                >
                  {clearing ? (
                    <i className="fa-solid fa-spinner fa-spin w-4 h-4"></i>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-5 text-white bg-black rounded-full shadow p-1 border-b-2 transition w-7 h-7 flex items-center justify-center"
                >
                  ✕
                </button>

                <Dialog.Title className="text-3xl font-serif text-[var(--color-blue)] mb-4 text-center dark:text-[#dad7cd]">
                  My Wishlist
                </Dialog.Title>

                {loading ? (
                  <p className="text-center">Loading...</p>
                ) : error ? (
                  <p className="text-center text-red-500">
                    Failed to load wishlist.
                  </p>
                ) : items.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-[#dad7cd]">
                    Your wishlist is empty.
                  </p>
                ) : (
                  <>
                    <div className="overflow-y-auto max-h-[65vh] px-6">
                      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {currentItems.map((product: WishlistItem) => (
                          <div
                            key={product._id}
                            className="relative rounded-xl border border-gray-300 dark:border-[var(--color-heartOp)] shadow hover:shadow-lg transition overflow-hidden"
                          >
                            <button
                              onClick={() => handleRemove(product._id)}
                              className="absolute top-2 left-2 bg-white/50 hover:bg-black hover:text-white text-gray-600 rounded-full w-5 h-5 flex items-center justify-center shadow-sm transition"
                              title="Remove from wishlist"
                            >
                              ✕
                            </button>

                            <img
                              src={product.imageCover?.secure_url}
                              alt={product.title}
                              className="w-full h-38 object-cover cursor-pointer"
                              onClick={() => {
                                onClose();
                                navigate(`/productDetails/${product._id}`);
                              }}
                            />

                            <div className="p-3 text-center">
                              <h3 className="text-sm font-semibold text-gray-800 truncate dark:text-[#dad7cd]">
                                {product.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-[#dad7cd]">
                                {typeof product.finalPrice === "number"
                                  ? product.finalPrice
                                  : String(product.finalPrice)}{" "}
                                EGP
                              </p>
                              <button
                                onClick={async () => {
                                  if ((product.stock ?? 0 )> 0 && !addingProductId) {
                                    setAddingProductId(product._id);
                                    try {
                                      await dispatch(
                                        addProductToCart({
                                          productId: product._id,
                                          quantity: 1,
                                        })
                                      ).unwrap();
                                      dispatch(removeFromWishlist(product._id));
                                      toast.success(`${product.title} added to cart 🛒`);
                                    } catch (err) {
                                      console.error(err);
                                      toast.error(`Failed to add ${product.title} ❌`);
                                    } finally {
                                      setAddingProductId(null);
                                    }
                                  }
                                }}
                                disabled={(product.stock ?? 0 ) <= 0 || addingProductId === product._id}
                                className={`mt-2 w-full py-1.5 rounded-md transition font-medium flex items-center justify-center ${(product.stock ?? 0 )> 0
                                    ? "bg-[#d4a762] hover:bg-[#b9894e] text-white"
                                    : "bg-gray-400 cursor-not-allowed text-gray-100"
                                  }`}
                              >
                                {addingProductId === product._id ? (
                                  <>
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> Adding...
                                  </>
                                ) : (product.stock ?? 0 ) > 0 ? (
                                  "Add to Cart"
                                ) : (
                                  "Out of Stock"
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination */}
                    {pageCount > 1 && (
                      <div className="flex justify-center mt-4">
                        <ReactPaginate
                          previousLabel={""}
                          nextLabel={""}
                          pageCount={pageCount}
                          onPageChange={handlePageClick}
                          containerClassName="flex space-x-2"
                          pageClassName="px-3 py-1 border rounded-md cursor-pointer"
                          activeClassName="bg-black text-white"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
