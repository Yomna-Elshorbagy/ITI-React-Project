import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Hooks/reduxHooks";
import {
  getUserCart,
  updateCartQuantity,
  deleteCartItem,
  clearCartApi,
} from "../../Store/Slices/CartSlice";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { motion } from "framer-motion";
import styles from "./Cart.module.css";
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  if (loading) return <LoaderPage />;

  if (products.length === 0) {
    return (
      <div
        className={`${styles.container} flex flex-col justify-center items-center h-[calc(100vh-180px)] gap-6`}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${styles.title} text-center`}
        >
          🛒 Your Shopping Cart
        </motion.h1>
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${styles.emptyBox} text-center mt-4`}
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

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional UX improvement
  };
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
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>🛍️ Your Cart</h1>
        <p className={styles.subtitle}>Manage your items before checkout</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.items}>
          <div className="flex flex-col gap-4">
            {currentItems.map((item) => (
              <motion.div
                key={item?._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.card}
              >
                <img
                  src={
                    item.productId?.imageCover?.secure_url || "product image"
                  }
                  alt={item.productId?.title || "Deleted Product"}
                  className={styles.thumb}
                />
                <div className={styles.meta}>
                  <h3 className={styles.name}>
                    {item.productId?.title || "Deleted Product"}
                  </h3>
                </div>

                <div className={styles.controls}>
                  <button
                    className={styles.ghostBtn}
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
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.ghostBtn}
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

                <div style={{ minWidth: 110, textAlign: "right" }}>
                  <div className={styles.price}>
                    {item.price * item.quantity} EGP
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId?._id)}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash cursor-pointer text-lg"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md border ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 rounded-md border transition-colors duration-200
                ${
                  currentPage === i + 1
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary-hover)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-hover)]"
                }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md border ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryRow}>
            <div>Subtotal</div>
            <div className="font-semibold">{totalPrice} EGP</div>
          </div>
          <div className={styles.summaryRow}>
            <div>Delivery</div>
            <div className="text-sm text-gray-600">Calculated at checkout</div>
          </div>
          <div className={styles.summaryRow}>
            <div>Total</div>
            <div className="font-bold text-lg text-teal-700">
              {totalPrice} EGP
            </div>
          </div>

          <button className={styles.checkoutBtn}>Checkout</button>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleShoppingClick}
              className="px-4 py-2 rounded-md border"
            >
              Continue shopping
            </button>
            <button
              onClick={handleClearCart}
              className="px-4 py-2 rounded-md bg-red-600 text-white"
            >
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
