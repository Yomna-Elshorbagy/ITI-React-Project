import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../Hooks/reduxHooks";
import {
  getUserCart,
  updateCartQuantity,
  deleteCartItem,
  clearCartApi,
} from "../../Store/Slices/CartSlice";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { products, totalPrice } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  if (!products) {
    <LoaderPage />;
  }
  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-180px)] gap-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          🛒 Your Shopping Cart
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse products and add them to your cart to get started!
          </p>
        </div>
      </div>
    );
  }

  // ===== Handlers =====
  const handleUpdateQuantity = (id: any, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ id, newCount: quantity }));
    }
  };

  const handleRemoveItem = (id: any) => {
    dispatch(deleteCartItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCartApi());
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        🛒 Shopping Cart
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-center">Product</th>
              <th className="px-6 py-3 text-center">Quantity</th>
              <th className="px-6 py-3 text-center">Price</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr
              
                key={item?._id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="flex items-center gap-4 px-6 py-4">
                  <img
                    src={item.productId?.imageCover?.secure_url || "product image"}
                    alt={item.productId?.title || "Deleted Product"}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
       
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId?._id,
                          item.quantity - 1 > 0 ? item.quantity - 1 : 1
                        )
                      }
                    >
                      -
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
                      className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 font-medium transition"
                    onClick={() => handleRemoveItem(item.productId?._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((item) => (
          <div
            key={item?._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 flex flex-col sm:flex-row gap-4"
          >
            <img
              src={item.productId?.imageCover?.secure_url || "product image"}
              alt={item.productId?.title || "Deleted Product"}
              className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-sm"
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
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId?._id,
                        item.quantity - 1 > 0 ? item.quantity - 1 : 1
                      )
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      handleUpdateQuantity(item.productId?._id, +e.target.value)
                    }
                    className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
                className="mt-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 font-medium transition self-start"
                onClick={() => handleRemoveItem(item.productId?._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <span className="text-xl font-semibold">Total: {totalPrice} EGP</span>
        <div className="flex gap-4 flex-wrap">
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Continue Shopping
          </button>

          <button
            onClick={() => handleClearCart()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Clear Cart
          </button>

          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
