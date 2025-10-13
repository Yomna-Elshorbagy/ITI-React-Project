import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../Hooks/reduxHooks";
import {
  getUserCart,
  updateCartQuantity,
  deleteCartItem,
  clearCartApi,
} from "../../Store/Slices/CartSlice";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { motion } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleShoppingClick = () => {
    navigate("/products");
  };
  const { products, totalPrice, loading } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  if (loading) return <LoaderPage />;

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-180px)] gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-800 dark:text-white"
        >
          🛒 Your Shopping Cart
        </motion.h1>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-3xl p-10 max-w-md text-center border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse our latest collections and add items to your cart!
          </p>
          <button
            onClick={handleShoppingClick}
            className="mt-6 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition font-medium shadow-lg"
          >
            Go Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  // const handleUpdateQuantity = (id: any, quantity: number) => {
  //   if (quantity > 0) dispatch(updateCartQuantity({ id, newCount: quantity }));
  // };

  const handleUpdateQuantity = (id: any, newQuantity: number) => {
    const product = products.find((p) => p.productId?._id === id);

    if (!product) return;
    if (newQuantity < 1) return;
    const maxStock = product?.productId?.stock || 0;
    if (maxStock && newQuantity > maxStock) {
      MySwal.fire({
        icon: "warning",
        title: "Stock limit reached ⚠️",
        text: `Only ${maxStock} items are available in stock.`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }
    dispatch(updateCartQuantity({ id, newCount: newQuantity }));
  };
  const handleRemoveItem = (id: any) => dispatch(deleteCartItem(id));
  const handleClearCart = () => dispatch(clearCartApi());

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          🛍️ Your Cart
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your items before checkout
        </p>
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 w-[80%] m-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 text-center">Product</th>
              <th className="px-6 py-4 text-center">Quantity</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <motion.tr
                key={item?._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="flex items-center gap-4 px-6 py-4">
                  <img
                    src={
                      item.productId?.imageCover?.secure_url || "product image"
                    }
                    alt={item.productId?.title || "Deleted Product"}
                    className="w-20 h-20 object-cover rounded-2xl shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.productId?.title || "Deleted Product"}
                    </h3>
                    {item.category?.name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.category.name}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId?._id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId?._id,
                          +e.target.value
                        )
                      }
                      className="w-14 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId?._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                  {item.price * item.quantity} EGP
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleRemoveItem(item.productId?._id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-medium transition"
                  >
                    <i className="fa-solid fa-trash cursor-pointer text-lg"></i>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="md:hidden flex flex-col gap-4 mt-4">
        {products.map((item) => (
          <motion.div
            key={item?._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-4 flex flex-col sm:flex-row gap-4 border border-gray-200 dark:border-gray-700"
          >
            <img
              src={item.productId?.imageCover?.secure_url || "product image"}
              alt={item.productId?.title || "Deleted Product"}
              className="w-full sm:w-32 h-32 object-cover rounded-xl"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.productId?.title || "Deleted Product"}
                </h3>
                {item.category?.name && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.category.name}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId?._id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      handleUpdateQuantity(item.productId?._id, +e.target.value)
                    }
                    className="w-14 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId?._id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.price * item.quantity} EGP
                </span>
              </div>
              <button
                onClick={() => handleRemoveItem(item.productId?._id)}
                className="mt-3 text-red-600 dark:text-red-400 hover:text-red-700 font-medium transition"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 w-[80%] m-auto">
        <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Total: <span className="text-teal-700">{totalPrice} EGP</span>
        </span>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleShoppingClick}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium text-lg"
          >
            <i className="fa-solid fa-cart-shopping"></i>{" "}
          </button>
          <button
            onClick={handleClearCart}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium shadow-md"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
          <button className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium shadow-md">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
