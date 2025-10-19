import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchWishlist,
  clearWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch } from "../../Store/store";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import { useEffect } from "react";

export default function WishlistModal({ open, onClose, onAddToCart }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: any) => state.wishlist);

  // pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // adjust per page count

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  //if current page in navigation becomes empty go back
  useEffect(() => {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  // if current page is out of range (e.g. after removals), reset to page 1
  if (currentPage >= totalPages && currentPage > 0) {
    setCurrentPage(totalPages > 0 ? totalPages - 1 : 0);
  }
}, [items, currentPage, itemsPerPage]);

  // fetch wishlist when modal opens
  useQuery({
  queryKey: ["wishlist"],
  queryFn: async () => {
    const result = await dispatch(fetchWishlist());

    // Check if the thunk failed
    if (result.meta.requestStatus === "rejected") {
      throw new Error("Failed to load wishlist");
    }
    return result.payload;
  },
  enabled: open,
  refetchOnWindowFocus: false,
  retry: false, // don't auto retry
  staleTime: 0, // always refetch when opened
  gcTime: 0, // no cache stored(garbage collection time)
});

  const handleRemove = async (id: string) => {
    await dispatch(removeFromWishlist(id));
    toast.success("Item removed from wishlist 🖤");
  };

  const handleClear = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your wishlist?"
    );
    if (confirmed) {
      await dispatch(clearWishlist());
      toast.success("Wishlist Cleared 🖤");
    }
  };

  const navigate = useNavigate();


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
            <Dialog.Panel className="relative w-full max-w-3xl rounded-2xl bg-[#FAF9F7]/90 dark:bg-[#101b31ff]/80 py-6 p-x-2 shadow-xl">  {/* #101b31ff */}
              <div className="px-6 py-2 h-[85vh]">
                <button
                  onClick={handleClear}
                  title="Clear entire wishlist"
                  className="absolute top-4 left-4 bg-white hover:bg-black hover:text-white text-gray-600 rounded-full p-2 shadow transition border-b-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-5 text-white bg-black rounded-full shadow p-1 border-b-2 transition w-7 h-7 flex items-center justify-center"
                >
                  ✕
                </button>

                <Dialog.Title className="text-3xl font-serif text-[var(--color-blue)] mb-4 text-center dark:text-[#dad7cd]">  {/*text-gray-900 */}
                  My Wishlist
                </Dialog.Title>

                {loading ? (
                <p className="text-center">Loading...</p>
                 ) : error ? (
                 <p className="text-center text-red-500">Failed to load wishlist.</p>
                 ) : items.length === 0 ? (
                 <p className="text-center text-gray-500 dark:text-[#dad7cd]">
                  Your wishlist is empty.
                 </p>
                ) : (
                  <>
                    <div className="overflow-y-auto max-h-[65vh] px-6">
                      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto">
                        {currentItems.map((product: any) => (
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
                             onClose(); // closes modal
                             navigate(`/productDetails/${product._id}`); // goes to product detail
                             }}
                            />
                            <div className="p-3 text-center">
                              <h3 className="text-sm font-semibold text-gray-800 truncate dark:text-[#dad7cd]">
                                {product.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-[#dad7cd]">
                                {product.finalPrice} EGP
                              </p>
                              <button
                                onClick={() => {
                                dispatch(addProductToCart(product._id));  //added to cart
                                dispatch(removeFromWishlist(product._id)); //removed from wishlist
                                toast.success("Added to cart 🛒");
                                 }}
                                className="mt-2 w-full bg-[#d4a762] hover:bg-[#b9894e] text-white py-1.5 rounded-md transition"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination controls */}
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